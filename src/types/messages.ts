/**
 * Claude Agent SDK 消息类型
 *
 * 此文件只提供类型守卫和辅助函数,所有类型定义直接使用 SDK 官方类型
 */

import type {
  SDKMessage,
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
  SDKPartialAssistantMessage,
} from '@anthropic-ai/claude-agent-sdk';

// 重新导出 SDK 类型供外部使用
export type {
  SDKMessage,
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
  SDKPartialAssistantMessage,
};

/**
 * 消息内容类型 (from @anthropic-ai/sdk)
 * 这些类型由 SDK 定义,这里只是为了方便类型守卫
 */
export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'thinking'; thinking: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string; is_error?: boolean };

export type TextContent = Extract<MessageContent, { type: 'text' }>;
export type ThinkingContent = Extract<MessageContent, { type: 'thinking' }>;
export type ToolUseContent = Extract<MessageContent, { type: 'tool_use' }>;
export type ToolResultContent = Extract<MessageContent, { type: 'tool_result' }>;

/**
 * 类型守卫 - System 消息
 */
export function isSystemMessage(message: SDKMessage): message is SDKSystemMessage {
  return message.type === 'system';
}

/**
 * 类型守卫 - System Init 消息
 */
export function isSystemInitMessage(message: SDKMessage): message is SDKSystemMessage {
  return message.type === 'system' && 'subtype' in message && message.subtype === 'init';
}

/**
 * 类型守卫 - Assistant 消息
 */
export function isAssistantMessage(message: SDKMessage): message is SDKAssistantMessage {
  return message.type === 'assistant';
}

/**
 * 类型守卫 - User 消息
 */
export function isUserMessage(message: SDKMessage): message is SDKUserMessage {
  return message.type === 'user' && !('isReplay' in message);
}

/**
 * 类型守卫 - Result 消息
 */
export function isResultMessage(message: SDKMessage): message is SDKResultMessage {
  return message.type === 'result';
}

/**
 * 类型守卫 - Result Success 消息
 */
export function isResultSuccessMessage(message: SDKMessage): message is SDKResultMessage {
  return message.type === 'result' && 'subtype' in message && message.subtype === 'success';
}

/**
 * 类型守卫 - Text Content
 */
export function isTextContent(content: MessageContent): content is TextContent {
  return content.type === 'text';
}

/**
 * 类型守卫 - Thinking Content
 */
export function isThinkingContent(content: MessageContent): content is ThinkingContent {
  return content.type === 'thinking';
}

/**
 * 类型守卫 - Tool Use Content
 */
export function isToolUseContent(content: MessageContent): content is ToolUseContent {
  return content.type === 'tool_use';
}

/**
 * 类型守卫 - Tool Result Content
 */
export function isToolResultContent(content: MessageContent): content is ToolResultContent {
  return content.type === 'tool_result';
}

/**
 * 类型守卫 - Partial Assistant Message (Stream Event)
 */
export function isPartialAssistantMessage(
  message: SDKMessage
): message is SDKPartialAssistantMessage {
  return message.type === 'stream_event';
}
