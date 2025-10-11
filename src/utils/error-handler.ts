import chalk from 'chalk';
import logSymbols from 'log-symbols';

/**
 * Format error message for display
 */
export function formatError(error: Error | string): string {
  const message = error instanceof Error ? error.message : error;
  return `${logSymbols.error} ${chalk.red('Error:')} ${message}`;
}

/**
 * Format warning message for display
 */
export function formatWarning(message: string): string {
  return `${logSymbols.warning} ${chalk.yellow('Warning:')} ${message}`;
}

/**
 * Format info message for display
 */
export function formatInfo(message: string): string {
  return `${logSymbols.info} ${chalk.blue('Info:')} ${message}`;
}

/**
 * Format success message for display
 */
export function formatSuccess(message: string): string {
  return `${logSymbols.success} ${chalk.green('Success:')} ${message}`;
}

/**
 * Handle and format errors with optional stack trace
 */
export function handleError(error: Error, showStack: boolean = false): string {
  let output = formatError(error);

  if (showStack && error.stack) {
    output += '\n\n' + chalk.dim(error.stack);
  }

  return output;
}

/**
 * Safely stringify an object for error messages
 */
export function safeStringify(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    return String(obj);
  }
}
