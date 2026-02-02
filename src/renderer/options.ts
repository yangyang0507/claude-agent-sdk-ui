/**
 * 渲染器配置选项处理
 * 提供共享的配置规范化函数
 */

import type { RendererOptions } from '../types/renderer.js';

/**
 * 默认渲染器配置
 */
export const DEFAULT_RENDERER_OPTIONS: Required<RendererOptions> = {
  theme: 'claude-code',
  showTimestamps: false,
  showSessionInfo: true,
  showFinalResult: true,
  showExecutionStats: false,
  showTokenUsage: false,
  compact: false,
  maxOutputLines: 100,
  codeHighlight: true,
  streaming: false,
  typingEffect: false,
  typingSpeed: 20,
  showThinking: false,
  showToolDetails: true,
  showToolContent: false,
  maxWidth: 120,
  logging: { enabled: false },
};

/**
 * 流式渲染器的默认配置覆盖
 */
export const STREAMING_RENDERER_DEFAULTS: Partial<RendererOptions> = {
  streaming: true,
  typingEffect: true,
};

/**
 * 规范化渲染器配置选项
 * 将用户提供的部分配置合并为完整的配置对象
 *
 * @param options - 用户提供的配置选项
 * @param defaults - 额外的默认值覆盖（用于不同渲染器类型）
 * @returns 完整的配置对象
 */
export function normalizeOptions(
  options: RendererOptions = {},
  defaults: Partial<RendererOptions> = {}
): Required<RendererOptions> {
  return {
    theme: options.theme ?? defaults.theme ?? DEFAULT_RENDERER_OPTIONS.theme,
    showTimestamps: options.showTimestamps ?? defaults.showTimestamps ?? DEFAULT_RENDERER_OPTIONS.showTimestamps,
    showSessionInfo: options.showSessionInfo ?? defaults.showSessionInfo ?? DEFAULT_RENDERER_OPTIONS.showSessionInfo,
    showFinalResult: options.showFinalResult ?? defaults.showFinalResult ?? DEFAULT_RENDERER_OPTIONS.showFinalResult,
    showExecutionStats: options.showExecutionStats ?? defaults.showExecutionStats ?? DEFAULT_RENDERER_OPTIONS.showExecutionStats,
    showTokenUsage: options.showTokenUsage ?? defaults.showTokenUsage ?? DEFAULT_RENDERER_OPTIONS.showTokenUsage,
    compact: options.compact ?? defaults.compact ?? DEFAULT_RENDERER_OPTIONS.compact,
    maxOutputLines: options.maxOutputLines ?? defaults.maxOutputLines ?? DEFAULT_RENDERER_OPTIONS.maxOutputLines,
    codeHighlight: options.codeHighlight ?? defaults.codeHighlight ?? DEFAULT_RENDERER_OPTIONS.codeHighlight,
    streaming: options.streaming ?? defaults.streaming ?? DEFAULT_RENDERER_OPTIONS.streaming,
    typingEffect: options.typingEffect ?? defaults.typingEffect ?? DEFAULT_RENDERER_OPTIONS.typingEffect,
    typingSpeed: options.typingSpeed ?? defaults.typingSpeed ?? DEFAULT_RENDERER_OPTIONS.typingSpeed,
    showThinking: options.showThinking ?? defaults.showThinking ?? DEFAULT_RENDERER_OPTIONS.showThinking,
    showToolDetails: options.showToolDetails ?? defaults.showToolDetails ?? DEFAULT_RENDERER_OPTIONS.showToolDetails,
    showToolContent: options.showToolContent ?? defaults.showToolContent ?? DEFAULT_RENDERER_OPTIONS.showToolContent,
    maxWidth: options.maxWidth ?? defaults.maxWidth ?? DEFAULT_RENDERER_OPTIONS.maxWidth,
    logging: options.logging ?? defaults.logging ?? DEFAULT_RENDERER_OPTIONS.logging,
  };
}
