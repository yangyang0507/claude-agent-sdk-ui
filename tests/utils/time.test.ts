import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatTimestamp,
  formatRelativeTime,
  formatDuration,
  formatDurationDetailed,
  formatDurationCompact,
  now,
  timeDiff,
  formatTimeRange,
  isToday,
  isYesterday,
  formatSmartTime,
} from '../../src/utils/time.js';

describe('formatTimestamp', () => {
  it('应该使用默认格式格式化时间戳', () => {
    const timestamp = new Date('2024-01-15 10:30:45').getTime();
    expect(formatTimestamp(timestamp)).toBe('2024-01-15 10:30:45');
  });

  it('应该支持自定义格式', () => {
    const timestamp = new Date('2024-01-15 10:30:45').getTime();
    expect(formatTimestamp(timestamp, 'YYYY/MM/DD')).toBe('2024/01/15');
  });

  it('应该支持 Date 对象', () => {
    const date = new Date('2024-01-15 10:30:45');
    expect(formatTimestamp(date)).toBe('2024-01-15 10:30:45');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15 12:00:00'));
  });

  it('应该格式化相对时间', () => {
    const oneHourAgo = new Date('2024-01-15 11:00:00').getTime();
    const result = formatRelativeTime(oneHourAgo);
    expect(result).toContain('小时');
  });

  it('应该支持 Date 对象', () => {
    const date = new Date('2024-01-15 11:00:00');
    const result = formatRelativeTime(date);
    expect(result).toContain('小时');
  });
});

describe('formatDuration', () => {
  it('应该格式化毫秒', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('应该格式化秒', () => {
    expect(formatDuration(1000)).toBe('1.00s');
    expect(formatDuration(5500)).toBe('5.50s');
  });

  it('应该格式化分钟和秒', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  it('应该格式化小时和分钟', () => {
    expect(formatDuration(3600000)).toBe('1h 0m');
    expect(formatDuration(5400000)).toBe('1h 30m');
  });

  it('应该处理 0 毫秒', () => {
    expect(formatDuration(0)).toBe('0ms');
  });
});

describe('formatDurationDetailed', () => {
  it('应该格式化详细的持续时间', () => {
    expect(formatDurationDetailed(3661000)).toContain('小时');
    expect(formatDurationDetailed(3661000)).toContain('分钟');
    expect(formatDurationDetailed(3661000)).toContain('秒');
  });

  it('应该只显示非零部分', () => {
    const result = formatDurationDetailed(60000);
    expect(result).toContain('分钟');
    expect(result).not.toContain('小时');
  });

  it('应该格式化毫秒', () => {
    expect(formatDurationDetailed(500)).toBe('500毫秒');
  });

  it('应该处理 0 毫秒', () => {
    expect(formatDurationDetailed(0)).toBe('0毫秒');
  });
});

describe('formatDurationCompact', () => {
  it('应该格式化紧凑的毫秒', () => {
    expect(formatDurationCompact(500)).toBe('500ms');
  });

  it('应该格式化紧凑的秒', () => {
    expect(formatDurationCompact(30000)).toBe('30s');
  });

  it('应该格式化紧凑的分钟', () => {
    expect(formatDurationCompact(90000)).toBe('1:30');
  });

  it('应该格式化紧凑的小时', () => {
    expect(formatDurationCompact(3661000)).toBe('1:01:01');
  });

  it('应该正确填充零', () => {
    expect(formatDurationCompact(3605000)).toBe('1:00:05');
  });
});

describe('now', () => {
  it('应该返回当前时间戳', () => {
    const before = Date.now();
    const result = now();
    const after = Date.now();

    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });
});

describe('timeDiff', () => {
  it('应该计算时间差', () => {
    const start = 1000;
    const end = 5000;
    expect(timeDiff(start, end)).toBe(4000);
  });

  it('应该使用当前时间作为默认结束时间', () => {
    const start = Date.now() - 1000;
    const diff = timeDiff(start);
    expect(diff).toBeGreaterThanOrEqual(1000);
    expect(diff).toBeLessThan(2000);
  });

  it('应该处理负数差值', () => {
    expect(timeDiff(5000, 1000)).toBe(-4000);
  });
});

describe('formatTimeRange', () => {
  it('应该格式化时间范围', () => {
    const start = new Date('2024-01-15 10:00:00').getTime();
    const end = new Date('2024-01-15 10:05:30').getTime();
    const result = formatTimeRange(start, end);

    expect(result).toContain('10:00:00');
    expect(result).toContain('10:05:30');
    expect(result).toContain('5m 30s');
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15 12:00:00'));
  });

  it('应该识别今天的时间戳', () => {
    const today = new Date('2024-01-15 08:00:00').getTime();
    expect(isToday(today)).toBe(true);
  });

  it('应该拒绝昨天的时间戳', () => {
    const yesterday = new Date('2024-01-14 12:00:00').getTime();
    expect(isToday(yesterday)).toBe(false);
  });

  it('应该拒绝明天的时间戳', () => {
    const tomorrow = new Date('2024-01-16 12:00:00').getTime();
    expect(isToday(tomorrow)).toBe(false);
  });

  it('应该支持 Date 对象', () => {
    const today = new Date('2024-01-15 08:00:00');
    expect(isToday(today)).toBe(true);
  });
});

describe('isYesterday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15 12:00:00'));
  });

  it('应该识别昨天的时间戳', () => {
    const yesterday = new Date('2024-01-14 08:00:00').getTime();
    expect(isYesterday(yesterday)).toBe(true);
  });

  it('应该拒绝今天的时间戳', () => {
    const today = new Date('2024-01-15 12:00:00').getTime();
    expect(isYesterday(today)).toBe(false);
  });

  it('应该拒绝前天的时间戳', () => {
    const twoDaysAgo = new Date('2024-01-13 12:00:00').getTime();
    expect(isYesterday(twoDaysAgo)).toBe(false);
  });

  it('应该支持 Date 对象', () => {
    const yesterday = new Date('2024-01-14 08:00:00');
    expect(isYesterday(yesterday)).toBe(true);
  });
});

describe('formatSmartTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15 12:00:00'));
  });

  it('应该格式化今天的时间为 HH:mm:ss', () => {
    const today = new Date('2024-01-15 10:30:45').getTime();
    expect(formatSmartTime(today)).toBe('10:30:45');
  });

  it('应该格式化昨天的时间', () => {
    const yesterday = new Date('2024-01-14 10:30:45').getTime();
    expect(formatSmartTime(yesterday)).toBe('昨天 10:30:45');
  });

  it('应该格式化其他日期为完整格式', () => {
    const otherDay = new Date('2024-01-10 10:30:45').getTime();
    expect(formatSmartTime(otherDay)).toBe('2024-01-10 10:30:45');
  });

  it('应该支持 Date 对象', () => {
    const today = new Date('2024-01-15 10:30:45');
    expect(formatSmartTime(today)).toBe('10:30:45');
  });
});
