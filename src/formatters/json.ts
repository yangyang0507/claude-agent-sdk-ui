/**
 * JSON 格式化器
 * 提供美化、高亮、深度限制等功能
 */

import { highlight } from 'cli-highlight';
import type { Theme } from '../types/theme.js';

/**
 * JSON 格式化选项
 */
export interface JsonFormatOptions {
  /** 主题配置 */
  theme?: Theme;

  /** 是否启用语法高亮 */
  highlight?: boolean;

  /** 缩进空格数 */
  indent?: number;

  /** 最大深度(0 表示无限制) */
  maxDepth?: number;

  /** 是否排序键 */
  sortKeys?: boolean;

  /** 是否显示行号 */
  showLineNumbers?: boolean;
}

/**
 * JSON 格式化器类
 */
export class JsonFormatter {
  private options: Required<JsonFormatOptions>;

  constructor(options: JsonFormatOptions = {}) {
    this.options = {
      theme: options.theme as Theme,
      highlight: options.highlight ?? true,
      indent: options.indent ?? 2,
      maxDepth: options.maxDepth ?? 0, // 0 = 无限制
      sortKeys: options.sortKeys ?? false,
      showLineNumbers: options.showLineNumbers ?? false,
    };
  }

  /**
   * 格式化 JSON
   */
  format(data: unknown): string {
    try {
      // 限制深度
      const processed =
        this.options.maxDepth > 0
          ? this.limitDepth(data, this.options.maxDepth)
          : data;

      // 排序键
      const sorted = this.options.sortKeys ? this.sortKeys(processed) : processed;

      // 美化打印
      const formatted = JSON.stringify(sorted, null, this.options.indent);

      // 语法高亮
      let result = this.options.highlight
        ? highlight(formatted, {
            language: 'json',
            ignoreIllegals: true,
          })
        : formatted;

      // 添加行号
      if (this.options.showLineNumbers) {
        result = this.addLineNumbers(result);
      }

      return result;
    } catch (error) {
      console.error('JSON formatting error:', error);
      return String(data);
    }
  }

  /**
   * 限制对象深度
   */
  private limitDepth(data: unknown, maxDepth: number, currentDepth = 0): unknown {
    if (currentDepth >= maxDepth) {
      if (Array.isArray(data)) {
        return `[Array(${data.length})]`;
      }
      if (data !== null && typeof data === 'object') {
        return `[Object]`;
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.limitDepth(item, maxDepth, currentDepth + 1));
    }

    if (data !== null && typeof data === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.limitDepth(value, maxDepth, currentDepth + 1);
      }
      return result;
    }

    return data;
  }

  /**
   * 递归排序对象的键
   */
  private sortKeys(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.sortKeys(item));
    }

    if (data !== null && typeof data === 'object') {
      const sorted: Record<string, unknown> = {};
      const keys = Object.keys(data).sort();
      for (const key of keys) {
        sorted[key] = this.sortKeys((data as Record<string, unknown>)[key]);
      }
      return sorted;
    }

    return data;
  }

  /**
   * 添加行号
   */
  private addLineNumbers(text: string): string {
    const lines = text.split('\n');
    const maxLineNumWidth = String(lines.length).length;

    return lines
      .map((line, index) => {
        const lineNum = String(index + 1).padStart(maxLineNumWidth, ' ');
        return `${lineNum} │ ${line}`;
      })
      .join('\n');
  }

  /**
   * 更新选项
   */
  setOptions(options: Partial<JsonFormatOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

/**
 * 便捷函数: 格式化 JSON
 */
export function formatJson(
  data: unknown,
  theme: Theme,
  options?: JsonFormatOptions
): string {
  const formatter = new JsonFormatter({ ...options, theme });
  return formatter.format(data);
}

/**
 * 便捷函数: 创建 JSON 格式化器
 */
export function createJsonFormatter(options?: JsonFormatOptions): JsonFormatter {
  return new JsonFormatter(options);
}
