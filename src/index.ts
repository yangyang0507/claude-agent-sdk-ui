/**
 * Claude Agent SDK UI - 主入口
 * 基于 React + Ink 的声明式终端 UI 渲染
 */

import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from './types/renderer.js';
import type { ReplayOptions } from './utils/replay.js';
import { UIRenderer } from './renderer/renderer.js';
import { StreamingRenderer } from './renderer/streaming-renderer.js';

// ============================================
// 类型导出
// ============================================
export type { RendererOptions } from './types/renderer.js';
export type { Theme, ThemeColors, ThemeSymbols, BuiltInTheme } from './types/theme.js';
export type {
  SDKMessage,
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
} from './types/messages.js';
export type { LoggerOptions, LogEntry } from './utils/logger.js';
export type { ReplayOptions } from './utils/replay.js';

// ============================================
// 主题系统
// ============================================
export * from './themes/index.js';

// ============================================
// Ink UI 组件
// ============================================
export * from './components/ui/index.js';
export * from './hooks/use-theme.js';

// ============================================
// 消息组件
// ============================================
export { SystemMessage } from './components/message/system-message.js';
export { AssistantMessage } from './components/message/assistant-message.js';
export { StreamingAssistantMessage } from './components/message/streaming-assistant-message.js';
export { ToolResultMessage } from './components/message/tool-result-message.js';
export { FinalResult } from './components/message/final-result.js';

// ============================================
// 渲染器类
// ============================================
export { UIRenderer, UIRenderer as Renderer } from './renderer/renderer.js';
export { StreamingRenderer } from './renderer/streaming-renderer.js';
export { MessageRouter } from './renderer/message-router.js';

// ============================================
// 工具函数
// ============================================
export { truncateOutput, wrapText } from './utils/string.js';
export { formatDuration, formatTimestamp } from './utils/time.js';
export {
  sanitizeToolInput,
  formatToolLabel,
  summarizeToolInput,
  extractToolDetailLines,
} from './utils/tools.js';
export { SessionLogger, createLogger } from './utils/logger.js';
export { LogReplayer, createLogReplayer, replayLog } from './utils/replay.js';

// ============================================
// API Functions
// ============================================

// 默认渲染器实例
let defaultRenderer: UIRenderer | null = null;

/**
 * 渲染单条消息
 *
 * @example
 * ```typescript
 * import { render } from 'claude-agent-sdk-ui';
 * import { query } from '@anthropic-ai/claude-agent-sdk';
 *
 * for await (const message of query({ prompt: '...' })) {
 *   await render(message);
 * }
 * ```
 */
export async function render(
  message: SDKMessage,
  options?: RendererOptions
): Promise<void> {
  // 如果提供了选项或没有默认渲染器，创建新的渲染器
  if (options || !defaultRenderer) {
    const renderer = new UIRenderer(options);
    await renderer.render(message);

    // 如果没有选项，保存为默认渲染器以复用
    if (!options && !defaultRenderer) {
      defaultRenderer = renderer;
    }
    return;
  }

  // 使用默认渲染器
  await defaultRenderer.render(message);
}

/**
 * 渲染整个 query 会话
 *
 * @example
 * ```typescript
 * import { renderQuery } from 'claude-agent-sdk-ui';
 * import { query } from '@anthropic-ai/claude-agent-sdk';
 *
 * // 一行代码搞定！
 * await renderQuery(query({ prompt: '你好,Claude!' }));
 * ```
 */
export async function renderQuery(
  queryGenerator: AsyncGenerator<SDKMessage, any, any>,
  options?: RendererOptions
): Promise<void> {
  const renderer = new UIRenderer(options);

  try {
    for await (const message of queryGenerator) {
      await renderer.render(message);
    }
  } finally {
    // 清理资源
    await renderer.cleanup();
  }
}

/**
 * 创建渲染器实例
 *
 * @example
 * ```typescript
 * import { createRenderer } from 'claude-agent-sdk-ui';
 *
 * const renderer = createRenderer({
 *   theme: 'dark',
 *   showTokenUsage: true,
 * });
 *
 * for await (const message of query({ prompt: '...' })) {
 *   await renderer.render(message);
 * }
 *
 * renderer.cleanup();
 * ```
 */
export function createRenderer(options?: RendererOptions): UIRenderer {
  return new UIRenderer(options);
}

/**
 * 创建流式渲染器实例（带打字机效果）
 *
 * @example
 * ```typescript
 * import { createStreamingRenderer } from 'claude-agent-sdk-ui';
 *
 * const renderer = createStreamingRenderer({
 *   theme: 'dark',
 *   streaming: true,
 *   typingEffect: true,
 *   typingSpeed: 20,
 * });
 *
 * for await (const message of query({ prompt: '...' })) {
 *   await renderer.render(message);
 * }
 * ```
 */
export function createStreamingRenderer(options?: RendererOptions): StreamingRenderer {
  return new StreamingRenderer(options);
}

/**
 * 渲染整个 query 会话（流式版本 - 带打字机效果）
 *
 * @example
 * ```typescript
 * import { renderQueryStreaming } from 'claude-agent-sdk-ui';
 * import { query } from '@anthropic-ai/claude-agent-sdk';
 *
 * // 带打字机效果的流式渲染
 * await renderQueryStreaming(query({ prompt: '你好,Claude!' }), {
 *   typingEffect: true,
 *   typingSpeed: 20,
 * });
 * ```
 */
export async function renderQueryStreaming(
  queryGenerator: AsyncGenerator<SDKMessage, any, any>,
  options?: RendererOptions
): Promise<void> {
  const renderer = new StreamingRenderer(options);

  try {
    for await (const message of queryGenerator) {
      await renderer.render(message);
    }
  } finally {
    // 清理资源
    await renderer.cleanup();
  }
}

/**
 * 重置默认渲染器
 */
export async function resetDefaultRenderer(): Promise<void> {
  if (defaultRenderer) {
    await defaultRenderer.cleanup();
    defaultRenderer = null;
  }
}

// ============================================
// 默认导出
// ============================================
export default {
  // Core API
  render,
  renderQuery,
  renderQueryStreaming,
  createRenderer,
  createStreamingRenderer,
  resetDefaultRenderer,

  // Classes
  Renderer: UIRenderer,
  StreamingRenderer,

  // Utilities
  replayLog: async (logFilePath: string, options?: ReplayOptions) => {
    const { replayLog } = await import('./utils/replay.js');
    return replayLog(logFilePath, options);
  },
};
