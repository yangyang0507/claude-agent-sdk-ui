/**
 * UIRenderer - 主渲染器
 */

import React from 'react';
import { render } from 'ink';
import type { SDKAssistantMessage, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions, RendererState, SessionStats, ToolCallInfo } from '../types/renderer.js';
import { ThemeProvider } from '../hooks/use-theme.js';
import { useWaitingState } from '../hooks/use-waiting-state.js';
import { useCommandMode } from '../hooks/use-command-mode.js';
import { MessageRouter } from './message-router.js';
import { normalizeOptions } from './options.js';
import { deriveToolExecutionState, updateToolExecutionState, type ToolExecutionStateMap } from '../utils/tool-states.js';
import { StatusLine } from '../components/ui/status-line.js';
import { isAssistantMessage, isSystemInitMessage, isStreamEventMessage } from '../types/messages.js';
import { SessionLogger } from '../utils/logger.js';
import { AppLayoutProxy } from '../components/proxy/app-layout-proxy.js';
import { CommandOverlay } from '../components/ui/command-overlay.js';
import { TimestampLine } from '../components/ui/timestamp-line.js';
import { formatTimestamp } from '../utils/time.js';
import { StreamAssembler } from './stream-assembler.js';
import { StatsTracker } from './stats-tracker.js';

function trimMessages(messages: SDKMessage[], maxMessages: number): SDKMessage[] {
  if (!maxMessages || maxMessages <= 0) {
    return messages;
  }
  if (messages.length <= maxMessages) {
    return messages;
  }

  const tail = messages.slice(-maxMessages);

  if (maxMessages > 1) {
    const systemIndex = (() => {
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        if (isSystemInitMessage(messages[i])) {
          return i;
        }
      }
      return -1;
    })();

    if (systemIndex !== -1 && systemIndex < messages.length - maxMessages) {
      return [messages[systemIndex], ...messages.slice(-(maxMessages - 1))];
    }
  }

  return tail;
}

function deriveStreamingFromEvent(eventType: string | undefined, current: boolean): boolean {
  if (!eventType) {
    return current;
  }
  if (eventType === 'message_stop') {
    return false;
  }
  if (eventType === 'message_start') {
    return true;
  }
  if (
    eventType === 'message_delta' ||
    eventType.startsWith('content_block')
  ) {
    return true;
  }
  return current;
}

interface UIRendererAppProps {
  messages: SDKMessage[];
  options: Required<RendererOptions>;
  isStreaming: boolean;
  partialMessage?: SDKAssistantMessage | null;
  toolStates: ToolExecutionStateMap;
}

/**
 * 渲染器主应用组件
 */
