/**
 * StreamingRenderer - 流式渲染器
 *
 * 支持流式显示消息内容，带打字机效果
 */

import React from 'react';
import { render, Box } from 'ink';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../types/renderer.js';
import { ThemeProvider } from '../hooks/use-theme.js';
import { SystemMessage } from '../components/message/system-message.js';
import { StreamingAssistantMessage } from '../components/message/streaming-assistant-message.js';
import { ToolResultMessage } from '../components/message/tool-result-message.js';
import { FinalResult } from '../components/message/final-result.js';
import {
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
} from '../types/messages.js';
import { deriveToolExecutionState } from '../utils/tool-states.js';
import { StatusLine } from '../components/ui/status-line.js';

interface StreamingRendererAppProps {
  messages: SDKMessage[];
  options: Required<RendererOptions>;
  currentStreamingIndex: number;
  onStreamComplete: () => void;
}

/**
 * 流式渲染器主应用组件
 */
const StreamingRendererApp: React.FC<StreamingRendererAppProps> = ({
  messages,
  options,
  currentStreamingIndex,
  onStreamComplete,
}) => {
  const toolStates = React.useMemo(() => deriveToolExecutionState(messages), [messages]);

  // 判断是否需要显示"等待中"状态和等待消息
  const waitingState = React.useMemo<{ show: boolean; message: string }>(() => {
    if (messages.length === 0) return { show: false, message: '' };
    
    const lastMessage = messages[messages.length - 1];
    
    // 如果最后一条消息是 result，不显示等待
    if (isResultMessage(lastMessage)) return { show: false, message: '' };
    
    // 如果最后一条消息是 user 消息（工具结果），显示"思考中"
    if (isUserMessage(lastMessage)) return { show: true, message: 'Thinking...' };
    
    // 如果最后一条消息是 assistant 消息，检查是否正在流式输出
    if (isAssistantMessage(lastMessage)) {
      const isStreaming = currentStreamingIndex === messages.length - 1;
      // 如果正在流式输出，显示"流式输出中"
      if (isStreaming && options.streaming && options.typingEffect) {
        return { show: true, message: 'Streaming...' };
      }
      // 否则不显示等待
      return { show: false, message: '' };
    }
    
    return { show: false, message: '' };
  }, [messages, currentStreamingIndex, options.streaming, options.typingEffect]);

  return (
    <ThemeProvider theme={options.theme}>
      <Box flexDirection="column">
        {messages.map((message, index) => {
          const isStreaming = index === currentStreamingIndex;

          // System 消息
          if (isSystemInitMessage(message)) {
            return <SystemMessage key={index} message={message} />;
          }

          // Assistant 消息
          if (isAssistantMessage(message)) {
            // 如果是当前正在流式的消息，使用流式组件
            if (isStreaming && options.streaming) {
              return (
                <StreamingAssistantMessage
                  key={index}
                  message={message}
                  showThinking={options.showThinking}
                  showToolDetails={options.showToolDetails}
                  typingSpeed={options.typingSpeed}
                  streamingEnabled={options.typingEffect}
                  onStreamComplete={onStreamComplete}
                  toolStates={toolStates}
                />
              );
            }

            // 否则使用普通组件（已完成的消息）
            return (
              <StreamingAssistantMessage
                key={index}
                message={message}
                showThinking={options.showThinking}
                showToolDetails={options.showToolDetails}
                streamingEnabled={false}
                toolStates={toolStates}
              />
            );
          }

          // Tool Result 消息
          if (isUserMessage(message)) {
            return (
              <ToolResultMessage
                key={index}
                message={message}
                maxOutputLines={options.maxOutputLines}
              />
            );
          }

          // 最终结果
          if (isResultMessage(message)) {
            return (
              <FinalResult
                key={index}
                message={message}
                showTokenUsage={options.showTokenUsage}
              />
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
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

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

  constructor(options: RendererOptions = {}) {
    this.options = this.normalizeOptions(options);
  }

  /**
   * 标准化配置选项
   */
  private normalizeOptions(options: RendererOptions): Required<RendererOptions> {
    return {
      theme: options.theme ?? 'dark',
      showTimestamps: options.showTimestamps ?? false,
      showSessionInfo: options.showSessionInfo ?? true,
      showFinalResult: options.showFinalResult ?? true,
      showExecutionStats: options.showExecutionStats ?? false,
      showTokenUsage: options.showTokenUsage ?? false,
      compact: options.compact ?? false,
      maxOutputLines: options.maxOutputLines ?? 100,
      codeHighlight: options.codeHighlight ?? true,
      streaming: options.streaming ?? true,
      typingEffect: options.typingEffect ?? true,
      typingSpeed: options.typingSpeed ?? 20,
      showThinking: options.showThinking ?? false,
      showToolDetails: options.showToolDetails ?? true,
      showToolContent: options.showToolContent ?? false,
      maxWidth: options.maxWidth ?? 120,
    };
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
    this.messages.push(message);

    // 创建新数组以触发 React 重新渲染
    const messagesCopy = [...this.messages];

    // 如果启用了流式渲染且是 Assistant 消息，设置为当前流式索引
    if (
      this.options.streaming &&
      isAssistantMessage(message) &&
      this.options.typingEffect
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
   * 清理资源
   */
  cleanup(): void {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }
    this.messages = [];
    this.currentStreamingIndex = -1;
    this.streamCompletePromise = null;
    this.streamCompleteResolve = null;
  }

  /**
   * 重置渲染器状态
   */
  reset(): void {
    this.cleanup();
  }
}

/**
 * 创建流式渲染器实例
 */
export function createStreamingRenderer(options?: RendererOptions): StreamingRenderer {
  return new StreamingRenderer(options);
}
