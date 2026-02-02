import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { SystemMessageProxy } from '../../src/components/proxy/system-message-proxy.js';
import { AssistantMessageProxy } from '../../src/components/proxy/assistant-message-proxy.js';
import { StreamingAssistantMessageProxy } from '../../src/components/proxy/streaming-assistant-message-proxy.js';
import { ToolResultMessageProxy } from '../../src/components/proxy/tool-result-message-proxy.js';
import { FinalResultProxy } from '../../src/components/proxy/final-result-proxy.js';
import { AppLayoutProxy } from '../../src/components/proxy/app-layout-proxy.js';
import { ThemeProvider } from '../../src/hooks/use-theme.js';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

describe('Proxy Components', () => {
  describe('SystemMessageProxy', () => {
    it('应该在 ThemeProvider 中正常渲染', () => {
      const message: SDKMessage = {
        type: 'system',
        subtype: 'init',
        session_id: 'test-session-123',
        timestamp: Date.now(),
      } as any;

      const { lastFrame } = render(
        <ThemeProvider theme="claude-code">
          <SystemMessageProxy message={message} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该在没有 ThemeProvider 时使用默认主题渲染', () => {
      const message: SDKMessage = {
        type: 'system',
        subtype: 'init',
        session_id: 'test-456',
        timestamp: Date.now(),
      } as any;

      const { lastFrame } = render(<SystemMessageProxy message={message} />);

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('AssistantMessageProxy', () => {
    it('应该在 ThemeProvider 中正常渲染', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Hello World' }],
        },
        timestamp: Date.now(),
      } as any;

      const { lastFrame } = render(
        <ThemeProvider theme="claude-code">
          <AssistantMessageProxy
            message={message}
            showThinking={false}
            showToolDetails={true}
            toolStates={{}}
          />
        </ThemeProvider>
      );

      const frame = lastFrame();
      expect(frame).toBeDefined();
      expect(frame.length).toBeGreaterThan(0);
    });

    it('应该传递所有 props 到主题组件', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const toolStates = {
        'tool-1': { status: 'success' as const },
      };

      const { lastFrame } = render(
        <ThemeProvider>
          <AssistantMessageProxy
            message={message}
            showThinking={true}
            showToolDetails={false}
            showToolContent={true}
            toolStates={toolStates}
          />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('StreamingAssistantMessageProxy', () => {
    it('应该在 ThemeProvider 中正常渲染', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Streaming...' }],
        },
      } as any;

      const { lastFrame } = render(
        <ThemeProvider theme="droid">
          <StreamingAssistantMessageProxy
            message={message}
            showThinking={false}
            showToolDetails={true}
            streamingEnabled={true}
            toolStates={{}}
          />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
      expect(lastFrame().length).toBeGreaterThan(0);
    });
  });

  describe('ToolResultMessageProxy', () => {
    it('应该在 ThemeProvider 中正常渲染', () => {
      const message: SDKMessage = {
        type: 'user',
        message: {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool-1',
              content: 'Result content',
            },
          ],
        },
      } as any;

      const { lastFrame } = render(
        <ThemeProvider>
          <ToolResultMessageProxy message={message} maxOutputLines={100} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 maxOutputLines prop', () => {
      const message: SDKMessage = {
        type: 'user',
        message: {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: 'tool-1',
              content: 'Test',
            },
          ],
        },
      } as any;

      const { lastFrame } = render(
        <ThemeProvider>
          <ToolResultMessageProxy message={message} maxOutputLines={50} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('FinalResultProxy', () => {
    it('应该在 ThemeProvider 中正常渲染', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
        permission_denials: [],
        errors: [],
      } as any;

      const { lastFrame } = render(
        <ThemeProvider>
          <FinalResultProxy message={message} showTokenUsage={false} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该传递 showTokenUsage prop', () => {
      const message: SDKMessage = {
        type: 'result',
        subtype: 'success',
        permission_denials: [],
        errors: [],
      } as any;

      const { lastFrame } = render(
        <ThemeProvider>
          <FinalResultProxy message={message} showTokenUsage={true} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });
  });

  describe('AppLayoutProxy', () => {
    it('应该渲染子元素', () => {
      const messages: SDKMessage[] = [];

      const { lastFrame } = render(
        <ThemeProvider>
          <AppLayoutProxy messages={messages}>
            <Text>Test Content</Text>
          </AppLayoutProxy>
        </ThemeProvider>
      );

      const frame = lastFrame();
      expect(frame).toContain('Test Content');
    });

    it('应该传递 isStreaming prop', () => {
      const messages: SDKMessage[] = [
        {
          type: 'user',
          message: { content: [] },
        } as any,
      ];

      const { lastFrame } = render(
        <ThemeProvider>
          <AppLayoutProxy messages={messages} isStreaming={true}>
            <Text>Children</Text>
          </AppLayoutProxy>
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });

    it('应该渲染多个子元素', () => {
      const messages: SDKMessage[] = [];

      const { lastFrame } = render(
        <ThemeProvider>
          <AppLayoutProxy messages={messages}>
            <Text>Child 1</Text>
            <Text>Child 2</Text>
          </AppLayoutProxy>
        </ThemeProvider>
      );

      const frame = lastFrame();
      expect(frame).toContain('Child 1');
      expect(frame).toContain('Child 2');
    });
  });

  describe('不同主题', () => {
    it('SystemMessageProxy 应该在 droid 主题下正常渲染', () => {
      const message: SDKMessage = {
        type: 'system',
        subtype: 'init',
        session_id: 'test',
        timestamp: Date.now(),
      } as any;

      const { lastFrame } = render(
        <ThemeProvider theme="droid">
          <SystemMessageProxy message={message} />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });

    it('AssistantMessageProxy 应该在 droid 主题下正常渲染', () => {
      const message: SDKMessage = {
        type: 'assistant',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Test' }],
        },
      } as any;

      const { lastFrame } = render(
        <ThemeProvider theme="droid">
          <AssistantMessageProxy
            message={message}
            showThinking={false}
            showToolDetails={true}
            toolStates={{}}
          />
        </ThemeProvider>
      );

      expect(lastFrame()).toBeDefined();
    });
  });
});
