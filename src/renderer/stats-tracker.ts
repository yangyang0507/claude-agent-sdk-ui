/**
 * StatsTracker
 * 用于跟踪渲染过程中的会话统计与工具调用信息
 */

import type { SDKMessage, SDKResultMessage } from '@anthropic-ai/claude-agent-sdk';
import {
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
  isToolResultContent,
  isToolUseContent,
} from '../types/messages.js';
import type { RendererState, SessionStats, ToolCallInfo } from '../types/renderer.js';
import { sanitizeToolInput, summarizeToolInput } from '../utils/tools.js';

export class StatsTracker {
  private state: RendererState;
  private lastResult: SDKResultMessage | null = null;
  private history: SDKMessage[] = [];

  constructor() {
    this.state = this.createEmptyState();
  }

  reset(): void {
    this.state = this.createEmptyState();
    this.lastResult = null;
    this.history = [];
  }

  update(message: SDKMessage, timestamp: number = Date.now(), recordHistory: boolean = true): void {
    if (!this.state.startTime) {
      this.state.startTime = timestamp;
    }
    this.state.endTime = timestamp;
    this.state.processedMessages += 1;

    if ('session_id' in message && message.session_id) {
      this.state.sessionId = message.session_id;
    }

    if (isUserMessage(message)) {
      this.state.currentTurn += 1;

      for (const item of message.message.content) {
        if (!isToolResultContent(item)) continue;

        const existing = this.state.activeToolCalls.get(item.tool_use_id);
        if (existing) {
          existing.endTime = timestamp;
          existing.output = item.content;
          existing.isError = Boolean(item.is_error);
          existing.success = !item.is_error;
          this.state.activeToolCalls.set(item.tool_use_id, existing);
        }
      }
    }

    if (isAssistantMessage(message)) {
      for (const item of message.message.content) {
        if (!isToolUseContent(item)) continue;

        if (!this.state.activeToolCalls.has(item.id)) {
          const sanitizedInput = sanitizeToolInput(item.input, {
            showContent: false,
          });
          const summary = summarizeToolInput(item.name, sanitizedInput);

          this.state.activeToolCalls.set(item.id, {
            id: item.id,
            name: item.name,
            input: sanitizedInput,
            summary,
            startTime: timestamp,
          });
        }
      }
    }

    if (isResultMessage(message)) {
      this.lastResult = message;
      this.state.totalTokens = {
        input: message.usage.input_tokens ?? 0,
        output: message.usage.output_tokens ?? 0,
        cacheRead: message.usage.cache_read_input_tokens ?? 0,
        cacheCreation: message.usage.cache_creation_input_tokens ?? 0,
      };
      this.state.totalCost = message.total_cost_usd ?? 0;
      this.state.endTime = timestamp;
    }

    if (recordHistory) {
      this.history.push(message);
    }
  }

  trimHistory(messages: SDKMessage[]): void {
    if (messages.length === this.history.length && messages.every((item, index) => item === this.history[index])) {
      return;
    }
    this.history = [...messages];
    this.rebuild();
  }

  getState(): RendererState {
    return {
      ...this.state,
      activeToolCalls: new Map(this.state.activeToolCalls),
    };
  }

  getToolCalls(): ToolCallInfo[] {
    return Array.from(this.state.activeToolCalls.values());
  }

  getStats(): SessionStats | null {
    if (!this.state.startTime) {
      return null;
    }

    const endTime = this.state.endTime ?? Date.now();
    const duration = this.lastResult?.duration_ms ?? Math.max(0, endTime - this.state.startTime);
    const apiDuration = this.lastResult?.duration_api_ms;
    const turns = this.lastResult?.num_turns ?? this.state.currentTurn;
    const success = this.lastResult ? this.lastResult.subtype === 'success' && !this.lastResult.is_error : false;
    const error = this.lastResult && this.lastResult.subtype !== 'success' ? this.lastResult.subtype : undefined;

    return {
      duration,
      apiDuration,
      turns,
      tokens: {
        input_tokens: this.state.totalTokens.input,
        output_tokens: this.state.totalTokens.output,
        cache_creation_input_tokens: this.state.totalTokens.cacheCreation,
        cache_read_input_tokens: this.state.totalTokens.cacheRead,
      },
      cost: this.state.totalCost,
      success,
      error,
    };
  }

  private createEmptyState(): RendererState {
    return {
      sessionId: null,
      currentTurn: 0,
      activeToolCalls: new Map(),
      totalTokens: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheCreation: 0,
      },
      totalCost: 0,
      startTime: null,
      endTime: null,
      processedMessages: 0,
    };
  }

  private rebuild(): void {
    this.state = this.createEmptyState();
    this.lastResult = null;

    let now = Date.now();
    for (const message of this.history) {
      this.update(message, now, false);
    }
  }
}
