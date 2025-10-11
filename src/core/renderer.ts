import chalk from 'chalk';
import dayjs from 'dayjs';
import { renderTextMessage } from '../components/message/text-message.js';
import { renderToolUse, renderToolUseComplete } from '../components/message/tool-use.js';
import { renderToolResult } from '../components/message/tool-result.js';
import type { AgentMessage, RenderOptions, ThemeConfig } from '../types.js';
import { getTerminalWidth } from '../utils/terminal.js';

/**
 * Agent Renderer class for rendering messages
 */
export class AgentRenderer {
  private options: Required<RenderOptions>;
  private theme: ThemeConfig;
  private activeTool: Map<string, { name: string; startTime: number }> = new Map();

  constructor(options: RenderOptions = {}) {
    // Set defaults
    this.options = {
      theme: options.theme || 'dark',
      showTimestamps: options.showTimestamps ?? false,
      showTokenUsage: options.showTokenUsage ?? false,
      showToolDetails: options.showToolDetails ?? true,
      compactMode: options.compactMode ?? false,
      streaming: options.streaming ?? true,
      typingEffect: options.typingEffect ?? false,
      typingSpeed: options.typingSpeed ?? 50,
      interactive: options.interactive ?? false,
      confirmActions: options.confirmActions ?? false,
      codeHighlight: options.codeHighlight ?? true,
      markdownRendering: options.markdownRendering ?? true,
      maxWidth: options.maxWidth ?? getTerminalWidth(),
      customRenderers: options.customRenderers || {},
      onToolStart: options.onToolStart || (() => {}),
      onToolEnd: options.onToolEnd || (() => {}),
      onError: options.onError || (() => {}),
    };

    // Initialize theme
    this.theme = this.getTheme(this.options.theme);
  }

  /**
   * Get theme configuration
   */
  private getTheme(themeOption: 'dark' | 'light' | ThemeConfig): ThemeConfig {
    if (typeof themeOption === 'object') {
      return themeOption;
    }

    // Import themes dynamically
    if (themeOption === 'light') {
      const { lightTheme } = require('../themes/light.js');
      return lightTheme;
    }

    const { darkTheme } = require('../themes/dark.js');
    return darkTheme;
  }

  /**
   * Render a message
   */
  async render(message: AgentMessage): Promise<void> {
    try {
      const output = this.renderMessage(message);
      if (output) {
        console.log(output);
      }
    } catch (error) {
      this.options.onError(error as Error);
      console.error(chalk.red('Failed to render message:'), error);
    }
  }

  /**
   * Render message content
   */
  private renderMessage(message: AgentMessage): string {
    const lines: string[] = [];

    // Add timestamp if enabled
    if (this.options.showTimestamps && message.timestamp) {
      const timestamp = dayjs(message.timestamp).format('HH:mm:ss');
      lines.push(chalk.dim(`[${timestamp}]`));
    }

    // Handle different content types
    if (typeof message.content === 'string') {
      // Simple text message
      const rendered = renderTextMessage(message.role, message.content, {
        theme: this.theme,
        renderMarkdown: this.options.markdownRendering,
      });
      lines.push(rendered);
    } else if (Array.isArray(message.content)) {
      // Complex message with multiple content blocks
      for (const block of message.content) {
        const rendered = this.renderContentBlock(block);
        if (rendered) {
          lines.push(rendered);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Render a content block
   */
  private renderContentBlock(block: any): string {
    switch (block.type) {
      case 'text':
        return renderTextMessage('assistant', block.text || '', {
          theme: this.theme,
          renderMarkdown: this.options.markdownRendering,
          showRole: false,
        });

      case 'tool_use':
        return this.renderToolUseBlock(block);

      case 'tool_result':
        return this.renderToolResultBlock(block);

      case 'thinking':
        return this.renderThinkingBlock(block);

      default:
        return '';
    }
  }

  /**
   * Render tool use block
   */
  private renderToolUseBlock(block: any): string {
    const toolUse = {
      id: block.id || block.tool_use_id || '',
      name: block.name || '',
      input: block.input || {},
      timestamp: Date.now(),
    };

    // Store active tool for later completion
    this.activeTool.set(toolUse.id, {
      name: toolUse.name,
      startTime: toolUse.timestamp,
    });

    // Trigger callback
    this.options.onToolStart(toolUse.name);

    // Use custom renderer if available
    if (this.options.customRenderers[toolUse.name]) {
      return this.options.customRenderers[toolUse.name](block);
    }

    return renderToolUse(toolUse, {
      theme: this.theme,
      showDetails: this.options.showToolDetails,
      compact: this.options.compactMode,
    });
  }

  /**
   * Render tool result block
   */
  private renderToolResultBlock(block: any): string {
    const toolResult = {
      tool_use_id: block.tool_use_id || '',
      output: block.output,
      error: block.error,
      timestamp: Date.now(),
    };

    // Calculate duration if we have the start time
    const toolInfo = this.activeTool.get(toolResult.tool_use_id);
    const duration = toolInfo ? Date.now() - toolInfo.startTime : undefined;

    // Trigger callback
    if (toolInfo) {
      this.options.onToolEnd(toolInfo.name, toolResult);
      this.activeTool.delete(toolResult.tool_use_id);
    }

    const lines: string[] = [];

    // Render result details
    const resultOutput = renderToolResult(toolResult, {
      theme: this.theme,
      showDetails: this.options.showToolDetails,
    });
    if (resultOutput) {
      lines.push(resultOutput);
    }

    // Render completion message
    if (toolInfo) {
      const completeOutput = renderToolUseComplete(
        { id: toolResult.tool_use_id, name: toolInfo.name, input: {} },
        duration,
        { theme: this.theme }
      );
      lines.push(completeOutput);
    }

    return lines.join('\n');
  }

  /**
   * Render thinking block
   */
  private renderThinkingBlock(block: any): string {
    const text = block.text || '';
    return chalk.dim('💭 思考中...\n') + chalk.dim(text);
  }

  /**
   * Render a divider line
   */
  renderDivider(): void {
    const width = Math.min(this.options.maxWidth, getTerminalWidth());
    console.log(chalk.dim('─'.repeat(width)));
  }

  /**
   * Render a header
   */
  renderHeader(text: string): void {
    const width = Math.min(this.options.maxWidth, getTerminalWidth());
    const padding = Math.max(0, Math.floor((width - text.length - 4) / 2));
    const line = '─'.repeat(width);

    console.log(chalk.hex(this.theme.colors.primary)('╭' + line.slice(2, -1) + '╮'));
    console.log(
      chalk.hex(this.theme.colors.primary)('│') +
        ' '.repeat(padding) +
        chalk.bold(text) +
        ' '.repeat(width - padding - text.length - 2) +
        chalk.hex(this.theme.colors.primary)('│')
    );
    console.log(chalk.hex(this.theme.colors.primary)('╰' + line.slice(2, -1) + '╯'));
  }

  /**
   * Render footer with stats
   */
  renderFooter(stats: { duration?: number; tokens?: number }): void {
    const parts: string[] = [];

    if (stats.duration !== undefined) {
      parts.push(`⏱️  总耗时: ${(stats.duration / 1000).toFixed(1)}s`);
    }

    if (this.options.showTokenUsage && stats.tokens !== undefined) {
      parts.push(`💰 Token: ${stats.tokens.toLocaleString()}`);
    }

    if (parts.length > 0) {
      console.log('\n' + chalk.dim(parts.join(' | ')));
    }
  }
}
