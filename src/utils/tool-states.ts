import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import {
  isAssistantMessage,
  isUserMessage,
  isToolResultContent,
  isToolUseContent,
} from '../types/messages.js';

export type ToolExecutionStatus = 'pending' | 'success' | 'error';

export interface ToolExecutionState {
  status: ToolExecutionStatus;
}

export type ToolExecutionStateMap = Record<string, ToolExecutionState>;

export function deriveToolExecutionState(messages: SDKMessage[]): ToolExecutionStateMap {
  const state: ToolExecutionStateMap = {};

  for (const message of messages) {
    if (isAssistantMessage(message)) {
      for (const item of message.message.content) {
        if (isToolUseContent(item)) {
          // 只在不存在时初始化为 pending
          if (!state[item.id]) {
            state[item.id] = { status: 'pending' };
          }
        }
      }
      continue;
    }

    if (isUserMessage(message)) {
      // 跳过 replay 消息
      if ('isReplay' in message && message.isReplay) {
        continue;
      }

      for (const item of message.message.content) {
        if (!isToolResultContent(item)) continue;

        const isError = Boolean(item.is_error);
        const nextStatus: ToolExecutionStatus = isError ? 'error' : 'success';

        // 直接设置状态，不管之前是什么
        state[item.tool_use_id] = {
          status: nextStatus,
        };
      }
    }
  }

  return state;
}
