/**
 * 日志工具类 - 用于保存会话日志
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

/**
 * 日志配置选项
 */
export interface LoggerOptions {
  /** 是否启用日志 */
  enabled: boolean;

  /** 日志保存路径（目录） */
  logPath?: string;

  /** 日志文件名格式（默认：'session-{sessionId}-{timestamp}.jsonl'） */
  fileNameFormat?: string;

  /** 是否在控制台输出日志信息 */
  verbose?: boolean;
}

/**
 * 日志条目
 */
export interface LogEntry {
  /** 时间戳 */
  timestamp: string;

  /** 会话 ID */
  sessionId: string;

  /** 消息类型 */
  messageType: string;

  /** 原始消息内容 */
  message: SDKMessage;

  /** 额外的元数据 */
  metadata?: Record<string, unknown>;
}

/**
 * Session Logger - 会话日志记录器
 *
 * 用于记录每个 session 的原始消息日志
 *
 * @example
 * ```typescript
 * const logger = new SessionLogger({
 *   enabled: true,
 *   logPath: './logs'
 * });
 *
 * await logger.log(message, sessionId);
 * await logger.close();
 * ```
 */
export class SessionLogger {
  private options: Required<LoggerOptions>;
  private currentSessionId: string | null = null;
  private logFilePath: string | null = null;
  private writeStream: fs.WriteStream | null = null;
  private messageCount = 0;

  constructor(options: LoggerOptions) {
    this.options = this.normalizeOptions(options);
  }

  /**
   * 标准化配置选项
   */
  private normalizeOptions(options: LoggerOptions): Required<LoggerOptions> {
    return {
      enabled: options.enabled ?? false,
      logPath: options.logPath ?? './logs',
      fileNameFormat: options.fileNameFormat ?? 'session-{sessionId}-{timestamp}.jsonl',
      verbose: options.verbose ?? false,
    };
  }

  /**
   * 生成日志文件名
   */
  private generateFileName(sessionId: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return this.options.fileNameFormat
      .replace('{sessionId}', sessionId)
      .replace('{timestamp}', timestamp);
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.options.logPath)) {
      fs.mkdirSync(this.options.logPath, { recursive: true });
      if (this.options.verbose) {
        console.log(`[Logger] Created log directory: ${this.options.logPath}`);
      }
    }
  }

  /**
   * 初始化会话日志
   */
  private async initSession(sessionId: string): Promise<void> {
    if (!this.options.enabled) return;

    this.currentSessionId = sessionId;
    this.messageCount = 0;

    // 确保日志目录存在
    this.ensureLogDirectory();

    // 生成日志文件路径
    const fileName = this.generateFileName(sessionId);
    this.logFilePath = path.join(this.options.logPath, fileName);

    // 创建写入流
    this.writeStream = fs.createWriteStream(this.logFilePath, {
      flags: 'a', // 追加模式
      encoding: 'utf8',
    });

    if (this.options.verbose) {
      console.log(`[Logger] Initialized session log: ${this.logFilePath}`);
    }

    // 写入会话开始标记
    await this.writeEntry({
      timestamp: new Date().toISOString(),
      sessionId,
      messageType: 'session_start',
      message: { type: 'system', message: { content: `Session ${sessionId} started` } } as any,
      metadata: {
        startTime: Date.now(),
      },
    });
  }

  /**
   * 写入日志条目
   */
  private async writeEntry(entry: LogEntry): Promise<void> {
    if (!this.writeStream || !this.options.enabled) return;

    return new Promise((resolve, reject) => {
      const line = JSON.stringify(entry) + '\n';
      this.writeStream!.write(line, (err) => {
        if (err) {
          console.error('[Logger] Failed to write log entry:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 记录消息日志
   *
   * @param message - SDK 消息
   * @param sessionId - 会话 ID
   * @param metadata - 额外的元数据
   */
  async log(
    message: SDKMessage,
    sessionId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!this.options.enabled) return;

    // 如果是新会话，初始化
    if (this.currentSessionId !== sessionId) {
      await this.close(); // 关闭之前的会话
      await this.initSession(sessionId);
    }

    // 写入日志条目
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      sessionId,
      messageType: message.type,
      message,
      metadata: {
        ...metadata,
        messageIndex: this.messageCount,
      },
    };

    await this.writeEntry(entry);
    this.messageCount++;

    if (this.options.verbose) {
      console.log(`[Logger] Logged message #${this.messageCount} (${message.type})`);
    }
  }

  /**
   * 关闭当前会话日志
   */
  async close(): Promise<void> {
    if (!this.writeStream) return;

    // 写入会话结束标记
    if (this.currentSessionId) {
      await this.writeEntry({
        timestamp: new Date().toISOString(),
        sessionId: this.currentSessionId,
        messageType: 'session_end',
        message: { type: 'system', message: { content: `Session ${this.currentSessionId} ended` } } as any,
        metadata: {
          endTime: Date.now(),
          totalMessages: this.messageCount,
        },
      });
    }

    return new Promise((resolve) => {
      this.writeStream!.end(() => {
        if (this.options.verbose && this.logFilePath) {
          console.log(`[Logger] Closed session log: ${this.logFilePath}`);
        }
        this.writeStream = null;
        this.logFilePath = null;
        this.currentSessionId = null;
        this.messageCount = 0;
        resolve();
      });
    });
  }

  /**
   * 获取当前日志文件路径
   */
  getLogFilePath(): string | null {
    return this.logFilePath;
  }

  /**
   * 获取当前会话 ID
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * 获取消息计数
   */
  getMessageCount(): number {
    return this.messageCount;
  }
}

/**
 * 创建日志记录器
 */
export function createLogger(options: LoggerOptions): SessionLogger {
  return new SessionLogger(options);
}
