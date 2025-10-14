/**
 * UIRenderer - 主渲染器
 */

import React from 'react';
import { render, Box } from 'ink';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../types/renderer.js';
import { ThemeProvider } from '../hooks/use-theme.js';
import { MessageRouter } from './message-router.js';
import { deriveToolExecutionState } from '../utils/tool-states.js';
import { StatusLine } from '../components/ui/status-line.js';
import { isAssistantMessage, isUserMessage, isResultMessage } from '../types/messages.js';

interface UIRendererAppProps {
  messages: SDKMessage[];
  options: Required<RendererOptions>;
}

/**
 * 渲染器主应用组件
 */
const UIRendererApp: React.FC<UIRendererAppProps> = ({ messages, options }) => {
  const toolStates = React.useMemo(() => deriveToolExecutionState(messages), [messages]);

  // 判断是否需要显示"等待中"状态和等待消息
  const waitingState = React.useMemo<{ show: boolean; message: string }>(() => {
    if (messages.length === 0) return { show: false, message: '' };
    
    const lastMessage = messages[messages.length - 1];
    
    // 如果最后一条消息是 result，不显示等待
    if (isResultMessage(lastMessage)) return { show: false, message: '' };
    
    // 如果最后一条消息是 user 消息（工具结果），显示"思考中"
    if (isUserMessage(lastMessage)) return { show: true, message: 'Thinking...' };
    
    // 如果最后一条消息是 assistant 消息，不显示等待
    // （要么有工具调用正在执行，要么是纯文本回复已完成）
    if (isAssistantMessage(lastMessage)) {
      return { show: false, message: '' };
    }
    
    return { show: false, message: '' };
  }, [messages]);

  return (
    <ThemeProvider theme={options.theme}>
      <Box flexDirection="column">
        {messages.map((message, index) => (
          <MessageRouter
            key={index}
            message={message}
            options={options}
            toolStates={toolStates}
          />
        ))}
        
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
      streaming: options.streaming ?? false,
      typingEffect: options.typingEffect ?? false,
      typingSpeed: options.typingSpeed ?? 20,
      showThinking: options.showThinking ?? false,
      showToolDetails: options.showToolDetails ?? true,
      showToolContent: options.showToolContent ?? false,
      maxWidth: options.maxWidth ?? 120,
    };
  }

  /**
   * 渲染单条消息
   */
  async render(message: SDKMessage): Promise<void> {
    this.messages.push(message);

    // 创建新数组以触发 React 重新渲染
    const messagesCopy = [...this.messages];

    // 如果还没有创建 app，创建一个
    if (!this.app) {
      this.app = render(
        <UIRendererApp messages={messagesCopy} options={this.options} />
      );
    } else {
      // 重新渲染（Ink 会自动处理增量更新）
      this.app.rerender(
        <UIRendererApp messages={messagesCopy} options={this.options} />
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
  cleanup(): void {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }
    this.messages = [];
  }

  /**
   * 重置渲染器状态
   */
  reset(): void {
    this.cleanup();
  }
}

/**
 * 创建 UI 渲染器实例
 */
export function createRenderer(options?: RendererOptions): UIRenderer {
  return new UIRenderer(options);
}
