/**
 * 类型定义导出
 */

// 消息类型 - 直接从 SDK 导出
export type {
  SDKMessage,
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
  MessageContent,
  TextContent,
  ThinkingContent,
  ToolUseContent,
  ToolResultContent,
} from './messages.js';

export {
  isSystemMessage,
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
  isResultSuccessMessage,
  isTextContent,
  isThinkingContent,
  isToolUseContent,
  isToolResultContent,
} from './messages.js';

// 主题类型
export type {
  ThemeColors,
  ThemeSymbols,
  BorderStyle,
  ThemeBorders,
  ThemeLayout,
  Theme,
  ThemeOptions,
  BuiltInTheme,
  ThemeInput,
} from './theme.js';

// 渲染器类型
export type {
  DividerStyle,
  RendererOptions,
  SessionStats,
  ToolCallInfo,
  RendererState,
  BoxOptions,
  CodeHighlightOptions,
} from './renderer.js';
