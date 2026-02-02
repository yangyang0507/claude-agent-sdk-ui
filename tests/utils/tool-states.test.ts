import { describe, it, expect } from 'vitest';
import { deriveToolExecutionState } from '../../src/utils/tool-states.js';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

describe('deriveToolExecutionState', () => {
  it('应该将工具调用初始化为 pending 状态', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'pending' });
  });

  it('应该将工具结果标记为 success', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'file content',
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'success' });
  });

  it('应该将错误的工具结果标记为 error', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'error message',
              is_error: true,
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'error' });
  });

  it('应该处理多个工具调用', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test1.ts' },
            },
            {
              type: 'tool_use',
              id: 'tool_2',
              name: 'Read',
              input: { file_path: '/test2.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'content 1',
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'success' });
    expect(state['tool_2']).toEqual({ status: 'pending' });
  });

  it('应该跳过 replay 消息', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'old result',
            },
          ],
        },
        isReplay: true,
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'pending' });
  });

  it('应该处理工具状态更新', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'first result',
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'error',
              is_error: true,
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'error' });
  });

  it('应该处理空消息列表', () => {
    const state = deriveToolExecutionState([]);
    expect(state).toEqual({});
  });

  it('应该忽略非工具相关的消息', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'text',
              text: 'Hello',
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'text',
              text: 'Hi',
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state).toEqual({});
  });

  it('应该处理混合内容的消息', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'text',
              text: 'Let me read the file',
            },
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'file content',
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'success' });
  });

  it('应该只在工具不存在时初始化为 pending', () => {
    const messages: SDKMessage[] = [
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool_1',
              content: 'success',
            },
          ],
        },
      } as any,
      {
        type: 'assistant',
        message: {
          content: [
            {
              type: 'tool_use',
              id: 'tool_1',
              name: 'Read',
              input: { file_path: '/test.ts' },
            },
          ],
        },
      } as any,
    ];

    const state = deriveToolExecutionState(messages);
    expect(state['tool_1']).toEqual({ status: 'success' });
  });
});
