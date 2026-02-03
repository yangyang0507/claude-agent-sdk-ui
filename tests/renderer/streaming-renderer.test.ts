import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

const inkMocks = vi.hoisted(() => ({
  render: vi.fn(),
  app: {
    rerender: vi.fn(),
    unmount: vi.fn(),
  },
  lastRenderElement: null as any,
  lastRerenderElement: null as any,
}));

vi.mock('ink', () => ({
  render: (...args: any[]) => inkMocks.render(...args),
}));

import { StreamingRenderer } from '../../src/renderer/streaming-renderer.js';

const createAssistant = (): SDKMessage =>
  ({
    type: 'assistant',
    message: { content: [] },
  }) as any;

const createUser = (): SDKMessage =>
  ({
    type: 'user',
    message: { content: [] },
  }) as any;

describe('StreamingRenderer', () => {
  beforeEach(() => {
    inkMocks.render.mockImplementation((element: any) => {
      inkMocks.lastRenderElement = element;
      return inkMocks.app;
    });

    inkMocks.app.rerender = vi.fn((element: any) => {
      inkMocks.lastRerenderElement = element;
    });
    inkMocks.app.unmount = vi.fn();

    inkMocks.lastRenderElement = null;
    inkMocks.lastRerenderElement = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('assistant 消息在流式模式下等待完成回调', async () => {
    const renderer = new StreamingRenderer();

    const renderPromise = renderer.render(createAssistant());

    expect(inkMocks.render).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRenderElement.props.currentStreamingIndex).toBe(0);
    expect(inkMocks.lastRenderElement.props.messages).toHaveLength(1);

    inkMocks.lastRenderElement.props.onStreamComplete();
    await renderPromise;
  });

  it('多条 assistant 消息应更新流式索引并触发 rerender', async () => {
    const renderer = new StreamingRenderer();

    const firstPromise = renderer.render(createAssistant());
    inkMocks.lastRenderElement.props.onStreamComplete();
    await firstPromise;

    const secondPromise = renderer.render(createAssistant());

    expect(inkMocks.app.rerender).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRerenderElement.props.currentStreamingIndex).toBe(1);
    expect(inkMocks.lastRerenderElement.props.messages).toHaveLength(2);

    inkMocks.lastRerenderElement.props.onStreamComplete();
    await secondPromise;
  });

  it('禁用 streaming 时不应进入流式状态', async () => {
    const renderer = new StreamingRenderer({ streaming: false });

    await renderer.render(createAssistant());

    expect(inkMocks.lastRenderElement.props.currentStreamingIndex).toBe(-1);
    expect(inkMocks.lastRenderElement.props.options.streaming).toBe(false);
  });

  it('typingEffect=false 时不应进入流式状态', async () => {
    const renderer = new StreamingRenderer({ typingEffect: false, streaming: true });

    await renderer.render(createAssistant());

    expect(inkMocks.lastRenderElement.props.currentStreamingIndex).toBe(-1);
    expect(inkMocks.lastRenderElement.props.options.typingEffect).toBe(false);
  });

  it('cleanup 应该卸载应用并清空消息', async () => {
    const renderer = new StreamingRenderer({ typingEffect: false });

    await renderer.render(createUser());
    expect(renderer.getMessages()).toHaveLength(1);
    expect(inkMocks.lastRenderElement.props.currentStreamingIndex).toBe(-1);

    await renderer.cleanup();

    expect(inkMocks.app.unmount).toHaveBeenCalledTimes(1);
    expect(renderer.getMessages()).toHaveLength(0);
  });
});