const UIRendererApp: React.FC<UIRendererAppProps> = ({
  messages,
  options,
  isStreaming,
  partialMessage,
  toolStates,
}) => {
  const commandState = useCommandMode(options);
  const effectiveOptions = commandState.options;
  const displayMessages = React.useMemo(
    () => (partialMessage ? [...messages, partialMessage] : messages),
    [messages, partialMessage]
  );
  const effectiveToolStates = React.useMemo(() => {
    if (!partialMessage) {
      return toolStates;
    }

    const nextState = { ...toolStates };
    updateToolExecutionState(nextState, partialMessage);
    return nextState;
  }, [partialMessage, toolStates]);

  const waitingState = useWaitingState(displayMessages, { isStreaming });

  return (
    <ThemeProvider theme={effectiveOptions.theme}>
      <AppLayoutProxy messages={displayMessages} isStreaming={isStreaming}>
        {displayMessages.map((message, index) => {
          const timestampLabel = effectiveOptions.showTimestamps
            ? formatMessageTimestamp(message)
            : null;

          return (
            <React.Fragment key={index}>
              {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <MessageRouter
                  message={message}
                  options={effectiveOptions}
                  toolStates={effectiveToolStates}
                  toolOutputPreviewLines={commandState.toolOutputPreviewLines}
                />
              </React.Fragment>
          );
        })}

        {/* 显示等待状态 */}
        {waitingState.show && (
          <StatusLine
            status="active"
            spinner={true}
            label={waitingState.message}
            marginBottom={1}
          />
        )}

        <CommandOverlay
          commandMode={commandState.commandMode}
          showHelp={commandState.showHelp}
          feedback={commandState.feedback}
        />
      </AppLayoutProxy>
    </ThemeProvider>
  );
};

function formatMessageTimestamp(message: SDKMessage): string | null {
  const rawTimestamp = (message as { timestamp?: string | number | Date }).timestamp;
  if (!rawTimestamp) {
    return null;
  }
  const date = rawTimestamp instanceof Date ? rawTimestamp : new Date(rawTimestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return formatTimestamp(date);
}

/**
 * 主渲染器类
 *
 * 管理整个渲染会话，维护消息历史
 *
 * @example
 * ```typescript
 * const renderer = new UIRenderer({ theme: 'dark' });
 * await renderer.render(message);
 * renderer.cleanup();
 * ```
 */
export class UIRenderer {
  private messages: SDKMessage[] = [];
  private options: Required<RendererOptions>;
  private app: ReturnType<typeof render> | null = null;
  private logger: SessionLogger | null = null;
  private currentSessionId: string | null = null;
  private isStreaming: boolean = false;
  private streamAssembler = new StreamAssembler();
  private partialMessage: SDKAssistantMessage | null = null;
  private statsTracker = new StatsTracker();
  private toolStates: ToolExecutionStateMap = {};

  constructor(options: RendererOptions = {}) {
    this.options = normalizeOptions(options);

    // 初始化日志记录器
    if (this.options.logging && this.options.logging.enabled) {
      this.logger = new SessionLogger(this.options.logging);
    }
  }

  /**
   * 渲染单条消息
   */
  async render(message: SDKMessage): Promise<void> {
    // 如果是 stream_event，更新流式状态但不添加到消息列表
    if (isStreamEventMessage(message)) {
      if (!this.currentSessionId && message.session_id) {
        this.currentSessionId = message.session_id;
      }

      const eventType = message.event?.type;

      this.isStreaming = deriveStreamingFromEvent(eventType, this.isStreaming);

      const partial = this.streamAssembler.handleEvent(message);
      if (partial) {
        this.partialMessage = partial;
      }

      // 如果还没有 sessionId，忽略 stream_event（不记录日志也不渲染）
      if (!this.currentSessionId) {
        return;
      }

      // 记录日志但不添加到显示的消息列表
      if (this.logger) {
        await this.logger.log(message, this.currentSessionId);
      }

      const messagesCopy = [...this.messages];
      if (!this.app) {
        this.app = render(
          <UIRendererApp
            messages={messagesCopy}
            options={this.options}
            isStreaming={this.isStreaming}
            partialMessage={this.partialMessage}
          />
        );
      } else {
        this.app.rerender(
          <UIRendererApp
            messages={messagesCopy}
            options={this.options}
            isStreaming={this.isStreaming}
            partialMessage={this.partialMessage}
          />
        );
      }

      return;
    }

    // 非 stream_event 消息，正常处理
    if (this.partialMessage && isAssistantMessage(message)) {
      this.partialMessage = null;
      this.streamAssembler.reset();
    }

    this.statsTracker.update(message);
    this.messages.push(message);
    const beforeMessages = this.messages;
    const trimmed = trimMessages(this.messages, this.options.maxMessages);
    const trimmedChanged = trimmed !== beforeMessages;
    this.messages = trimmed;

    // 从 system init 消息中提取 session ID
    if (isSystemInitMessage(message) && 'session_id' in message && message.session_id) {
      this.currentSessionId = message.session_id;
    }

    // 如果是 assistant 消息，结束流式状态
    if (isAssistantMessage(message)) {
      this.isStreaming = false;
    }

    updateToolExecutionState(this.toolStates, message);
    if (trimmedChanged) {
      this.toolStates = deriveToolExecutionState(this.messages);
      this.statsTracker.trimHistory(this.messages);
    }

    // 记录日志
    if (this.logger && this.currentSessionId) {
      await this.logger.log(message, this.currentSessionId);
    }

    // 创建新数组以触发 React 重新渲染
    const messagesCopy = [...this.messages];

    // 如果还没有创建 app，创建一个
    if (!this.app) {
      this.app = render(
        <UIRendererApp
          messages={messagesCopy}
          options={this.options}
          isStreaming={this.isStreaming}
          partialMessage={this.partialMessage}
          toolStates={this.toolStates}
        />
      );
    } else {
      // 重新渲染（Ink 会自动处理增量更新）
      this.app.rerender(
        <UIRendererApp
          messages={messagesCopy}
          options={this.options}
          isStreaming={this.isStreaming}
          partialMessage={this.partialMessage}
          toolStates={this.toolStates}
        />
      );
    }
  }

  /**
   * 获取当前渲染的消息列表
   */
  getMessages(): SDKMessage[] {
    return [...this.messages];
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }

    // 关闭日志记录器
    if (this.logger) {
      await this.logger.close();
    }

    this.messages = [];
    this.currentSessionId = null;
    this.isStreaming = false;
    this.partialMessage = null;
    this.streamAssembler.reset();
    this.statsTracker.reset();
    this.toolStates = {};
  }

  /**
   * 重置渲染器状态
   */
  async reset(): Promise<void> {
    await this.cleanup();
  }

  /**
   * 获取日志记录器
   */
  getLogger(): SessionLogger | null {
    return this.logger;
  }

  /**
   * 获取当前日志文件路径
   */
  getLogFilePath(): string | null {
    return this.logger?.getLogFilePath() ?? null;
  }

  /**
   * 获取当前渲染器状态
   */
  getState(): RendererState {
    return this.statsTracker.getState();
  }

  /**
   * 获取会话统计信息
   */
  getStats(): SessionStats | null {
    return this.statsTracker.getStats();
  }

  /**
   * 获取工具调用信息
   */
  getToolCalls(): ToolCallInfo[] {
    return this.statsTracker.getToolCalls();
  }
}

/**
 * 创建 UI 渲染器实例
 */
export function createRenderer(options?: RendererOptions): UIRenderer {
  return new UIRenderer(options);
}
