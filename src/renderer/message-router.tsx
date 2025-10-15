/**
 * 消息路由器 - 根据消息类型分发到对应组件
 */

import React from 'react';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { SystemMessageProxy } from '../components/proxy/system-message-proxy.js';
import { AssistantMessageProxy } from '../components/proxy/assistant-message-proxy.js';
import { ToolResultMessageProxy } from '../components/proxy/tool-result-message-proxy.js';
import { FinalResultProxy } from '../components/proxy/final-result-proxy.js';
import type { RendererOptions } from '../types/renderer.js';
import type { ToolExecutionStateMap } from '../utils/tool-states.js';
import {
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
} from '../types/messages.js';

export interface MessageRouterProps {
  message: SDKMessage;
  options: Required<RendererOptions>;
  toolStates: ToolExecutionStateMap;
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
export const MessageRouter: React.FC<MessageRouterProps> = ({
  message,
  options,
  toolStates,
}) => {
  // System 初始化消息
  if (isSystemInitMessage(message)) {
    return <SystemMessageProxy message={message} />;
  }

  // Assistant 消息
  if (isAssistantMessage(message)) {
    return (
      <AssistantMessageProxy
        message={message}
        showThinking={options.showThinking}
        showToolDetails={options.showToolDetails}
        showToolContent={options.showToolContent}
        toolStates={toolStates}
      />
    );
  }

  // User 消息（工具结果）
  if (isUserMessage(message)) {
    return <ToolResultMessageProxy message={message} maxOutputLines={options.maxOutputLines} />;
  }

  // 最终结果消息
  if (isResultMessage(message)) {
    return (
      <FinalResultProxy
        message={message}
        showTokenUsage={options.showTokenUsage}
      />
    );
  }

  // 未知消息类型
  return null;
};
