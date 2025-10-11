import chalk from 'chalk';
import { renderMarkdown, isMarkdown } from '../../formatters/markdown.js';
import type { ThemeConfig } from '../../types.js';
import { defaultTheme } from '../../themes/default.js';

export interface TextMessageOptions {
  theme?: ThemeConfig;
  renderMarkdown?: boolean;
  showRole?: boolean;
}

/**
 * Render a text message from user or assistant
 */
export function renderTextMessage(
  role: 'user' | 'assistant' | 'system',
  content: string,
  options: TextMessageOptions = {}
): string {
  const { theme = defaultTheme, renderMarkdown: shouldRenderMarkdown = true, showRole = true } = options;

  let output = '';

  // Add role prefix
  if (showRole) {
    const rolePrefix = getRolePrefix(role, theme);
    output += rolePrefix + ' ';
  }

  // Render content
  if (shouldRenderMarkdown && isMarkdown(content)) {
    output += renderMarkdown(content);
  } else {
    output += content;
  }

  return output;
}

/**
 * Get role prefix with icon and color
 */
function getRolePrefix(role: 'user' | 'assistant' | 'system', theme: ThemeConfig): string {
  switch (role) {
    case 'user':
      return chalk.hex(theme.colors.info)('💬 用户:');
    case 'assistant':
      return chalk.hex(theme.colors.primary)('🧠 Claude:');
    case 'system':
      return chalk.hex(theme.colors.dim)('⚙️  系统:');
  }
}
