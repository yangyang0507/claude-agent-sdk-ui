/**
 * 消息路由器 - 根据消息类型分发到对应组件
 */

import React from 'react';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { SystemMessage } from '../components/message/system-message.js';
import { AssistantMessage } from '../components/message/assistant-message.js';
import { ToolResultMessage } from '../components/message/tool-result-message.js';
import { FinalResult } from '../components/message/final-result.js';
import type { RendererOptions } from '../types/renderer.js';
import {
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
} from '../types/messages.js';

export interface MessageRouterProps {
  message: SDKMessage;
  options: Required<RendererOptions>;
}

/**
 * 消息路由器组件
 *
 * 根据消息类型将消息分发到对应的渲染组件
 *
 * @example
 * ```tsx
 * <MessageRouter message={message} options={options} />
 * ```
 */
export const MessageRouter: React.FC<MessageRouterProps> = ({ message, options }) => {
  // System 初始化消息
  if (isSystemInitMessage(message)) {
    return <SystemMessage message={message} />;
  }

  // Assistant 消息
  if (isAssistantMessage(message)) {
    return (
      <AssistantMessage
        message={message}
        showThinking={options.showThinking}
        showToolDetails={options.showToolDetails}
        showToolContent={options.showToolContent}
      />
    );
  }

  // User 消息（工具结果）
  if (isUserMessage(message)) {
    return <ToolResultMessage message={message} maxOutputLines={options.maxOutputLines} />;
  }

  // 最终结果消息
  if (isResultMessage(message)) {
    return <FinalResult message={message} showTokenUsage={options.showTokenUsage} />;
  }

  // 未知消息类型
  return null;
};
