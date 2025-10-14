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
          if (!state[item.id]) {
            state[item.id] = { status: 'pending' };
          }
        }
      }
      continue;
    }

    if (isUserMessage(message)) {
      for (const item of message.message.content) {
        if (!isToolResultContent(item)) continue;

        const current = state[item.tool_use_id] ?? { status: 'pending' };
        const isError = Boolean(item.is_error);
        const nextStatus: ToolExecutionStatus = isError
          ? 'error'
          : current.status === 'error'
            ? 'error'
            : 'success';

        state[item.tool_use_id] = {
          status: nextStatus,
        };
      }
    }
  }

  return state;
}
