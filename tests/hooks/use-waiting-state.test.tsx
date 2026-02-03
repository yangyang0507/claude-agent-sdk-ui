import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import {
  useWaitingState,
  type UseWaitingStateOptions,
} from '../../src/hooks/use-waiting-state.js';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

interface TestComponentProps {
  messages: SDKMessage[];
  options?: UseWaitingStateOptions;
}

const TestComponent: React.FC<TestComponentProps> = ({ messages, options }) => {
  const waitingState = useWaitingState(messages, options);
  return <Text>{`${waitingState.show}:${waitingState.message}`}</Text>;
};

describe('useWaitingState', () => {
  describe('空消息列表', () => {
    it('应该返回不显示等待状态', () => {
      const { lastFrame } = render(<TestComponent messages={[]} options={{}} />);

      expect(lastFrame()).toBe('false:');
    });

    it('空消息列表时 isStreaming 应显示', () => {
      const { lastFrame } = render(
        <TestComponent messages={[]} options={{ isStreaming: true }} />
      );

      expect(lastFrame()).toBe('true:Streaming...');
    });
  });

  describe('Result 消息', () => {
    it('当最后一条消息是 result 时不应该显示等待状态', () => {
      const messages: SDKMessage[] = [
        {
          type: 'result',
          subtype: 'success',
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('false:');
    });

    it('应该处理多条消息，最后一条是 result', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
        {
          type: 'result',
          subtype: 'success',
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('false:');
    });

    it('result 消息应优先于 isStreaming', () => {
      const messages: SDKMessage[] = [
        {
          type: 'result',
          subtype: 'success',
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent messages={messages} options={{ isStreaming: true }} />
      );

      expect(lastFrame()).toBe('false:');
    });
  });

  describe('流式传输模式（UIRenderer）', () => {
    it('当 isStreaming=true 时应该显示 "Streaming..."', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent messages={messages} options={{ isStreaming: true }} />
      );

      expect(lastFrame()).toBe('true:Streaming...');
    });

    it('isStreaming 应该优先于其他状态', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent messages={messages} options={{ isStreaming: true }} />
      );

      expect(lastFrame()).toBe('true:Streaming...');
    });
  });

  describe('User 消息（工具结果）', () => {
    it('当最后一条消息是 user 消息时应该显示 "Thinking..."', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: {
            content: [
              {
                type: 'tool_result',
                tool_use_id: 'tool-1',
                content: 'Result',
              },
            ],
          },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('true:Thinking...');
    });

    it('应该处理多条消息，最后一条是 user', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('true:Thinking...');
    });
  });

  describe('Assistant 消息', () => {
    it('默认情况下 assistant 消息不显示等待状态', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: {
            content: [{ type: 'text', text: 'Hello' }],
          },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('false:');
    });

    it('StreamingRenderer 模式：当正在流式输出时显示 "Streaming..."', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: {
            content: [{ type: 'text', text: 'Hello' }],
          },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: true,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('true:Streaming...');
    });

    it('StreamingRenderer 模式：当 currentStreamingIndex 不匹配时不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 1,
            streamingEnabled: true,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');
    });

    it('StreamingRenderer 模式：streamingEnabled=false 时不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: false,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');
    });

    it('StreamingRenderer 模式：typingEffect=false 时不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: true,
            typingEffect: false,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');
    });

    it('StreamingRenderer 模式：currentStreamingIndex 超出范围不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 5,
            streamingEnabled: true,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');
    });

    it('StreamingRenderer 模式：streamingEnabled=true 但 typingEffect=false 不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: true,
            typingEffect: false,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');
    });
  });

  describe('未知消息类型', () => {
    it('对于未知消息类型应该返回不显示', () => {
      const messages: SDKMessage[] = [
        {
          type: 'unknown',
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('false:');
    });
  });

  describe('复杂场景', () => {
    it('应该处理多条混合消息', () => {
      const messages: SDKMessage[] = [
        {
          type: 'system',
          subtype: 'init',
        } as any,
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('true:Thinking...');
    });

    it('应该正确响应消息列表的更新', () => {
      const messages1: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame, rerender } = render(<TestComponent messages={messages1} />);

      expect(lastFrame()).toBe('true:Thinking...');

      // 更新消息列表
      const messages2: SDKMessage[] = [
        ...messages1,
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      rerender(<TestComponent messages={messages2} />);

      expect(lastFrame()).toBe('false:');
    });

    it('应该正确响应选项的更新', () => {
      const messages: SDKMessage[] = [
        {
          type: 'assistant',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame, rerender } = render(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: false,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('false:');

      // 更新选项
      rerender(
        <TestComponent
          messages={messages}
          options={{
            currentStreamingIndex: 0,
            streamingEnabled: true,
            typingEffect: true,
          }}
        />
      );

      expect(lastFrame()).toBe('true:Streaming...');
    });
  });

  describe('边界情况', () => {
    it('应该处理空 options 对象', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} options={{}} />);

      expect(lastFrame()).toBe('true:Thinking...');
    });

    it('应该处理 undefined options', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('true:Thinking...');
    });

    it('应该处理只有一个消息的列表', () => {
      const messages: SDKMessage[] = [
        {
          type: 'result',
          subtype: 'success',
        } as any,
      ];

      const { lastFrame } = render(<TestComponent messages={messages} />);

      expect(lastFrame()).toBe('false:');
    });
  });
});
