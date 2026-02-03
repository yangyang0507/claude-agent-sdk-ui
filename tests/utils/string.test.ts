import { describe, it, expect } from 'vitest';
import {
  getStringWidth,
  removeAnsi,
  wrapText,
  truncate,
  alignLeft,
  alignRight,
  alignCenter,
  splitLines,
  truncateOutput,
  indent,
  removeEmptyLines,
  ensureNewline,
  trimNewline,
  escapeHtml,
  detectLanguage,
  formatBytes,
  pluralize,
  parseThinkingTags,
} from '../../src/utils/string.js';

describe('getStringWidth', () => {
  it('应该正确计算纯英文字符串的宽度', () => {
    expect(getStringWidth('hello')).toBe(5);
  });

  it('应该正确计算包含中文字符的宽度', () => {
    expect(getStringWidth('你好')).toBe(4); // 中文字符宽度为 2
  });

  it('应该忽略 ANSI 代码计算宽度', () => {
    expect(getStringWidth('\x1b[31mhello\x1b[0m')).toBe(5);
  });

  it('应该处理空字符串', () => {
    expect(getStringWidth('')).toBe(0);
  });
});

describe('removeAnsi', () => {
  it('应该移除 ANSI 颜色代码', () => {
    expect(removeAnsi('\x1b[31mred text\x1b[0m')).toBe('red text');
  });

  it('应该处理没有 ANSI 代码的字符串', () => {
    expect(removeAnsi('plain text')).toBe('plain text');
  });

  it('应该处理空字符串', () => {
    expect(removeAnsi('')).toBe('');
  });
});

