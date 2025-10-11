import { Marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import chalk from 'chalk';

// Initialize marked with terminal renderer
const marked = new Marked(
  markedTerminal({
    // Code block styling
    code: chalk.cyan,
    blockquote: chalk.gray.italic,
    html: chalk.gray,
    heading: chalk.green.bold,
    firstHeading: chalk.magenta.underline.bold,
    hr: chalk.reset,
    listitem: chalk.reset,
    list: (body: string) => body,
    table: chalk.reset,
    paragraph: chalk.reset,
    strong: chalk.bold,
    em: chalk.italic,
    codespan: chalk.cyan,
    del: chalk.dim.strikethrough,
    link: chalk.blue.underline,
    href: chalk.blue.underline,
  }) as any
);

/**
 * Render markdown to terminal-friendly format
 */
export function renderMarkdown(markdown: string): string {
  try {
    const rendered = marked.parse(markdown) as string;
    return rendered.trim();
  } catch (error) {
    // If markdown parsing fails, return the original text
    return markdown;
  }
}

/**
 * Strip markdown formatting and return plain text
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1') // italic
    .replace(/__(.+?)__/g, '$1') // bold
    .replace(/_(.+?)_/g, '$1') // italic
    .replace(/~~(.+?)~~/g, '$1') // strikethrough
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/```[\s\S]+?```/g, '') // code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/^#+\s+/gm, '') // headings
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/^[-*+]\s+/gm, '') // unordered lists
    .replace(/^\d+\.\s+/gm, '') // ordered lists
    .trim();
}

/**
 * Check if text contains markdown formatting
 */
export function isMarkdown(text: string): boolean {
  const markdownPatterns = [
    /\*\*(.+?)\*\*/, // bold
    /__(.+?)__/, // bold
    /\*(.+?)\*/, // italic
    /_(.+?)_/, // italic
    /~~(.+?)~~/, // strikethrough
    /`(.+?)`/, // inline code
    /```[\s\S]+?```/, // code blocks
    /!\[.*?\]\(.*?\)/, // images
    /\[(.+?)\]\(.+?\)/, // links
    /^#+\s+/m, // headings
    /^>\s+/m, // blockquotes
    /^[-*+]\s+/m, // unordered lists
    /^\d+\.\s+/m, // ordered lists
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}
