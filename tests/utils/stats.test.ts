import { describe, it, expect } from 'vitest';
import { analyzeLogEntries, formatSessionSummary } from '../../src/utils/stats.js';

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