describe('truncate', () => {
  it('应该截断超长文本', () => {
    const result = truncate('hello world', 8);
    expect(result).toBe('hello...');
  });

  it('应该保留不超长的文本', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('应该支持自定义省略符', () => {
    const result = truncate('hello world', 8, '…');
    expect(result).toBe('hello w…');
  });

  it('应该正确处理中文字符', () => {
    const result = truncate('你好世界', 5);
    expect(result).toBe('你...'); // 中文字符宽度为 2
  });

  it('应该处理空字符串', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('alignLeft', () => {
  it('应该左对齐文本', () => {
    expect(alignLeft('hello', 10)).toBe('hello     ');
  });

  it('应该保留已经足够长的文本', () => {
    expect(alignLeft('hello world', 5)).toBe('hello world');
  });

  it('应该处理空字符串', () => {
    expect(alignLeft('', 5)).toBe('     ');
  });
});

describe('alignRight', () => {
  it('应该右对齐文本', () => {
    expect(alignRight('hello', 10)).toBe('     hello');
  });

  it('应该保留已经足够长的文本', () => {
    expect(alignRight('hello world', 5)).toBe('hello world');
  });
});

describe('alignCenter', () => {
  it('应该居中对齐文本', () => {
    expect(alignCenter('hello', 11)).toBe('   hello   ');
  });

  it('应该处理奇数宽度', () => {
    const result = alignCenter('hi', 5);
    expect(result.length).toBe(5);
    expect(result.trim()).toBe('hi');
  });

  it('应该保留已经足够长的文本', () => {
    expect(alignCenter('hello world', 5)).toBe('hello world');
  });
});

describe('splitLines', () => {
  it('应该分割 Unix 风格的换行符', () => {
    expect(splitLines('line1\nline2\nline3')).toEqual(['line1', 'line2', 'line3']);
  });

  it('应该分割 Windows 风格的换行符', () => {
    expect(splitLines('line1\r\nline2\r\nline3')).toEqual(['line1', 'line2', 'line3']);
  });

  it('应该处理单行文本', () => {
    expect(splitLines('single line')).toEqual(['single line']);
  });

  it('应该处理空字符串', () => {
    expect(splitLines('')).toEqual(['']);
  });
});

describe('truncateOutput', () => {
  it('应该截断超长输出', () => {
    const lines = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`);
    const text = lines.join('\n');
    const result = truncateOutput(text, 5);

    expect(result).toContain('line 1');
    expect(result).toContain('line 2');
    expect(result).toContain('... (truncated) ...');
    expect(result).toContain('line 9');
    expect(result).toContain('line 10');
  });

  it('应该保留不超长的输出', () => {
    const text = 'line1\nline2\nline3';
    expect(truncateOutput(text, 5)).toBe(text);
  });

  it('应该支持自定义省略行', () => {
    const lines = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`);
    const text = lines.join('\n');
    const result = truncateOutput(text, 5, '...');

    expect(result).toContain('...');
  });

  it('当 maxLines 很小应仅返回省略行', () => {
    const lines = Array.from({ length: 5 }, (_, i) => `line ${i + 1}`);
    const text = lines.join('\n');
    const result = truncateOutput(text, 1);

    const expected = ['... (truncated) ...', ...lines].join('\n');
    expect(result).toBe(expected);
  });
});

describe('indent', () => {
  it('应该为所有行添加缩进', () => {
    const result = indent('line1\nline2\nline3', 2);
    expect(result).toBe('  line1\n  line2\n  line3');
  });

  it('应该支持跳过第一行', () => {
    const result = indent('line1\nline2\nline3', 2, true);
    expect(result).toBe('line1\n  line2\n  line3');
  });

  it('应该支持自定义缩进空格数', () => {
    const result = indent('line1\nline2', 4);
    expect(result).toBe('    line1\n    line2');
  });

  it('应该处理单行文本', () => {
    expect(indent('single line', 2)).toBe('  single line');
  });
});

describe('removeEmptyLines', () => {
  it('应该移除空行', () => {
    const text = 'line1\n\nline2\n\nline3';
    expect(removeEmptyLines(text)).toBe('line1\nline2\nline3');
  });

  it('应该移除只包含空格的行', () => {
    const text = 'line1\n   \nline2';
    expect(removeEmptyLines(text)).toBe('line1\nline2');
  });

  it('应该保留没有空行的文本', () => {
    const text = 'line1\nline2\nline3';
    expect(removeEmptyLines(text)).toBe(text);
  });
});

describe('wrapText', () => {
  it('宽度足够时应保持原样', () => {
    const text = 'hello';
    expect(wrapText(text, 10)).toBe(text);
  });

  it('宽度较小时应换行', () => {
    const result = wrapText('hello', 2);
    expect(result).toContain('\n');
  });
});

describe('ensureNewline', () => {
  it('应在末尾追加换行', () => {
    expect(ensureNewline('line')).toBe('line\n');
  });

  it('已有换行时不应重复追加', () => {
    expect(ensureNewline('line\n')).toBe('line\n');
  });
});

describe('trimNewline', () => {
  it('应移除末尾换行', () => {
    expect(trimNewline('line\n')).toBe('line');
  });

  it('应移除多个末尾换行', () => {
    expect(trimNewline('line\n\n')).toBe('line');
  });
});

describe('escapeHtml', () => {
  it('应转义特殊字符', () => {
    const result = escapeHtml(`&<>"'`);
    expect(result).toBe('&amp;&lt;&gt;&quot;&#039;');
  });

  it('无特殊字符时保持原样', () => {
    expect(escapeHtml('plain text')).toBe('plain text');
  });
});

describe('detectLanguage', () => {
  it('应识别代码块语言', () => {
    expect(detectLanguage('```ts\nconst a = 1;\n```')).toBe('ts');
  });

  it('无语言标记时返回 undefined', () => {
    expect(detectLanguage('```\nconst a = 1;\n```')).toBeUndefined();
  });
});

describe('formatBytes', () => {
  it('应处理 0 字节', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('应格式化 KB/MB', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
  });

  it('应格式化 GB/TB', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1.00 TB');
  });
});

describe('pluralize', () => {
  it('单数应使用 singular', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('复数默认加 s', () => {
    expect(pluralize(2, 'item')).toBe('2 items');
  });

  it('复数支持自定义', () => {
    expect(pluralize(2, 'person', 'people')).toBe('2 people');
  });
});

describe('parseThinkingTags', () => {
  it('应解析 thinking 标签并保留文本', () => {
    const result = parseThinkingTags('Hello <thinking>foo</thinking> world');

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'text', content: 'Hello ' });
    expect(result[1]).toEqual({ type: 'thinking', content: 'foo' });
    expect(result[2]).toEqual({ type: 'text', content: ' world' });
  });

  it('应忽略空的 thinking 标签', () => {
    const result = parseThinkingTags('Start <thinking/> end');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'text', content: 'Start ' });
    expect(result[1]).toEqual({ type: 'text', content: ' end' });
  });

  it('无标签时返回原始文本', () => {
    const result = parseThinkingTags('just text');
    expect(result).toEqual([{ type: 'text', content: 'just text' }]);
  });

  it('支持自定义标签列表', () => {
    const result = parseThinkingTags('Hi <custom>ok</custom>!', ['custom']);

    expect(result).toHaveLength(3);
    expect(result[1]).toEqual({ type: 'thinking', content: 'ok' });
  });
});

describe('ensureNewline', () => {
  it('应该为没有换行符的文本添加换行符', () => {
    expect(ensureNewline('hello')).toBe('hello\n');
  });

  it('应该保留已有换行符的文本', () => {
    expect(ensureNewline('hello\n')).toBe('hello\n');
  });

  it('应该处理空字符串', () => {
    expect(ensureNewline('')).toBe('\n');
  });
});

