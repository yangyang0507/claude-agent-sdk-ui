/**
 * StreamingRenderer - 流式渲染器
 *
 * 支持流式显示消息内容，带打字机效果
 */

import React from 'react';
import { render } from 'ink';
import type { SDKAssistantMessage, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions, RendererState, SessionStats, ToolCallInfo } from '../types/renderer.js';
import { ThemeProvider } from '../hooks/use-theme.js';
import { useWaitingState } from '../hooks/use-waiting-state.js';
import { useCommandMode } from '../hooks/use-command-mode.js';
import { SystemMessageProxy } from '../components/proxy/system-message-proxy.js';
import { StreamingAssistantMessageProxy } from '../components/proxy/streaming-assistant-message-proxy.js';
import { ToolResultMessageProxy } from '../components/proxy/tool-result-message-proxy.js';
import { FinalResultProxy } from '../components/proxy/final-result-proxy.js';
import { AppLayoutProxy } from '../components/proxy/app-layout-proxy.js';
import {
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
  isStreamEventMessage,
} from '../types/messages.js';
import { normalizeOptions, STREAMING_RENDERER_DEFAULTS } from './options.js';
import { deriveToolExecutionState } from '../utils/tool-states.js';
import { StatusLine } from '../components/ui/status-line.js';
import { CommandOverlay } from '../components/ui/command-overlay.js';
import { TimestampLine } from '../components/ui/timestamp-line.js';
import { formatTimestamp } from '../utils/time.js';
import { StreamAssembler } from './stream-assembler.js';
import { StatsTracker } from './stats-tracker.js';

interface StreamingRendererAppProps {
  messages: SDKMessage[];
  options: Required<RendererOptions>;
  currentStreamingIndex: number;
  onStreamComplete: () => void;
  partialMessage?: SDKAssistantMessage | null;
  streamingFromEvents?: boolean;
}

/**
 * 流式渲染器主应用组件
 */
