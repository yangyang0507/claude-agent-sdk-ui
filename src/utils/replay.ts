/**
 * 日志重放工具
 *
 * 用于读取保存的日志文件并重放UI，方便调试和问题排查
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../types/renderer.js';
import { UIRenderer } from '../renderer/renderer.js';
import { StreamingRenderer } from '../renderer/streaming-renderer.js';

/**
 * 日志条目接口（与 logger.ts 中的定义一致）
 */
interface LogEntry {
  timestamp: string;
  sessionId: string;
  messageType: string;
  message: SDKMessage;
  metadata?: Record<string, unknown>;
}

/**
 * 重放配置选项
 */
export interface ReplayOptions extends RendererOptions {
  /**
   * 是否按原始时间间隔重放
   * @default false
   */
  realtime?: boolean;

  /**
   * 重放速度倍数（仅在 realtime 为 true 时有效）
   * @default 1
   */
  speed?: number;

  /**
   * 是否过滤 stream_event 消息
   * @default false
   */
  filterStreamEvents?: boolean;

  /**
   * 消息之间的固定延迟（毫秒，仅在 realtime 为 false 时有效）
   * @default 0
   */
  fixedDelay?: number;
}

/**
 * 日志重放器类
 *
 * @example
 * ```typescript
 * // 立即重放所有消息
 * const replayer = new LogReplayer();
 * await replayer.replay('logs/session-xxx.jsonl');
 *
 * // 按原始时间间隔重放（2倍速）
 * await replayer.replay('logs/session-xxx.jsonl', {
 *   realtime: true,
 *   speed: 2,
 * });
 *
 * // 使用固定延迟重放
 * await replayer.replay('logs/session-xxx.jsonl', {
 *   fixedDelay: 100,
 * });
 * ```
 */
export class LogReplayer {
  private renderer: UIRenderer | StreamingRenderer | null = null;

  /**
   * 读取并解析日志文件
   */
  private async readLogFile(logFilePath: string): Promise<LogEntry[]> {
    const content = await fs.readFile(logFilePath, 'utf-8');
    const lines = content.trim().split('\n');
    const entries: LogEntry[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as LogEntry;
        entries.push(entry);
      } catch (error) {
        console.error(`Failed to parse log line: ${line}`, error);
      }
    }

    return entries;
  }

  /**
   * 计算消息之间的延迟时间
   */
  private calculateDelay(
    currentTimestamp: string,
    previousTimestamp: string | null,
    speed: number
  ): number {
    if (!previousTimestamp) return 0;

    const current = new Date(currentTimestamp).getTime();
    const previous = new Date(previousTimestamp).getTime();
    const delay = (current - previous) / speed;

    return Math.max(0, delay);
  }

  /**
   * 重放日志文件
   *
   * @param logFilePath - 日志文件路径（相对路径或绝对路径）
   * @param options - 重放配置选项
   */
  async replay(logFilePath: string, options: ReplayOptions = {}): Promise<void> {
    // 规范化选项
    const {
      realtime = false,
      speed = 1,
      filterStreamEvents = false,
      fixedDelay = 0,
      streaming = false,
      ...rendererOptions
    } = options;

    // 解析日志文件路径
    const resolvedPath = path.isAbsolute(logFilePath)
      ? logFilePath
      : path.resolve(process.cwd(), logFilePath);

    // 读取日志文件
    console.log(`Reading log file: ${resolvedPath}`);
    const entries = await this.readLogFile(resolvedPath);
    console.log(`Found ${entries.length} log entries`);

    // 过滤消息（如果需要）
    const messages = entries
      .filter((entry) => {
        // 过滤 stream_event
        if (filterStreamEvents && entry.message.type === 'stream_event') {
          return false;
        }
        return true;
      })
      .map((entry) => entry.message);

    console.log(`Replaying ${messages.length} messages...`);

    // 创建渲染器
    if (streaming) {
      this.renderer = new StreamingRenderer(rendererOptions);
    } else {
      this.renderer = new UIRenderer(rendererOptions);
    }

    // 重放消息
    let previousTimestamp: string | null = null;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // 如果过滤 stream_event，跳过这条消息
      if (filterStreamEvents && entry.message.type === 'stream_event') {
        continue;
      }

      // 计算延迟
      let delay = 0;
      if (realtime && previousTimestamp) {
        delay = this.calculateDelay(entry.timestamp, previousTimestamp, speed);
      } else if (!realtime && fixedDelay > 0) {
        delay = fixedDelay;
      }

      // 等待延迟
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // 渲染消息
      await this.renderer.render(entry.message);

      previousTimestamp = entry.timestamp;
    }

    console.log('\nReplay completed!');
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    if (this.renderer) {
      await this.renderer.cleanup();
      this.renderer = null;
    }
  }
}

/**
 * 创建日志重放器实例
 */
export function createLogReplayer(): LogReplayer {
  return new LogReplayer();
}

/**
 * 快捷重放函数
 *
 * @example
 * ```typescript
 * // 基本用法
 * await replayLog('logs/session-xxx.jsonl');
 *
 * // 使用选项
 * await replayLog('logs/session-xxx.jsonl', {
 *   theme: 'claude-code',
 *   realtime: true,
 *   speed: 2,
 * });
 * ```
 */
export async function replayLog(
  logFilePath: string,
  options?: ReplayOptions
): Promise<void> {
  const replayer = createLogReplayer();
  try {
    await replayer.replay(logFilePath, options);
  } finally {
    await replayer.cleanup();
  }
}
