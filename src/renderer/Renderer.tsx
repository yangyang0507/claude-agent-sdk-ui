/**
 * UIRenderer - 主渲染器
 */

import React from 'react';
import { render, Box } from 'ink';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../types/renderer.js';
import { ThemeProvider } from '../hooks/use-theme.js';
import { MessageRouter } from './message-router.js';

interface UIRendererAppProps {
  messages: SDKMessage[];
  options: Required<RendererOptions>;
}

/**
 * 渲染器主应用组件
 */
const UIRendererApp: React.FC<UIRendererAppProps> = ({ messages, options }) => {
  return (
    <ThemeProvider theme={options.theme}>
      <Box flexDirection="column">
        {messages.map((message, index) => (
          <MessageRouter key={index} message={message} options={options} />
        ))}
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

    // 如果还没有创建 app，创建一个
    if (!this.app) {
      this.app = render(
        <UIRendererApp messages={this.messages} options={this.options} />
      );
    } else {
      // 重新渲染（Ink 会自动处理增量更新）
      this.app.rerender(
        <UIRendererApp messages={this.messages} options={this.options} />
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