const StreamingRendererApp: React.FC<StreamingRendererAppProps> = ({
  messages,
  options,
  currentStreamingIndex,
  onStreamComplete,
  partialMessage,
  streamingFromEvents = false,
}) => {
  const commandState = useCommandMode(options);
  const effectiveOptions = commandState.options;
  const displayMessages = React.useMemo(
    () => (partialMessage ? [...messages, partialMessage] : messages),
    [messages, partialMessage]
  );
  const toolStates = React.useMemo(
    () => deriveToolExecutionState(displayMessages),
    [displayMessages]
  );

  const waitingState = useWaitingState(displayMessages, {
    isStreaming: streamingFromEvents,
    currentStreamingIndex,
    streamingEnabled: effectiveOptions.streaming,
    typingEffect: effectiveOptions.typingEffect,
  });

  return (
    <ThemeProvider theme={effectiveOptions.theme}>
      <AppLayoutProxy messages={displayMessages} isStreaming={currentStreamingIndex >= 0 || streamingFromEvents}>
        {displayMessages.map((message, index) => {
          const isStreaming = index === currentStreamingIndex;

          const timestampLabel = effectiveOptions.showTimestamps
            ? formatMessageTimestamp(message)
            : null;

          // System 消息
          if (isSystemInitMessage(message)) {
            return (
              <React.Fragment key={index}>
                {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <SystemMessageProxy message={message} showSessionInfo={effectiveOptions.showSessionInfo} />
              </React.Fragment>
            );
          }

          // Assistant 消息
          if (isAssistantMessage(message)) {
            // 如果是当前正在流式的消息，使用流式组件
            if (isStreaming && effectiveOptions.streaming) {
              return (
                <React.Fragment key={index}>
                  {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                  <StreamingAssistantMessageProxy
                    message={message}
                    showThinking={effectiveOptions.showThinking}
                    showToolDetails={effectiveOptions.showToolDetails}
                    showToolContent={effectiveOptions.showToolContent}
                    codeHighlight={effectiveOptions.codeHighlight}
                    typingSpeed={effectiveOptions.typingSpeed}
                    streamingEnabled={effectiveOptions.typingEffect}
                    onStreamComplete={onStreamComplete}
                    toolStates={toolStates}
                  />
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={index}>
                {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <StreamingAssistantMessageProxy
                  message={message}
                  showThinking={effectiveOptions.showThinking}
                  showToolDetails={effectiveOptions.showToolDetails}
                  showToolContent={effectiveOptions.showToolContent}
                  codeHighlight={effectiveOptions.codeHighlight}
                  streamingEnabled={false}
                  toolStates={toolStates}
                />
              </React.Fragment>
            );
          }

          // Tool Result 消息
          if (isUserMessage(message)) {
            return (
              <React.Fragment key={index}>
                {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <ToolResultMessageProxy
                  message={message}
                  maxOutputLines={effectiveOptions.maxOutputLines}
                  previewLines={commandState.toolOutputPreviewLines}
                />
              </React.Fragment>
            );
          }

          // 最终结果
          if (isResultMessage(message)) {
            return (
              <React.Fragment key={index}>
                {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <FinalResultProxy
                  message={message}
                  showFinalResult={effectiveOptions.showFinalResult}
                  showExecutionStats={effectiveOptions.showExecutionStats}
                  showTokenUsage={effectiveOptions.showTokenUsage}
                  codeHighlight={effectiveOptions.codeHighlight}
                />
              </React.Fragment>
            );
          }

          return null;
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
 * 流式渲染器类
 *
 * 支持流式显示消息，带打字机效果
 *
 * @example
 * ```typescript
 * const renderer = new StreamingRenderer({
 *   theme: 'dark',
 *   streaming: true,
 *   typingEffect: true,
 *   typingSpeed: 20,
 * });
 *
 * for await (const message of query({ prompt: '...' })) {
 *   await renderer.render(message);
 * }
 *
 * renderer.cleanup();
 * ```
 */
export class StreamingRenderer {
  private messages: SDKMessage[] = [];
  private options: Required<RendererOptions>;
  private app: ReturnType<typeof render> | null = null;
  private currentStreamingIndex: number = -1;
  private streamCompletePromise: Promise<void> | null = null;
  private streamCompleteResolve: (() => void) | null = null;
  private streamAssembler = new StreamAssembler();
  private partialMessage: SDKAssistantMessage | null = null;
  private streamingFromEvents: boolean = false;
  private usedStreamEventsForCurrentMessage: boolean = false;
  private statsTracker = new StatsTracker();

  constructor(options: RendererOptions = {}) {
    // 使用流式渲染器的默认配置
    this.options = normalizeOptions(options, STREAMING_RENDERER_DEFAULTS);
  }

  /**
   * 创建流式完成的 Promise
   */
  private createStreamCompletePromise(): Promise<void> {
    return new Promise((resolve) => {
      this.streamCompleteResolve = resolve;
    });
  }

  /**
   * 处理流式完成
   */
  private handleStreamComplete = (): void => {
    if (this.streamCompleteResolve) {
      this.streamCompleteResolve();
      this.streamCompleteResolve = null;
    }
  };

  /**
   * 渲染单条消息
   */
  async render(message: SDKMessage): Promise<void> {
    if (isStreamEventMessage(message)) {
      const eventType = message.event?.type;

      if (eventType === 'message_start') {
        this.streamingFromEvents = true;
        this.usedStreamEventsForCurrentMessage = true;
      } else if (eventType === 'message_stop') {
        this.streamingFromEvents = false;
      }

      const partial = this.streamAssembler.handleEvent(message);
      if (partial) {
        this.partialMessage = partial;
      }

      this.currentStreamingIndex = -1;
      this.streamCompletePromise = null;

      const messagesCopy = [...this.messages];

      if (!this.app) {
        this.app = render(
          <StreamingRendererApp
            messages={messagesCopy}
            options={this.options}
            currentStreamingIndex={this.currentStreamingIndex}
            onStreamComplete={this.handleStreamComplete}
            partialMessage={this.partialMessage}
            streamingFromEvents={this.streamingFromEvents}
          />
        );
      } else {
        this.app.rerender(
          <StreamingRendererApp
            messages={messagesCopy}
            options={this.options}
            currentStreamingIndex={this.currentStreamingIndex}
            onStreamComplete={this.handleStreamComplete}
            partialMessage={this.partialMessage}
            streamingFromEvents={this.streamingFromEvents}
          />
        );
      }

      return;
    }

    const hadStreamEvents = this.usedStreamEventsForCurrentMessage && isAssistantMessage(message);
    if (hadStreamEvents) {
      this.partialMessage = null;
      this.streamAssembler.reset();
      this.usedStreamEventsForCurrentMessage = false;
      this.streamingFromEvents = false;
    }

    this.statsTracker.update(message);
    this.messages.push(message);

    // 创建新数组以触发 React 重新渲染
    const messagesCopy = [...this.messages];

    // 如果启用了流式渲染且是 Assistant 消息，设置为当前流式索引
    if (
      this.options.streaming &&
      isAssistantMessage(message) &&
      this.options.typingEffect &&
      !hadStreamEvents
    ) {
      this.currentStreamingIndex = messagesCopy.length - 1;
      this.streamCompletePromise = this.createStreamCompletePromise();
    } else {
      // 非流式消息，不需要等待
      this.currentStreamingIndex = -1;
      this.streamCompletePromise = null;
    }

    // 如果还没有创建 app，创建一个
    if (!this.app) {
      this.app = render(
        <StreamingRendererApp
          messages={messagesCopy}
          options={this.options}
          currentStreamingIndex={this.currentStreamingIndex}
          onStreamComplete={this.handleStreamComplete}
          partialMessage={this.partialMessage}
          streamingFromEvents={this.streamingFromEvents}
        />
      );
    } else {
      // 重新渲染
      this.app.rerender(
        <StreamingRendererApp
          messages={messagesCopy}
          options={this.options}
          currentStreamingIndex={this.currentStreamingIndex}
          onStreamComplete={this.handleStreamComplete}
          partialMessage={this.partialMessage}
          streamingFromEvents={this.streamingFromEvents}
        />
      );
    }

    // 如果是流式消息，等待流式完成
    if (this.streamCompletePromise) {
      await this.streamCompletePromise;
    }
  }

  /**
   * 获取当前渲染的消息列表
   */
  getMessages(): SDKMessage[] {
    return [...this.messages];
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

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }
    this.messages = [];
    this.currentStreamingIndex = -1;
    this.streamCompletePromise = null;
    this.streamCompleteResolve = null;
    this.partialMessage = null;
    this.streamingFromEvents = false;
    this.usedStreamEventsForCurrentMessage = false;
    this.streamAssembler.reset();
    this.statsTracker.reset();
  }

  /**
   * 重置渲染器状态
   */
  async reset(): Promise<void> {
    await this.cleanup();
  }
}

/**
 * 创建流式渲染器实例
 */
export function createStreamingRenderer(options?: RendererOptions): StreamingRenderer {
  return new StreamingRenderer(options);
}
