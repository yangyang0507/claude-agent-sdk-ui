/**
 * 工具调用相关的辅助函数
 */

export interface SanitizeToolInputOptions {
  /** 是否显示原始 content 字段 */
  showContent?: boolean;
  /** 要隐藏的字段名列表（不区分大小写） */
  hiddenKeys?: string[];
  /** 被隐藏字段的占位文本 */
  placeholder?: string;
}

const DEFAULT_PLACEHOLDER = '[hidden]';
const DEFAULT_HIDDEN_KEYS = ['content'];

const TOOL_LABELS: Record<string, string> = {
  Bash: 'EXECUTE',
  Execute: 'EXECUTE',
  Shell: 'EXECUTE',
  Read: 'READ',
  Write: 'WRITE',
  Edit: 'EDIT',
  Glob: 'GLOB',
  Grep: 'SEARCH',
  Search: 'SEARCH',
  Plan: 'PLAN',
};

const SUMMARY_FIELDS = new Set([
  'command',
  'cmd',
  'file_path',
  'path',
  'query',
  'pattern',
  'term',
  'prompt',
  'text',
  'content',
  'url',
  'description', // 不显示内部的 description 字段
]);

function truncateValue(value: string, maxLength = 120): string {
  if (value.length <= maxLength) {
    return value;
  }
  return value.slice(0, maxLength - 1) + '…';
}

function valueToDisplay(value: unknown): string {
  if (typeof value === 'string') {
    return truncateValue(value.trim());
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value === null || value === undefined) {
    return String(value);
  }
  try {
    return truncateValue(JSON.stringify(value));
  } catch {
    return '[unsupported]';
  }
}

function getStringField(
  input: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

/**
 * 对工具输入进行脱敏处理，默认隐藏 content 字段
 */
export function sanitizeToolInput<T>(
  input: T,
  options: SanitizeToolInputOptions = {},
): T {
  const {
    showContent = false,
    hiddenKeys = DEFAULT_HIDDEN_KEYS,
    placeholder = DEFAULT_PLACEHOLDER,
  } = options;

  if (showContent) {
    return input;
  }

  const normalizedKeys = new Set(hiddenKeys.map((key) => key.toLowerCase()));

  const sanitize = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => sanitize(item));
    }
    if (value && typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        if (normalizedKeys.has(key.toLowerCase())) {
          result[key] = placeholder;
        } else {
          result[key] = sanitize(val);
        }
      }
      return result as unknown;
    }
    return value;
  };

  return sanitize(input) as T;
}

/**
 * 将工具名称转换成用于显示的标签
 */
export function formatToolLabel(name: string): string {
  return TOOL_LABELS[name] ?? name.toUpperCase();
}

/**
 * 提取工具主要输入,用于简要展示
 * @param _name - 工具名称(保留用于未来的定制逻辑)
 * @param input - 工具输入参数
 */
export function summarizeToolInput(
  _name: string,
  input: Record<string, unknown>,
): string {
  if (!input || typeof input !== 'object') {
    return '';
  }

  const command = getStringField(input, ['command', 'cmd']);
  if (command) {
    return command;
  }

  const path = getStringField(input, ['file_path', 'path']);
  if (path) {
    const operation =
      getStringField(input, ['operation', 'mode', 'write_mode']) ||
      (typeof input['impact'] === 'string' ? input['impact'] : undefined);
    return operation ? `${path} (${operation})` : path;
  }

  const url = getStringField(input, ['url']);
  if (url) {
    return url;
  }

  const query = getStringField(input, ['query', 'pattern', 'term', 'text', 'prompt']);
  if (query) {
    return query;
  }

  for (const [key, value] of Object.entries(input)) {
    if (SUMMARY_FIELDS.has(key.toLowerCase())) {
      continue;
    }
    if (value === undefined) {
      continue;
    }
    return `${key}: ${valueToDisplay(value)}`;
  }

  const entries = Object.entries(input);
  if (entries.length === 0) {
    return '';
  }

  const [firstKey, firstValue] = entries[0];
  return `${firstKey}: ${valueToDisplay(firstValue)}`;
}

/**
 * 提取用于展示的详细参数行
 */
export function extractToolDetailLines(
  input: Record<string, unknown>,
): string[] {
  if (!input || typeof input !== 'object') {
    return [];
  }

  const lines: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    if (SUMMARY_FIELDS.has(key.toLowerCase())) {
      continue;
    }
    if (value === undefined) {
      continue;
    }

    lines.push(`${key}: ${valueToDisplay(value)}`);
  }

  return lines;
}