describe('trimNewline', () => {
  it('应该移除尾部的单个换行符', () => {
    expect(trimNewline('hello\n')).toBe('hello');
  });

  it('应该移除尾部的多个换行符', () => {
    expect(trimNewline('hello\n\n\n')).toBe('hello');
  });

  it('应该保留没有尾部换行符的文本', () => {
    expect(trimNewline('hello')).toBe('hello');
  });

  it('应该保留中间的换行符', () => {
    expect(trimNewline('hello\nworld\n')).toBe('hello\nworld');
  });
});

describe('escapeHtml', () => {
  it('应该转义 HTML 特殊字符', () => {
    expect(escapeHtml('<div>Hello & "World"</div>')).toBe(
      '&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;'
    );
  });

  it('应该转义单引号', () => {
    expect(escapeHtml("It's")).toBe('It&#039;s');
  });

  it('应该处理没有特殊字符的文本', () => {
    expect(escapeHtml('plain text')).toBe('plain text');
  });

  it('应该处理空字符串', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('detectLanguage', () => {
  it('应该检测代码块的语言', () => {
    expect(detectLanguage('```javascript\ncode\n```')).toBe('javascript');
    expect(detectLanguage('```python\ncode\n```')).toBe('python');
    expect(detectLanguage('```typescript\ncode\n```')).toBe('typescript');
  });

  it('应该处理没有语言标记的代码块', () => {
    expect(detectLanguage('```\ncode\n```')).toBeUndefined();
  });

  it('应该处理非代码块文本', () => {
    expect(detectLanguage('plain text')).toBeUndefined();
  });
});

describe('formatBytes', () => {
  it('应该格式化字节为 B', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(100)).toBe('100.00 B');
  });

  it('应该格式化字节为 KB', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(2048)).toBe('2.00 KB');
  });

  it('应该格式化字节为 MB', () => {
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.00 MB');
  });

  it('应该格式化字节为 GB', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('应该格式化字节为 TB', () => {
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1.00 TB');
  });
});

describe('pluralize', () => {
  it('应该使用单数形式', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('应该使用复数形式（默认加 s）', () => {
    expect(pluralize(2, 'item')).toBe('2 items');
    expect(pluralize(0, 'item')).toBe('0 items');
  });

  it('应该支持自定义复数形式', () => {
    expect(pluralize(2, 'child', 'children')).toBe('2 children');
  });

  it('应该处理不规则复数', () => {
    expect(pluralize(3, 'person', 'people')).toBe('3 people');
  });
});

describe('parseThinkingTags', () => {
  it('应该解析 thinking 标签', () => {
    const text = 'Before <thinking>思考内容</thinking> After';
    const result = parseThinkingTags(text);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'text', content: 'Before ' });
    expect(result[1]).toEqual({ type: 'thinking', content: '思考内容' });
    expect(result[2]).toEqual({ type: 'text', content: ' After' });
  });

  it('应该解析 antml:thinking 标签', () => {
    const text = '<thinking>思考内容</thinking>';
    const result = parseThinkingTags(text);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: 'thinking', content: '思考内容' });
  });

  it('应该解析多个 thinking 标签', () => {
    const text = '<thinking>思考1</thinking> 文本 <thinking>思考2</thinking>';
    const result = parseThinkingTags(text);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'thinking', content: '思考1' });
    expect(result[1]).toEqual({ type: 'text', content: ' 文本 ' });
    expect(result[2]).toEqual({ type: 'thinking', content: '思考2' });
  });

  it('应该处理自闭合标签', () => {
    const text = 'Before <thinking/> After';
    const result = parseThinkingTags(text);

    // 自闭合标签没有内容，应该被忽略
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'text', content: 'Before ' });
    expect(result[1]).toEqual({ type: 'text', content: ' After' });
  });

  it('应该处理没有 thinking 标签的文本', () => {
    const text = 'Plain text without tags';
    const result = parseThinkingTags(text);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: 'text', content: text });
  });

  it('应该处理空字符串', () => {
    const result = parseThinkingTags('');
    expect(result).toHaveLength(0);
  });

  it('应该支持自定义标签', () => {
    const text = '<custom>内容</custom>';
    const result = parseThinkingTags(text, ['custom']);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: 'thinking', content: '内容' });
  });

  it('应该忽略空白的 thinking 内容', () => {
    const text = 'Before <thinking>   </thinking> After';
    const result = parseThinkingTags(text);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'text', content: 'Before ' });
    expect(result[1]).toEqual({ type: 'text', content: ' After' });
  });
});
