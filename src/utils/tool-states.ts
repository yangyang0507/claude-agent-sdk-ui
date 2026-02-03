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

export function updateToolExecutionState(
  state: ToolExecutionStateMap,
  message: SDKMessage
): void {
  if (isAssistantMessage(message)) {
    for (const item of message.message.content) {
      if (isToolUseContent(item)) {
        if (!state[item.id]) {
          state[item.id] = { status: 'pending' };
        }
      }
    }
    return;
  }

  if (isUserMessage(message)) {
    if ('isReplay' in message && message.isReplay) {
      return;
    }

    for (const item of message.message.content) {
      if (!isToolResultContent(item)) continue;

      const isError = Boolean(item.is_error);
      const nextStatus: ToolExecutionStatus = isError ? 'error' : 'success';

      state[item.tool_use_id] = {
        status: nextStatus,
      };
    }
  }
}

export function deriveToolExecutionState(messages: SDKMessage[]): ToolExecutionStateMap {
  const state: ToolExecutionStateMap = {};

  for (const message of messages) {
    updateToolExecutionState(state, message);
  }

  return state;
}
