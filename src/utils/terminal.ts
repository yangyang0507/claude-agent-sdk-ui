import stripAnsi from 'strip-ansi';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';

/**
 * Get the terminal width
 */
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

/**
 * Truncate text to fit terminal width
 */
export function truncateText(text: string, maxWidth?: number): string {
  const width = maxWidth || getTerminalWidth();
  const textWidth = stringWidth(text);

  if (textWidth <= width) {
    return text;
  }

  return wrapAnsi(text, width, { hard: true, trim: false });
}

/**
 * Strip ANSI codes from text
 */
export function stripAnsiCodes(text: string): string {
  return stripAnsi(text);
}

/**
 * Calculate string width (accounting for ANSI codes)
 */
export function getStringWidth(text: string): number {
  return stringWidth(text);
}

/**
 * Center text in terminal
 */
export function centerText(text: string, width?: number): string {
  const termWidth = width || getTerminalWidth();
  const textWidth = getStringWidth(text);
  const padding = Math.max(0, Math.floor((termWidth - textWidth) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Add indentation to text
 */
export function indent(text: string, spaces: number = 2): string {
  const indentation = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => indentation + line)
    .join('\n');
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
