/**
 * useWaitingState Hook
 * 计算渲染器的等待状态
 */

import React from 'react';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { isResultMessage, isUserMessage, isAssistantMessage } from '../types/messages.js';

export interface WaitingState {
  /** 是否显示等待状态 */
  show: boolean;
  /** 等待消息文本 */
  message: string;
}

export interface UseWaitingStateOptions {
  /** 是否正在流式传输 */
  isStreaming?: boolean;
  /** 当前流式消息索引（用于 StreamingRenderer） */
  currentStreamingIndex?: number;
  /** 是否启用流式渲染 */
  streamingEnabled?: boolean;
  /** 是否启用打字效果 */
  typingEffect?: boolean;
}

/**
 * 计算渲染器的等待状态
 *
 * @param messages - 当前消息列表
 * @param options - 配置选项
 * @returns 等待状态
 *
 * @example
 * ```tsx
 * const waitingState = useWaitingState(messages, { isStreaming: true });
 * if (waitingState.show) {
 *   return <StatusLine label={waitingState.message} />;
 * }
 * ```
 */
export function useWaitingState(
  messages: SDKMessage[],
  options: UseWaitingStateOptions = {}
): WaitingState {
  const {
    isStreaming = false,
    currentStreamingIndex = -1,
    streamingEnabled = false,
    typingEffect = false,
  } = options;

  return React.useMemo<WaitingState>(() => {
    if (messages.length === 0) {
      return { show: false, message: '' };
    }

    const lastMessage = messages[messages.length - 1];
    const lastIndex = messages.length - 1;

    // 如果最后一条消息是 result，不显示等待
    if (isResultMessage(lastMessage)) {
      return { show: false, message: '' };
    }

    // 如果正在流式传输（UIRenderer 模式）
    if (isStreaming) {
      return { show: true, message: 'Streaming...' };
    }

    // 如果最后一条消息是 user 消息（工具结果），显示"思考中"
    if (isUserMessage(lastMessage)) {
      return { show: true, message: 'Thinking...' };
    }

    // 如果最后一条消息是 assistant 消息
    if (isAssistantMessage(lastMessage)) {
      // StreamingRenderer 模式：检查是否正在流式输出
      if (currentStreamingIndex === lastIndex && streamingEnabled && typingEffect) {
        return { show: true, message: 'Streaming...' };
      }
      // 否则不显示等待
      return { show: false, message: '' };
    }

    return { show: false, message: '' };
  }, [messages, isStreaming, currentStreamingIndex, streamingEnabled, typingEffect]);
}
