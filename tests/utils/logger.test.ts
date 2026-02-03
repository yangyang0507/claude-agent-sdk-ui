import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'node:path';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

const fsMocks = vi.hoisted(() => ({
  writes: [] as string[],
  lastPath: '' as string,
  lastOptions: null as any,
  lastStream: null as any,
  createWriteStream: vi.fn(),
  access: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock('node:fs', () => ({
  createWriteStream: fsMocks.createWriteStream,
}));

vi.mock('node:fs/promises', () => ({
  access: fsMocks.access,
  mkdir: fsMocks.mkdir,
}));

import { SessionLogger } from '../../src/utils/logger.js';

const fixedNow = new Date('2024-01-15T10:30:45.000Z');

const createMessage = (type: SDKMessage['type']): SDKMessage =>
  ({
    type,
    message: { content: [] },
  }) as any;

const parseEntries = () =>
  fsMocks.writes.map((line) => JSON.parse(line.trim()));

describe('SessionLogger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    fsMocks.writes = [];
    fsMocks.lastPath = '';
    fsMocks.lastOptions = null;
    fsMocks.lastStream = null;

    fsMocks.createWriteStream.mockImplementation((filePath: string, options: any) => {
      fsMocks.lastPath = filePath;
      fsMocks.lastOptions = options;

      const stream = {
        write: vi.fn((chunk: string, cb?: (err?: Error | null) => void) => {
          fsMocks.writes.push(chunk);
          cb?.(null);
        }),
        end: vi.fn((cb?: () => void) => {
          cb?.();
        }),
      };

      fsMocks.lastStream = stream;
      return stream as any;
    });

    fsMocks.access.mockRejectedValue(new Error('missing'));
    fsMocks.mkdir.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('应该使用默认配置写入会话开始和消息日志', async () => {
    const logger = new SessionLogger({ enabled: true });
    const message = createMessage('assistant');

    await logger.log(message, 'session-1');

    const expectedTimestamp = fixedNow.toISOString().replace(/[:.]/g, '-');
    const expectedFileName = `session-session-1-${expectedTimestamp}.jsonl`;
    const expectedPath = path.join('logs', expectedFileName);

    expect(fsMocks.createWriteStream).toHaveBeenCalledTimes(1);
    expect(fsMocks.lastPath).toBe(expectedPath);
    expect(fsMocks.lastOptions).toEqual({ flags: 'a', encoding: 'utf8' });
    expect(fsMocks.mkdir).toHaveBeenCalledTimes(1);

    const entries = parseEntries();
    expect(entries).toHaveLength(2);

    expect(entries[0].messageType).toBe('session_start');
    expect(entries[0].sessionId).toBe('session-1');
    expect(entries[0].message.type).toBe('internal');

    expect(entries[1].messageType).toBe('assistant');
    expect(entries[1].metadata.messageIndex).toBe(0);

    expect(logger.getCurrentSessionId()).toBe('session-1');
    expect(logger.getMessageCount()).toBe(1);
    expect(logger.getLogFilePath()).toBe(expectedPath);
  });

  it('新会话应该关闭旧会话并重置计数', async () => {
    fsMocks.access.mockResolvedValue(undefined);

    const logger = new SessionLogger({ enabled: true, logPath: '/tmp/logs' });

    await logger.log(createMessage('assistant'), 'session-a');
    await logger.log(createMessage('user'), 'session-b');

    const entries = parseEntries();
    expect(entries).toHaveLength(5);

    expect(entries[0].messageType).toBe('session_start');
    expect(entries[1].messageType).toBe('assistant');
    expect(entries[2].messageType).toBe('session_end');
    expect(entries[2].metadata.totalMessages).toBe(1);
    expect(entries[3].messageType).toBe('session_start');
    expect(entries[4].messageType).toBe('user');

    expect(logger.getCurrentSessionId()).toBe('session-b');
    expect(logger.getMessageCount()).toBe(1);
  });

  it('关闭日志应该写入 session_end 并重置状态', async () => {
    const logger = new SessionLogger({ enabled: true });

    await logger.log(createMessage('assistant'), 'session-close');
    await logger.close();

    const entries = parseEntries();
    expect(entries).toHaveLength(3);
    expect(entries[2].messageType).toBe('session_end');

    expect(fsMocks.lastStream.end).toHaveBeenCalledTimes(1);
    expect(logger.getCurrentSessionId()).toBe(null);
    expect(logger.getMessageCount()).toBe(0);
    expect(logger.getLogFilePath()).toBe(null);
  });

  it('禁用日志时不应创建写入流', async () => {
    const logger = new SessionLogger({ enabled: false });

    await logger.log(createMessage('assistant'), 'session-off');
    await logger.close();

    expect(fsMocks.createWriteStream).not.toHaveBeenCalled();
    expect(fsMocks.writes).toHaveLength(0);
    expect(logger.getMessageCount()).toBe(0);
  });
});
