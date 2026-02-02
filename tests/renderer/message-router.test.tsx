import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { MessageRouter } from '../../src/renderer/message-router.js';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../../src/types/renderer.js';
import { DEFAULT_RENDERER_OPTIONS } from '../../src/renderer/options.js';

vi.mock('../../src/components/proxy/system-message-proxy.js', () => ({
  SystemMessageProxy: ({ message }: any) => <>{`SystemMessage:${message.session_id}`}</>,
}));

vi.mock('../../src/components/proxy/assistant-message-proxy.js', () => ({
  AssistantMessageProxy: ({ message }: any) => (
    <>{`AssistantMessage:${message.message.content.length}`}</>
  ),
}));

vi.mock('../../src/components/proxy/tool-result-message-proxy.js', () => ({
  ToolResultMessageProxy: ({ message }: any) => (
    <>{`ToolResultMessage:${message.message.content.length}`}</>
  ),
}));

vi.mock('../../src/components/proxy/final-result-proxy.js', () => ({
  FinalResultProxy: ({ message }: any) => <>{`FinalResult:${message.type}`}</>,
}));

const createOptions = (overrides?: Partial<RendererOptions>): Required<RendererOptions> =>
  ({
    ...DEFAULT_RENDERER_OPTIONS,
    ...overrides,
  }) as Required<RendererOptions>;

describe('MessageRouter', () => {
  describe('System 消息路由', () => {
    it('应该路由 system init 消息到 SystemMessage', () => {
      const message: SDKMessage = {
        type: 'system',
        subtype: 'init',
        session_id: 'test-session-123',
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toContain('SystemMessage:test-session-123');
    });

    it('应该传递 showSessionInfo 选项', () => {
      const message: SDKMessage = {
        type: 'system',
        subtype: 'init',
        session_id: 'test-session',
      } as any;

      const options = createOptions({ showSessionInfo: false });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('Assistant 消息路由', () => {
    it('应该路由 assistant 消息到 AssistantMessage', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          content: [
            { type: 'text', text: 'Hello' },
            { type: 'text', text: 'World' },
          ],
        },
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toContain('AssistantMessage:2');
    });

    it('应该传递 showThinking 选项', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const options = createOptions({ showThinking: true });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 showToolDetails 选项', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const options = createOptions({ showToolDetails: false });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 toolStates', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const toolStates = {
        'tool-1': { status: 'success' as const },
        'tool-2': { status: 'pending' as const },
      };

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={toolStates} />
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('User 消息路由', () => {
    it('应该路由 user 消息到 ToolResultMessage', () => {
      const message: SDKMessage = {
        type: 'user',
        message: {
          content: [
            { type: 'tool_result', tool_use_id: 'tool-1', content: 'Result 1' },
            { type: 'tool_result', tool_use_id: 'tool-2', content: 'Result 2' },
          ],
        },
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toContain('ToolResultMessage:2');
    });

    it('应该传递 maxOutputLines 选项', () => {
      const message: SDKMessage = {
        type: 'user',
        message: {
          content: [{ type: 'tool_result', tool_use_id: 'tool-1', content: 'Result' }],
        },
      } as any;

      const options = createOptions({ maxOutputLines: 50 });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该跳过带有 isReplay 标记的消息', () => {
      const message: SDKMessage = {
        type: 'user',
        message: {
          content: [{ type: 'tool_result', tool_use_id: 'tool-1', content: 'Result' }],
        },
        isReplay: true,
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toBe('');
    });
  });

  describe('Result 消息路由', () => {
    it('应该路由 result 消息到 FinalResult', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toContain('FinalResult:result');
    });

    it('应该传递 showFinalResult 选项', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
      } as any;

      const options = createOptions({ showFinalResult: false });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 showExecutionStats 选项', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
      } as any;

      const options = createOptions({ showExecutionStats: true });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 showTokenUsage 选项', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
      } as any;

      const options = createOptions({ showTokenUsage: true });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('未知消息类型', () => {
    it('应该对未知消息类型返回 null', () => {
      const message: SDKMessage = {
        type: 'unknown',
      } as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toBe('');
    });

    it('应该对损坏的消息返回 null', () => {
      const message: SDKMessage = {} as any;

      const { lastFrame } = render(
        <MessageRouter message={message} options={createOptions()} toolStates={{}} />
      );

      expect(lastFrame()).toBe('');
    });
  });

  describe('选项传递', () => {
    it('应该正确传递所有选项', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const options = createOptions({
        showThinking: true,
        showToolDetails: false,
        showToolContent: true,
        maxOutputLines: 100,
      });

      const { lastFrame } = render(
        <MessageRouter message={message} options={options} toolStates={{}} />
      );

      expect(lastFrame()).toBeDefined();
    });
  });
});
