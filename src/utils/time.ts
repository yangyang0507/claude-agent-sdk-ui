/**
 * 时间格式化工具函数
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/zh-cn.js';

// 加载插件
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(timestamp).format(format);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(timestamp: number | Date): string {
  return dayjs(timestamp).fromNow();
}

/**
 * 格式化持续时间(毫秒)
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }

  if (ms < 3600000) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

/**
 * 格式化持续时间(详细)
 */
export function formatDurationDetailed(ms: number): string {
  const duration = dayjs.duration(ms);

  const parts: string[] = [];

  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  const milliseconds = duration.milliseconds();

  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }
  if (seconds > 0) {
    parts.push(`${seconds}秒`);
  }
  if (milliseconds > 0 && parts.length === 0) {
    parts.push(`${milliseconds}毫秒`);
  }

  return parts.join(' ') || '0毫秒';
}

/**
 * 格式化紧凑的持续时间
 */
export function formatDurationCompact(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  if (minutes > 0) {
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  return `${seconds}s`;
}

/**
 * 获取当前时间戳
 */
export function now(): number {
  return Date.now();
}

/**
 * 计算时间差(毫秒)
 */
export function timeDiff(start: number, end: number = Date.now()): number {
  return end - start;
}

/**
 * 格式化时间范围
 */
export function formatTimeRange(start: number, end: number): string {
  const startTime = dayjs(start).format('HH:mm:ss');
  const endTime = dayjs(end).format('HH:mm:ss');
  const duration = formatDuration(end - start);

  return `${startTime} → ${endTime} (${duration})`;
}

/**
 * 检查是否为今天
 */
export function isToday(timestamp: number | Date): boolean {
  return dayjs(timestamp).isSame(dayjs(), 'day');
}

/**
 * 检查是否为昨天
 */
export function isYesterday(timestamp: number | Date): boolean {
  return dayjs(timestamp).isSame(dayjs().subtract(1, 'day'), 'day');
}

/**
 * 格式化智能时间
 * 今天: HH:mm:ss
 * 昨天: 昨天 HH:mm:ss
 * 其他: YYYY-MM-DD HH:mm:ss
 */
export function formatSmartTime(timestamp: number | Date): string {
  const date = dayjs(timestamp);

  if (isToday(timestamp)) {
    return date.format('HH:mm:ss');
  }

  if (isYesterday(timestamp)) {
    return `昨天 ${date.format('HH:mm:ss')}`;
  }

  return date.format('YYYY-MM-DD HH:mm:ss');
}
