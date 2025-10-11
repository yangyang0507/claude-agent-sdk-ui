import chalk from 'chalk';
import figures from 'figures';
import { formatBytes, formatNumber } from '../../utils/terminal.js';
import { safeStringify } from '../../utils/error-handler.js';
import type { ThemeConfig, ToolResult } from '../../types.js';
import { defaultTheme } from '../../themes/default.js';

export interface ToolResultOptions {
  theme?: ThemeConfig;
  showDetails?: boolean;
  maxOutputLength?: number;
}

/**
 * Render tool result (tool output) message
 */
export function renderToolResult(result: ToolResult, options: ToolResultOptions = {}): string {
  const { theme = defaultTheme, showDetails = true, maxOutputLength = 500 } = options;

  const lines: string[] = [];

  if (result.error) {
    // Error result
    lines.push(chalk.dim('   ├─ ') + chalk.hex(theme.colors.error)(figures.cross + ' 错误'));
    if (showDetails) {
      const errorText = truncateOutput(result.error, maxOutputLength);
      lines.push(chalk.dim('   └─ ') + chalk.red(errorText));
    }
  } else if (result.output) {
    // Success result with output
    const summary = generateOutputSummary(result.output);
    if (summary) {
      lines.push(chalk.dim('   ├─ ') + summary);
    }

    if (showDetails && shouldShowOutput(result.output)) {
      const outputText = formatOutput(result.output, maxOutputLength);
      if (outputText) {
        lines.push(chalk.dim('   └─ ') + chalk.dim(outputText));
      }
    }
  }

  return lines.join('\n');
}

/**
 * Generate a summary of the tool output
 */
function generateOutputSummary(output: any): string | null {
  if (typeof output === 'string') {
    const lines = output.split('\n').length;
    if (lines > 1) {
      return `读取 ${chalk.cyan(formatNumber(lines))} 行`;
    }
    return null;
  }

  if (Array.isArray(output)) {
    return `返回 ${chalk.cyan(formatNumber(output.length))} 项`;
  }

  if (typeof output === 'object' && output !== null) {
    // Check for common patterns
    if ('size' in output && typeof output.size === 'number') {
      return `文件大小: ${chalk.cyan(formatBytes(output.size))}`;
    }

    if ('count' in output && typeof output.count === 'number') {
      return `计数: ${chalk.cyan(formatNumber(output.count))}`;
    }

    const keys = Object.keys(output).length;
    if (keys > 0) {
      return `${chalk.cyan(formatNumber(keys))} 个属性`;
    }
  }

  return null;
}

/**
 * Check if we should show the full output
 */
function shouldShowOutput(output: any): boolean {
  // Don't show output for very large objects or arrays
  if (Array.isArray(output) && output.length > 10) {
    return false;
  }

  if (typeof output === 'object' && output !== null) {
    const keys = Object.keys(output);
    if (keys.length > 10) {
      return false;
    }
  }

  return true;
}

/**
 * Format output for display
 */
function formatOutput(output: any, maxLength: number): string {
  let text: string;

  if (typeof output === 'string') {
    text = output;
  } else {
    text = safeStringify(output, 2);
  }

  return truncateOutput(text, maxLength);
}

/**
 * Truncate output to max length
 */
function truncateOutput(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + chalk.dim('...');
}
