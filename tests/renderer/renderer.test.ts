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

const loggerMocks = vi.hoisted(() => ({
  instances: [] as any[],
}));

vi.mock('ink', () => ({
  render: (...args: any[]) => inkMocks.render(...args),
}));

vi.mock('../../src/utils/logger.js', () => {
  class MockSessionLogger {
    options: any;
    log = vi.fn();
    close = vi.fn();
    getLogFilePath = vi.fn(() => '/mock/log.jsonl');

    constructor(options: any) {
      this.options = options;
      loggerMocks.instances.push(this);
    }
  }

  return { SessionLogger: MockSessionLogger };
});

import { UIRenderer } from '../../src/renderer/renderer.js';

const createSystemInit = (sessionId = 'session-1'): SDKMessage =>
  ({
    type: 'system',
    subtype: 'init',
    session_id: sessionId,
  }) as any;

const createAssistant = (): SDKMessage =>
  ({
    type: 'assistant',
    message: { content: [] },
  }) as any;

const createStreamEvent = (eventType: string): SDKMessage =>
  ({
    type: 'stream_event',
    event: { type: eventType },
  }) as any;

const createStreamEventWithSession = (eventType: string, sessionId = 'session-s'): SDKMessage =>
  ({
    type: 'stream_event',
    session_id: sessionId,
    event: { type: eventType },
  }) as any;

describe('UIRenderer', () => {
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

    loggerMocks.instances.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该创建 app 并在后续消息时 rerender', async () => {
    const renderer = new UIRenderer();

    await renderer.render(createSystemInit('session-abc'));
    expect(inkMocks.render).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRenderElement.props.messages).toHaveLength(1);
    expect(inkMocks.lastRenderElement.props.isStreaming).toBe(false);

    await renderer.render(createAssistant());
    expect(inkMocks.app.rerender).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRerenderElement.props.messages).toHaveLength(2);

    const messages = renderer.getMessages();
    expect(messages).toHaveLength(2);
    expect(messages).not.toBe(renderer.getMessages());
  });

  it('未启用日志时 getLogger 和 getLogFilePath 应返回 null', () => {
    const renderer = new UIRenderer();

    expect(loggerMocks.instances).toHaveLength(0);
    expect(renderer.getLogger()).toBe(null);
    expect(renderer.getLogFilePath()).toBe(null);
  });

  it('启用日志时 getLogger 应返回实例', () => {
    const renderer = new UIRenderer({ logging: { enabled: true, verbose: true } });

    expect(loggerMocks.instances).toHaveLength(1);
    expect(renderer.getLogger()).toBe(loggerMocks.instances[0]);
  });

  it('应该在 session_id 可用后记录日志', async () => {
    const renderer = new UIRenderer({ logging: { enabled: true } });
    const logger = loggerMocks.instances[0];

    await renderer.render(createAssistant());
    expect(logger.log).not.toHaveBeenCalled();

    await renderer.render(createSystemInit('session-xyz'));
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log.mock.calls[0][1]).toBe('session-xyz');

    await renderer.render(createAssistant());
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log.mock.calls[1][1]).toBe('session-xyz');

    expect(renderer.getLogFilePath()).toBe('/mock/log.jsonl');
  });

  it('stream_event 在没有 sessionId 时不应记录日志或渲染', async () => {
    const renderer = new UIRenderer({ logging: { enabled: true } });
    const logger = loggerMocks.instances[0];

    await renderer.render(createStreamEvent('message_start'));

    expect(logger.log).not.toHaveBeenCalled();
    expect(inkMocks.render).not.toHaveBeenCalled();
    expect(renderer.getMessages()).toHaveLength(0);
  });

  it('stream_event 携带 sessionId 时应渲染并进入流式状态', async () => {
    const renderer = new UIRenderer({ logging: { enabled: true } });
    const logger = loggerMocks.instances[0];

    await renderer.render(createStreamEventWithSession('content_block_start'));

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(inkMocks.render).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRenderElement.props.isStreaming).toBe(true);
  });

  it('应该处理 stream_event 并更新流式状态', async () => {
    const renderer = new UIRenderer({ logging: { enabled: true } });
    const logger = loggerMocks.instances[0];

    await renderer.render(createSystemInit('session-stream'));
    logger.log.mockClear();
    inkMocks.app.rerender.mockClear();

    // message_start: 开始流式传输，isStreaming = true
    await renderer.render(createStreamEvent('message_start'));
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(renderer.getMessages()).toHaveLength(1);
    expect(inkMocks.app.rerender).toHaveBeenCalledTimes(1);
    expect(inkMocks.lastRerenderElement.props.isStreaming).toBe(true);

    // message_delta: 流式传输中，isStreaming 保持 true
    await renderer.render(createStreamEvent('message_delta'));
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(inkMocks.app.rerender).toHaveBeenCalledTimes(2);
    expect(inkMocks.lastRerenderElement.props.isStreaming).toBe(true);

    // message_stop: 结束流式传输，isStreaming = false
    await renderer.render(createStreamEvent('message_stop'));
    expect(logger.log).toHaveBeenCalledTimes(3);
    expect(inkMocks.app.rerender).toHaveBeenCalledTimes(3);
    expect(inkMocks.lastRerenderElement.props.isStreaming).toBe(false);
  });

  it('assistant 消息应结束流式状态', async () => {
    const renderer = new UIRenderer();

    await renderer.render(createSystemInit('session-end'));
    await renderer.render(createStreamEvent('message_start'));
    expect(inkMocks.lastRerenderElement.props.isStreaming).toBe(true);

    await renderer.render(createAssistant());
    expect(inkMocks.lastRerenderElement.props.isStreaming).toBe(false);
  });

  it('cleanup 应该释放资源并重置状态', async () => {
    const renderer = new UIRenderer({ logging: { enabled: true } });
    const logger = loggerMocks.instances[0];

    await renderer.render(createSystemInit('session-clean'));
    await renderer.cleanup();

    expect(inkMocks.app.unmount).toHaveBeenCalledTimes(1);
    expect(logger.close).toHaveBeenCalledTimes(1);
    expect(renderer.getMessages()).toHaveLength(0);
  });

  it('reset 应调用 cleanup 并重置状态', async () => {
    const renderer = new UIRenderer();

    await renderer.render(createSystemInit('session-reset'));
    await renderer.reset();

    expect(inkMocks.app.unmount).toHaveBeenCalledTimes(1);
    expect(renderer.getMessages()).toHaveLength(0);
  });

  it('cleanup 后再次 render 应重新创建 app', async () => {
    const renderer = new UIRenderer();

    await renderer.render(createSystemInit('session-a'));
    await renderer.cleanup();

    await renderer.render(createSystemInit('session-b'));

    expect(inkMocks.render).toHaveBeenCalledTimes(2);
  });
});
