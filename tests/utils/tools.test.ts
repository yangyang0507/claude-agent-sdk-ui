/**
 * 工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeToolInput,
  formatToolLabel,
  summarizeToolInput,
  extractToolDetailLines,
} from '../../src/utils/tools.js';

describe('sanitizeToolInput', () => {
  it('应该隐藏 content 字段', () => {
    const input = {
      file_path: '/path/to/file',
      content: 'sensitive content',
    };
    const result = sanitizeToolInput(input);
    expect(result.content).toBe('[hidden]');
    expect(result.file_path).toBe('/path/to/file');
  });

  it('当 showContent 为 true 时应该保留原始内容', () => {
    const input = {
      file_path: '/path/to/file',
      content: 'sensitive content',
    };
    const result = sanitizeToolInput(input, { showContent: true });
    expect(result.content).toBe('sensitive content');
  });

  it('应该支持自定义隐藏字段', () => {
    const input = {
      password: 'secret123',
      username: 'user',
    };
    const result = sanitizeToolInput(input, { hiddenKeys: ['password'] });
    expect(result.password).toBe('[hidden]');
    expect(result.username).toBe('user');
  });

  it('应该支持自定义占位符', () => {
    const input = { content: 'test' };
    const result = sanitizeToolInput(input, { placeholder: '***' });
    expect(result.content).toBe('***');
  });

  it('应该递归处理嵌套对象', () => {
    const input = {
      nested: {
        content: 'nested content',
        other: 'value',
      },
    };
    const result = sanitizeToolInput(input);
    expect(result.nested.content).toBe('[hidden]');
    expect(result.nested.other).toBe('value');
  });

  it('应该递归处理数组', () => {
    const input = {
      items: [{ content: 'item1' }, { content: 'item2' }],
    };
    const result = sanitizeToolInput(input);
    expect(result.items[0].content).toBe('[hidden]');
    expect(result.items[1].content).toBe('[hidden]');
  });
});

describe('formatToolLabel', () => {
  it('应该将已知工具名转换为标签', () => {
    expect(formatToolLabel('Bash')).toBe('EXECUTE');
    expect(formatToolLabel('Read')).toBe('READ');
    expect(formatToolLabel('Write')).toBe('WRITE');
    expect(formatToolLabel('Edit')).toBe('EDIT');
    expect(formatToolLabel('Grep')).toBe('SEARCH');
    expect(formatToolLabel('Glob')).toBe('GLOB');
  });

  it('应该将未知工具名转为大写', () => {
    expect(formatToolLabel('CustomTool')).toBe('CUSTOMTOOL');
    expect(formatToolLabel('myTool')).toBe('MYTOOL');
  });
});

describe('summarizeToolInput', () => {
  it('应该优先提取 command 字段', () => {
    const input = {
      command: 'npm install',
      file_path: '/some/path',
    };
    expect(summarizeToolInput('Bash', input)).toBe('npm install');
  });

  it('应该提取 file_path 字段', () => {
    const input = {
      file_path: '/path/to/file.ts',
    };
    expect(summarizeToolInput('Read', input)).toBe('/path/to/file.ts');
  });

  it('应该结合 file_path 和 operation', () => {
    const input = {
      file_path: '/path/to/file.ts',
      operation: 'append',
    };
    expect(summarizeToolInput('Write', input)).toBe('/path/to/file.ts (append)');
  });

  it('应该提取 url 字段', () => {
    const input = {
      url: 'https://example.com',
    };
    expect(summarizeToolInput('WebFetch', input)).toBe('https://example.com');
  });

  it('应该提取 query/pattern 字段', () => {
    const input = {
      query: 'search term',
    };
    expect(summarizeToolInput('Search', input)).toBe('search term');
  });

  it('应该返回完整的 command 值', () => {
    const longCommand = 'a'.repeat(200);
    const input = { command: longCommand };
    const result = summarizeToolInput('Bash', input);
    expect(result).toBe(longCommand);
  });

  it('应该处理空输入', () => {
    expect(summarizeToolInput('Tool', {})).toBe('');
    expect(summarizeToolInput('Tool', null as any)).toBe('');
  });
});

describe('extractToolDetailLines', () => {
  it('应该提取非摘要字段', () => {
    const input = {
      file_path: '/path/to/file', // 摘要字段，不应该出现
      timeout: 5000,
      recursive: true,
    };
    const lines = extractToolDetailLines(input);
    expect(lines).toContain('timeout: 5000');
    expect(lines).toContain('recursive: true');
    expect(lines.join('')).not.toContain('file_path');
  });

  it('应该跳过 undefined 值', () => {
    const input = {
      defined: 'value',
      notDefined: undefined,
    };
    const lines = extractToolDetailLines(input);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('defined: value');
  });

  it('应该处理对象值', () => {
    const input = {
      options: { a: 1, b: 2 },
    };
    const lines = extractToolDetailLines(input);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('options:');
  });

  it('应该处理空输入', () => {
    expect(extractToolDetailLines({})).toEqual([]);
    expect(extractToolDetailLines(null as any)).toEqual([]);
  });
});
