import { describe, it, expect } from 'vitest';
import { analyzeLogEntries, formatSessionSummary } from '../../src/utils/stats.js';
import { StatsTracker } from '../../src/renderer/stats-tracker.js';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

describe('stats utils', () => {
  it('summarizes log entries with tool calls and result stats', () => {
    const entries = [
      {
        timestamp: '2024-01-01T00:00:00.000Z',
        message: {
          type: 'assistant',
          session_id: 'session-1',
          message: {
            role: 'assistant',
            content: [
              { type: 'tool_use', id: 'tool-1', name: 'Read', input: { file_path: 'src/index.ts' } },
            ],
          },
        },
      },
      {
        timestamp: '2024-01-01T00:00:01.000Z',
        message: {
          type: 'user',
          session_id: 'session-1',
          message: {
            role: 'user',
            content: [
              { type: 'tool_result', tool_use_id: 'tool-1', content: 'ok', is_error: false },
            ],
          },
        },
      },
      {
        timestamp: '2024-01-01T00:00:02.000Z',
        message: {
          type: 'result',
          subtype: 'success',
          session_id: 'session-1',
          duration_ms: 2000,
          duration_api_ms: 1500,
          is_error: false,
          num_turns: 1,
          total_cost_usd: 0.01,
          usage: {
            input_tokens: 10,
            output_tokens: 5,
            cache_read_input_tokens: 0,
            cache_creation_input_tokens: 0,
          },
          modelUsage: {},
          permission_denials: [],
        },
      },
    ];

    const analysis = analyzeLogEntries(entries);

    expect(analysis.stats.duration).toBe(2000);
    expect(analysis.stats.turns).toBe(1);
    expect(analysis.toolCalls.length).toBe(1);
    expect(analysis.toolCalls[0].id).toBe('tool-1');

    const summary = formatSessionSummary(analysis);
    expect(summary).toContain('Tool calls: 1');
  });
});

describe('StatsTracker', () => {
  it('trimHistory 应保持统计可用', () => {
    const tracker = new StatsTracker();

    const system = {
      type: 'system',
      subtype: 'init',
      session_id: 'session-1',
    } as SDKMessage;

    const assistant = {
      type: 'assistant',
      message: { content: [] },
    } as SDKMessage;

    const result = {
      type: 'result',
      subtype: 'success',
      usage: {
        input_tokens: 10,
        output_tokens: 5,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
      },
      total_cost_usd: 0.01,
    } as SDKMessage;

    tracker.update(system, 1000);
    tracker.update(assistant, 2000);
    tracker.update(result, 3000);

    tracker.trimHistory([system, result]);

    const stats = tracker.getStats();
    expect(stats?.tokens.input_tokens).toBe(10);
    expect(stats?.tokens.output_tokens).toBe(5);
    expect(stats?.cost).toBe(0.01);
  });
});
