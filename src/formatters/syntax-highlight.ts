import { highlight, supportsLanguage } from 'cli-highlight';
import chalk from 'chalk';

/**
 * Highlight code with syntax highlighting
 */
export function highlightCode(code: string, language: string = 'javascript'): string {
  try {
    // Check if the language is supported
    const lang = supportsLanguage(language) ? language : 'javascript';

    return highlight(code, {
      language: lang,
      ignoreIllegals: true,
      theme: {
        keyword: chalk.blue,
        built_in: chalk.cyan,
        type: chalk.cyan,
        literal: chalk.green,
        number: chalk.green,
        string: chalk.green,
        comment: chalk.gray,
        variable: chalk.white,
        title: chalk.yellow,
        'function': chalk.yellow,
        params: chalk.white,
        class: chalk.yellow,
        attr: chalk.cyan,
        tag: chalk.blue,
      },
    });
  } catch (error) {
    // If highlighting fails, return the code as-is
    return code;
  }
}

/**
 * Format code block with border and optional line numbers
 */
export function formatCodeBlock(
  code: string,
  language: string = 'javascript',
  showLineNumbers: boolean = false
): string {
  const highlighted = highlightCode(code, language);
  const lines = highlighted.split('\n');

  if (showLineNumbers) {
    const maxLineNumWidth = String(lines.length).length;
    const numberedLines = lines.map((line, index) => {
      const lineNum = String(index + 1).padStart(maxLineNumWidth, ' ');
      return `${chalk.dim(lineNum)} ${chalk.dim('│')} ${line}`;
    });
    return numberedLines.join('\n');
  }

  return highlighted;
}

/**
 * Detect language from code content or file extension
 */
export function detectLanguage(codeOrFilename: string): string {
  const languageMap: Record<string, string> = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.sh': 'bash',
    '.bash': 'bash',
    '.zsh': 'bash',
    '.json': 'json',
    '.xml': 'xml',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sql': 'sql',
    '.md': 'markdown',
    '.yaml': 'yaml',
    '.yml': 'yaml',
  };

  // Check if it's a filename with extension
  for (const [ext, lang] of Object.entries(languageMap)) {
    if (codeOrFilename.endsWith(ext)) {
      return lang;
    }
  }

  // Default to javascript
  return 'javascript';
}
