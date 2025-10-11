import ora, { Ora } from 'ora';
import chalk from 'chalk';
import type { ThemeConfig } from '../../types.js';
import { defaultTheme } from '../../themes/default.js';

export interface SpinnerOptions {
  theme?: ThemeConfig;
  text?: string;
}

/**
 * Create a spinner for loading states
 */
export function createSpinner(options: SpinnerOptions = {}): Ora {
  const { theme = defaultTheme, text = 'Loading...' } = options;

  return ora({
    text: text,
    color: 'cyan',
    spinner: {
      interval: 80,
      frames: theme.symbols.spinner,
    },
  });
}

/**
 * Show a spinner while executing an async function
 */
export async function withSpinner<T>(
  fn: () => Promise<T>,
  options: SpinnerOptions = {}
): Promise<T> {
  const spinner = createSpinner(options);
  spinner.start();

  try {
    const result = await fn();
    spinner.succeed(chalk.green('完成'));
    return result;
  } catch (error) {
    spinner.fail(chalk.red('失败'));
    throw error;
  }
}
