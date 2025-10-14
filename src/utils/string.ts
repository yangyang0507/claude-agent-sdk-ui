/**
 * 字符串处理工具函数
 */

import stripAnsi from 'strip-ansi';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';

/**
 * 获取字符串的显示宽度(考虑 ANSI 代码)
 */
export function getStringWidth(str: string): number {
  return stringWidth(str);
}

/**
 * 移除 ANSI 代码
 */
export function removeAnsi(str: string): string {
  return stripAnsi(str);
}

/**
 * 包装文本到指定宽度
 */
export function wrapText(text: string, width: number): string {
  return wrapAnsi(text, width, { hard: true, trim: false });
}

/**
 * 截断文本
 */
export function truncate(
  text: string,
  maxLength: number,
  ellipsis = '...'
): string {
  if (getStringWidth(text) <= maxLength) {
    return text;
  }

  const plainText = stripAnsi(text);
  const targetLength = maxLength - ellipsis.length;

  let result = '';
  let width = 0;

  for (const char of plainText) {
    const charWidth = stringWidth(char);
    if (width + charWidth > targetLength) {
      break;
    }
    result += char;
    width += charWidth;
  }

  return result + ellipsis;
}

/**
 * 左对齐文本
 */
export function alignLeft(text: string, width: number): string {
  const textWidth = getStringWidth(text);
  if (textWidth >= width) {
    return text;
  }
  return text + ' '.repeat(width - textWidth);
}

/**
 * 右对齐文本
 */
export function alignRight(text: string, width: number): string {
  const textWidth = getStringWidth(text);
  if (textWidth >= width) {
    return text;
  }
  return ' '.repeat(width - textWidth) + text;
}

/**
 * 居中对齐文本
 */
export function alignCenter(text: string, width: number): string {
  const textWidth = getStringWidth(text);
  if (textWidth >= width) {
    return text;
  }
  const leftPadding = Math.floor((width - textWidth) / 2);
  const rightPadding = width - textWidth - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}

/**
 * 分割文本为多行
 */
export function splitLines(text: string): string[] {
  return text.split(/\r?\n/);
}

/**
 * 截断输出(保留前后部分)
 */
export function truncateOutput(
  text: string,
  maxLines: number,
  ellipsisLine = '... (truncated) ...'
): string {
  const lines = splitLines(text);

  if (lines.length <= maxLines) {
    return text;
  }

  const halfLines = Math.floor((maxLines - 1) / 2);
  const topLines = lines.slice(0, halfLines);
  const bottomLines = lines.slice(-halfLines);

  return [...topLines, ellipsisLine, ...bottomLines].join('\n');
}

/**
 * 添加缩进
 */
export function indent(text: string, spaces = 2, skipFirstLine = false): string {
  const lines = splitLines(text);
  const indentation = ' '.repeat(spaces);

  return lines
    .map((line, index) => {
      if (index === 0 && skipFirstLine) {
        return line;
      }
      return indentation + line;
    })
    .join('\n');
}

/**
 * 移除空行
 */
export function removeEmptyLines(text: string): string {
  return splitLines(text)
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/**
 * 确保文本以换行符结尾
 */
export function ensureNewline(text: string): string {
  return text.endsWith('\n') ? text : text + '\n';
}

/**
 * 移除尾部换行符
 */
export function trimNewline(text: string): string {
  return text.replace(/\n+$/, '');
}

/**
 * 转义特殊字符
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 检测语言(从代码块标记中)
 */
export function detectLanguage(codeBlock: string): string | undefined {
  const match = codeBlock.match(/^```(\w+)/);
  return match ? match[1] : undefined;
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(2)} ${units[i]}`;
}

/**
 * 复数形式
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural || singular + 's'}`;
}
