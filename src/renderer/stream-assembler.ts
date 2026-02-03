/**
 * StreamAssembler
 * 将 stream_event 组装成可渲染的 Assistant 消息
 */

import type { SDKAssistantMessage, SDKPartialAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import type { MessageContent } from '../types/messages.js';

interface StreamEventMessagePayload {
  role?: string;
  content?: unknown[];
}

type StreamEventMessage = SDKPartialAssistantMessage & {
  event?: {
    type?: string;
    index?: number;
    message?: StreamEventMessagePayload;
    content_block?: {
      type?: string;
      id?: string;
      name?: string;
    };
    delta?: {
      type?: string;
      text?: string;
      thinking?: string;
      partial_json?: string;
    };
  };
};

type PendingToolUse = {
  id: string;
  name: string;
  inputJson: string;
};

interface BaseMessage {
  role: string;
  content: MessageContent[];
}

export class StreamAssembler {
  private baseMessage: BaseMessage | null = null;
  private blocks = new Map<number, MessageContent>();
  private pendingToolUses = new Map<number, PendingToolUse>();
  private meta: { uuid?: string; session_id?: string; parent_tool_use_id?: string | null } = {};

  reset(): void {
    this.baseMessage = null;
    this.blocks.clear();
    this.pendingToolUses.clear();
    this.meta = {};
  }

  handleEvent(message: StreamEventMessage): SDKAssistantMessage | null {
    const event = message.event;
    if (!event || !event.type) {
      return this.buildMessage();
    }

    switch (event.type) {
      case 'message_start': {
        this.reset();
        this.meta = {
          uuid: message.uuid,
          session_id: message.session_id,
          parent_tool_use_id: message.parent_tool_use_id ?? null,
        };
        const rawMessage = event.message;
        this.baseMessage = rawMessage && typeof rawMessage === 'object'
          ? { role: rawMessage.role ?? 'assistant', content: [] }
          : { role: 'assistant', content: [] };
        return this.buildMessage();
      }
      case 'content_block_start': {
        const block = event.content_block;
        const index = typeof event.index === 'number' ? event.index : this.blocks.size;

        if (block?.type === 'text') {
          this.blocks.set(index, { type: 'text', text: '' });
        } else if (block?.type === 'thinking' || block?.type === 'redacted_thinking') {
          this.blocks.set(index, { type: 'thinking', thinking: '' });
        } else if (block?.type === 'tool_use') {
          this.pendingToolUses.set(index, {
            id: block.id ?? `tool-${index}`,
            name: block.name ?? 'tool',
            inputJson: '',
          });
        }
        return this.buildMessage();
      }
      case 'content_block_delta': {
        const index = typeof event.index === 'number' ? event.index : this.blocks.size - 1;
        const delta = event.delta;

        if (!delta) {
          return this.buildMessage();
        }

        if (delta.type === 'text_delta') {
          const existing = this.blocks.get(index);
          if (existing && existing.type === 'text') {
            existing.text += delta.text ?? '';
            this.blocks.set(index, existing);
          } else if (delta.text) {
            this.blocks.set(index, { type: 'text', text: delta.text });
          }
        }

        if (delta.type === 'thinking_delta') {
          const existing = this.blocks.get(index);
          if (existing && existing.type === 'thinking') {
            existing.thinking += delta.thinking ?? '';
            this.blocks.set(index, existing);
          } else if (delta.thinking) {
            this.blocks.set(index, { type: 'thinking', thinking: delta.thinking });
          }
        }

        if (delta.type === 'input_json_delta') {
          const pending = this.pendingToolUses.get(index);
          if (pending) {
            pending.inputJson += delta.partial_json ?? '';
            this.pendingToolUses.set(index, pending);
          }
        }

        return this.buildMessage();
      }
      case 'content_block_stop': {
        const index = typeof event.index === 'number' ? event.index : this.blocks.size;
        const pending = this.pendingToolUses.get(index);
        if (pending) {
          let input: Record<string, unknown> = {};
          if (pending.inputJson.trim().length > 0) {
            try {
              input = JSON.parse(pending.inputJson);
            } catch {
              input = { _raw: pending.inputJson };
            }
          }
          this.blocks.set(index, {
            type: 'tool_use',
            id: pending.id,
            name: pending.name,
            input,
          });
          this.pendingToolUses.delete(index);
        }
        return this.buildMessage();
      }
      case 'message_stop': {
        return this.buildMessage();
      }
      default:
        return this.buildMessage();
    }
  }

  private buildMessage(): SDKAssistantMessage | null {
    if (!this.baseMessage && this.blocks.size === 0) {
      return null;
    }

    const content = Array.from(this.blocks.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, value]) => value);

    const messagePayload = this.baseMessage
      ? { ...this.baseMessage, content }
      : { role: 'assistant', content };

    return {
      type: 'assistant',
      message: messagePayload,
      session_id: this.meta.session_id ?? '',
      uuid: this.meta.uuid,
      parent_tool_use_id: this.meta.parent_tool_use_id ?? null,
    } as SDKAssistantMessage;
  }
}
