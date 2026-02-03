import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'node:path';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

const replayMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  uiInstances: [] as any[],
  streamingInstances: [] as any[],
  uiRenderCalls: [] as SDKMessage[],
  streamingRenderCalls: [] as SDKMessage[],
}));

vi.mock('node:fs/promises', () => ({
  readFile: replayMocks.readFile,
}));

vi.mock('../../src/renderer/renderer.js', () => {
  class MockUIRenderer {
    options: any;

    constructor(options: any) {
      this.options = options;
      replayMocks.uiInstances.push(this);
    }

    async render(message: SDKMessage): Promise<void> {
      replayMocks.uiRenderCalls.push(message);
    }

    async cleanup(): Promise<void> {
      (this as any).cleanupCalled = true;
    }
  }

  return { UIRenderer: MockUIRenderer };
});

vi.mock('../../src/renderer/streaming-renderer.js', () => {
  class MockStreamingRenderer {
    options: any;

    constructor(options: any) {
      this.options = options;
      replayMocks.streamingInstances.push(this);
    }

    async render(message: SDKMessage): Promise<void> {
      replayMocks.streamingRenderCalls.push(message);
    }

    async cleanup(): Promise<void> {
      (this as any).cleanupCalled = true;
    }
  }

  return { StreamingRenderer: MockStreamingRenderer };
});

import { LogReplayer, replayLog } from '../../src/utils/replay.js';

const makeLogContent = (entries: any[]) =>
  entries.map((entry) => JSON.stringify(entry)).join('\n');

describe('LogReplayer', () => {
  beforeEach(() => {
    replayMocks.readFile.mockReset();
    replayMocks.uiInstances.length = 0;
    replayMocks.streamingInstances.length = 0;
    replayMocks.uiRenderCalls.length = 0;
    replayMocks.streamingRenderCalls.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('应该过滤 stream_event 并使用 UIRenderer 渲染', async () => {
    const entries = [
      {
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 's1',
        messageType: 'assistant',
        message: { type: 'assistant', message: { content: [] } },
      },
      {
        timestamp: '2024-01-01T00:00:01.000Z',
        sessionId: 's1',
        messageType: 'stream_event',
        message: { type: 'stream_event' },
      },
      {
        timestamp: '2024-01-01T00:00:02.000Z',
        sessionId: 's1',
        messageType: 'user',
        message: { type: 'user', message: { content: [] } },
      },
    ];

    replayMocks.readFile.mockResolvedValue(makeLogContent(entries));

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const replayer = new LogReplayer();
    const relativePath = 'logs/session.jsonl';
    await replayer.replay(relativePath, { filterStreamEvents: true, theme: 'droid' });

    const expectedPath = path.resolve(process.cwd(), relativePath);
    expect(replayMocks.readFile).toHaveBeenCalledWith(expectedPath, 'utf-8');

    expect(replayMocks.uiInstances).toHaveLength(1);
    expect(replayMocks.uiRenderCalls.map((msg) => msg.type)).toEqual([
      'assistant',
      'user',
    ]);

    const options = replayMocks.uiInstances[0].options;
    expect(options.theme).toBe('droid');
    expect('filterStreamEvents' in options).toBe(false);

    await replayer.cleanup();
    expect(replayMocks.uiInstances[0].cleanupCalled).toBe(true);
  });

  it('streaming 模式应该使用 StreamingRenderer', async () => {
    replayMocks.readFile.mockResolvedValue(
      makeLogContent([
        {
          timestamp: '2024-01-01T00:00:00.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
      ])
    );

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const replayer = new LogReplayer();
    await replayer.replay('logs/stream.jsonl', { streaming: true, showThinking: true });

    expect(replayMocks.streamingInstances).toHaveLength(1);
    expect(replayMocks.streamingRenderCalls).toHaveLength(1);
    expect(replayMocks.uiInstances).toHaveLength(0);

    const options = replayMocks.streamingInstances[0].options;
    expect(options.showThinking).toBe(true);
    expect('streaming' in options).toBe(false);
  });

  it('realtime 模式应该按时间差计算延迟', async () => {
    vi.useFakeTimers();

    replayMocks.readFile.mockResolvedValue(
      makeLogContent([
        {
          timestamp: '2024-01-01T00:00:00.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
        {
          timestamp: '2024-01-01T00:00:02.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
      ])
    );

    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    const replayer = new LogReplayer();
    const promise = replayer.replay('logs/realtime.jsonl', {
      realtime: true,
      speed: 2,
    });

    await vi.runAllTimersAsync();
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    await promise;
  });

  it('fixedDelay 模式应该为每条消息等待固定时间', async () => {
    vi.useFakeTimers();

    replayMocks.readFile.mockResolvedValue(
      makeLogContent([
        {
          timestamp: '2024-01-01T00:00:00.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
        {
          timestamp: '2024-01-01T00:00:01.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
      ])
    );

    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    const replayer = new LogReplayer();
    const promise = replayer.replay('logs/fixed.jsonl', {
      fixedDelay: 200,
    });

    await vi.runAllTimersAsync();
    await promise;

    const fixedDelayCalls = setTimeoutSpy.mock.calls.filter(
      ([, delay]) => delay === 200
    );
    expect(fixedDelayCalls).toHaveLength(2);
  });

  it('应该忽略无效日志行并继续重放有效消息', async () => {
    const entries = [
      JSON.stringify({
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 's1',
        messageType: 'assistant',
        message: { type: 'assistant', message: { content: [] } },
      }),
      '',
      '{invalid json}',
      JSON.stringify({
        timestamp: '2024-01-01T00:00:01.000Z',
        sessionId: 's1',
        messageType: 'user',
        message: { type: 'user', message: { content: [] } },
      }),
    ];

    replayMocks.readFile.mockResolvedValue(entries.join('\n'));

    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const replayer = new LogReplayer();
    await replayer.replay('logs/invalid.jsonl');

    expect(errorSpy).toHaveBeenCalled();
    expect(replayMocks.uiRenderCalls.map((msg) => msg.type)).toEqual([
      'assistant',
      'user',
    ]);
  });
});

describe('replayLog', () => {
  beforeEach(() => {
    replayMocks.readFile.mockReset();
    replayMocks.uiInstances.length = 0;
    replayMocks.uiRenderCalls.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该在重放结束后调用 cleanup', async () => {
    replayMocks.readFile.mockResolvedValue(
      makeLogContent([
        {
          timestamp: '2024-01-01T00:00:00.000Z',
          sessionId: 's1',
          messageType: 'assistant',
          message: { type: 'assistant', message: { content: [] } },
        },
      ])
    );

    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await replayLog('logs/basic.jsonl');

    expect(replayMocks.uiInstances).toHaveLength(1);
    expect(replayMocks.uiInstances[0].cleanupCalled).toBe(true);
  });
});
