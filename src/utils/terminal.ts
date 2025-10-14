/**
 * 终端控制工具函数
 */

import chalk from 'chalk';
import type { Theme } from '../types/theme.js';

/**
 * 获取终端宽度
 */
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

/**
 * 获取终端高度
 */
export function getTerminalHeight(): number {
  return process.stdout.rows || 24;
}

/**
 * 检查是否支持颜色
 */
export function supportsColor(): boolean {
  return chalk.level > 0;
}

/**
 * 检查是否为 TTY
 */
export function isTTY(): boolean {
  return process.stdout.isTTY ?? false;
}

/**
 * 清空终端
 */
export function clearTerminal(): void {
  if (isTTY()) {
    process.stdout.write('\x1B[2J\x1B[0f');
  }
}

/**
 * 移动光标到指定位置
 */
export function moveCursor(x: number, y: number): void {
  if (isTTY()) {
    process.stdout.write(`\x1B[${y};${x}H`);
  }
}

/**
 * 移动光标到起始位置
 */
export function moveCursorToStart(): void {
  if (isTTY()) {
    process.stdout.write('\x1B[0f');
  }
}

/**
 * 清除当前行
 */
export function clearLine(): void {
  if (isTTY()) {
    process.stdout.write('\x1B[2K\r');
  }
}

/**
 * 隐藏光标
 */
export function hideCursor(): void {
  if (isTTY()) {
    process.stdout.write('\x1B[?25l');
  }
}

/**
 * 显示光标
 */
export function showCursor(): void {
  if (isTTY()) {
    process.stdout.write('\x1B[?25h');
  }
}

/**
 * 应用颜色
 */
export function applyColor(text: string, color: string): string {
  if (!supportsColor()) {
    return text;
  }
  return chalk.hex(color)(text);
}

/**
 * 应用主题颜色
 */
export function applyThemeColor(text: string, colorType: keyof Theme['colors'], theme: Theme): string {
  const color = theme.colors[colorType];
  if (!color) {
    return text;
  }
  return applyColor(text, color);
}

/**
 * 加粗文本
 */
export function bold(text: string): string {
  return chalk.bold(text);
}

/**
 * 斜体文本
 */
export function italic(text: string): string {
  return chalk.italic(text);
}

/**
 * 下划线文本
 */
export function underline(text: string): string {
  return chalk.underline(text);
}

/**
 * 删除线文本
 */
export function strikethrough(text: string): string {
  return chalk.strikethrough(text);
}

/**
 * 暗淡文本
 */
export function dim(text: string): string {
  return chalk.dim(text);
}

/**
 * 创建渐变文本
 */
export function gradient(text: string, colors: string[]): string {
  if (!supportsColor() || colors.length === 0) {
    return text;
  }

  // 如果只有一个颜色,直接应用
  if (colors.length === 1) {
    return applyColor(text, colors[0]);
  }

  // 简单的渐变实现:将文本分段并应用不同颜色
  const chars = text.split('');
  const segmentSize = Math.ceil(chars.length / colors.length);

  return chars
    .map((char, index) => {
      const colorIndex = Math.min(Math.floor(index / segmentSize), colors.length - 1);
      return applyColor(char, colors[colorIndex]);
    })
    .join('');
}

/**
 * 创建彩虹文本
 */
export function rainbow(text: string): string {
  const colors = [
    '#FF0000', // 红
    '#FF7F00', // 橙
    '#FFFF00', // 黄
    '#00FF00', // 绿
    '#0000FF', // 蓝
    '#4B0082', // 靛
    '#9400D3', // 紫
  ];
  return gradient(text, colors);
}

/**
 * 输出到 stdout
 */
export function write(text: string): void {
  process.stdout.write(text);
}

/**
 * 输出一行
 */
export function writeLine(text: string): void {
  process.stdout.write(text + '\n');
}

/**
 * 输出到 stderr
 */
export function writeError(text: string): void {
  process.stderr.write(text);
}

/**
 * 输出错误行
 */
export function writeErrorLine(text: string): void {
  process.stderr.write(text + '\n');
}

/**
 * 创建进度条
 */
export function createProgressBar(current: number, total: number, width = 40): string {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage.toFixed(1)}%`;
}

/**
 * 等待指定时间(毫秒)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取环境变量配置
 */
export function getEnvConfig() {
  return {
    colorLevel: chalk.level,
    isTTY: isTTY(),
    supportsColor: supportsColor(),
    terminalWidth: getTerminalWidth(),
    terminalHeight: getTerminalHeight(),
    platform: process.platform,
    nodeVersion: process.version,
  };
}
