import chalk from 'chalk';
import figures from 'figures';
import type { ThemeConfig, ToolUse } from '../../types.js';
import { defaultTheme } from '../../themes/default.js';

export interface ToolUseOptions {
  theme?: ThemeConfig;
  showDetails?: boolean;
  compact?: boolean;
}

/**
 * Render tool use (tool call) message
 */
export function renderToolUse(tool: ToolUse, options: ToolUseOptions = {}): string {
  const { theme = defaultTheme, showDetails = true, compact = false } = options;

  const lines: string[] = [];

  // Header
  const toolIcon = '🔧';
  const toolName = chalk.hex(theme.colors.primary).bold(tool.name);
  lines.push(`${chalk.dim('┌─')} ${toolIcon} 工具调用: ${toolName}`);

  // Show input parameters if details are enabled
  if (showDetails && tool.input && Object.keys(tool.input).length > 0) {
    const params = formatToolInput(tool.input, compact);
    lines.push(chalk.dim('│  ') + params);
  }

  // Status indicator
  lines.push(chalk.dim('│  ') + chalk.yellow('⏱️  执行中...'));

  // Footer
  lines.push(chalk.dim('└─'));

  return lines.join('\n');
}

/**
 * Format tool input parameters
 */
function formatToolInput(input: any, compact: boolean): string {
  if (compact) {
    // Simple one-line format for compact mode
    const entries = Object.entries(input)
      .slice(0, 3)
      .map(([key, value]) => `${chalk.cyan(key)}: ${formatValue(value)}`)
      .join(', ');

    return entries + (Object.keys(input).length > 3 ? '...' : '');
  }

  // Detailed multi-line format
  const lines: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    lines.push(`${chalk.cyan(key)}: ${formatValue(value)}`);
  }

  return lines.join('\n' + chalk.dim('│  '));
}

/**
 * Format a value for display
 */
function formatValue(value: any): string {
  if (value === null) return chalk.dim('null');
  if (value === undefined) return chalk.dim('undefined');
  if (typeof value === 'boolean') return chalk.yellow(String(value));
  if (typeof value === 'number') return chalk.green(String(value));
  if (typeof value === 'string') {
    // Truncate long strings
    if (value.length > 100) {
      return chalk.green(`"${value.substring(0, 97)}..."`);
    }
    return chalk.green(`"${value}"`);
  }
  if (Array.isArray(value)) {
    return chalk.dim(`[${value.length} items]`);
  }
  if (typeof value === 'object') {
    return chalk.dim(`{${Object.keys(value).length} keys}`);
  }
  return String(value);
}

/**
 * Render tool use completion
 */
export function renderToolUseComplete(
  tool: ToolUse,
  duration?: number,
  options: ToolUseOptions = {}
): string {
  const { theme = defaultTheme } = options;

  const lines: string[] = [];

  // Header with checkmark
  const durationText = duration ? chalk.dim(`(${duration}ms)`) : '';
  lines.push(`${chalk.dim('└─')} ${chalk.hex(theme.colors.success)(figures.tick)} 完成 ${durationText}`);

  return lines.join('\n');
}
