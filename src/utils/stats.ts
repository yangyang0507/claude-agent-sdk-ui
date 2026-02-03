/**
 * 统计与摘要工具
 */

import type { SDKMessage, SDKResultMessage } from '@anthropic-ai/claude-agent-sdk';
import {
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
  isToolResultContent,
  isToolUseContent,
} from '../types/messages.js';
import type { SessionStats, ToolCallInfo } from '../types/renderer.js';
import { sanitizeToolInput, summarizeToolInput } from './tools.js';
import { formatDuration } from './time.js';

export interface SessionAnalysis {
  stats: SessionStats;
  toolCalls: ToolCallInfo[];
}

export interface LogEntryLike {
  timestamp?: string;
  messageType?: string;
  message?: unknown;
}

const EMPTY_TOKENS = {
  input_tokens: 0,
  output_tokens: 0,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
};

export function analyzeLogEntries(entries: LogEntryLike[]): SessionAnalysis {
  const toolCalls = new Map<string, ToolCallInfo>();
  let lastResult: SDKResultMessage | null = null;
  let turns = 0;

  let startTime: number | null = null;
  let endTime: number | null = null;

  for (const entry of entries) {
    const timestamp = parseTimestamp(entry.timestamp);
    if (timestamp !== null) {
      if (startTime === null) startTime = timestamp;
      endTime = timestamp;
    }

    const message = entry.message;
    if (!isSdkMessage(message)) {
      continue;
    }

    if (isUserMessage(message)) {
      turns += 1;

      for (const item of message.message.content) {
        if (!isToolResultContent(item)) continue;

        const existing = toolCalls.get(item.tool_use_id);
        if (existing) {
          existing.endTime = timestamp ?? existing.endTime ?? Date.now();
          existing.output = item.content;
          existing.isError = Boolean(item.is_error);
          existing.success = !item.is_error;
          toolCalls.set(item.tool_use_id, existing);
        }
      }
    }

    if (isAssistantMessage(message)) {
      for (const item of message.message.content) {
        if (!isToolUseContent(item)) continue;

        if (!toolCalls.has(item.id)) {
          const sanitizedInput = sanitizeToolInput(item.input, { showContent: false });
          const summary = summarizeToolInput(item.name, sanitizedInput);

          toolCalls.set(item.id, {
            id: item.id,
            name: item.name,
            input: sanitizedInput,
            summary,
            startTime: timestamp ?? Date.now(),
          });
        }
      }
    }

    if (isResultMessage(message)) {
      lastResult = message;
    }
  }

  const duration = lastResult?.duration_ms ?? (startTime !== null && endTime !== null ? Math.max(0, endTime - startTime) : 0);
  const apiDuration = lastResult?.duration_api_ms;
  const turnsFinal = lastResult?.num_turns ?? turns;
  const success = lastResult ? lastResult.subtype === 'success' && !lastResult.is_error : false;
  const error = lastResult && lastResult.subtype !== 'success' ? lastResult.subtype : undefined;

  const tokens = lastResult
    ? {
        input_tokens: lastResult.usage.input_tokens ?? 0,
        output_tokens: lastResult.usage.output_tokens ?? 0,
        cache_creation_input_tokens: lastResult.usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: lastResult.usage.cache_read_input_tokens ?? 0,
      }
    : EMPTY_TOKENS;

  const stats: SessionStats = {
    duration,
    apiDuration,
    turns: turnsFinal,
    tokens,
    cost: lastResult?.total_cost_usd ?? 0,
    success,
    error,
  };

  return {
    stats,
    toolCalls: Array.from(toolCalls.values()),
  };
}

export function formatSessionSummary(analysis: SessionAnalysis): string {
  const { stats, toolCalls } = analysis;
  const toolErrorCount = toolCalls.filter((tool) => tool.isError).length;
  const toolDurations = toolCalls
    .filter((tool) => typeof tool.startTime === 'number' && typeof tool.endTime === 'number')
    .map((tool) => (tool.endTime ?? 0) - (tool.startTime ?? 0))
    .filter((value) => value >= 0);

  const avgToolDuration = toolDurations.length
    ? formatDuration(Math.round(toolDurations.reduce((a, b) => a + b, 0) / toolDurations.length))
    : null;

  const lines: string[] = [
    'Session summary:',
    `- Duration: ${formatDuration(stats.duration)}`,
    `- Turns: ${stats.turns}`,
    `- Tokens: input ${stats.tokens.input_tokens.toLocaleString()} / output ${stats.tokens.output_tokens.toLocaleString()}`,
  ];

  const cacheRead = stats.tokens.cache_read_input_tokens ?? 0;
  const cacheCreate = stats.tokens.cache_creation_input_tokens ?? 0;

  if (cacheRead || cacheCreate) {
    lines.push(
      `- Cache: read ${cacheRead.toLocaleString()} / create ${cacheCreate.toLocaleString()}`
    );
  }

  lines.push(`- Cost: $${stats.cost.toFixed(4)}`);
  lines.push(`- Tool calls: ${toolCalls.length} (${toolErrorCount} errors)`);

  if (avgToolDuration) {
    lines.push(`- Avg tool time: ${avgToolDuration}`);
  }

  return lines.join('\n');
}

function parseTimestamp(value?: string): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isSdkMessage(message: unknown): message is SDKMessage {
  return Boolean(
    message &&
    typeof message === 'object' &&
    'type' in message &&
    (message as { type: unknown }).type !== 'internal'
  );
}
