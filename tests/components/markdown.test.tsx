import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Markdown } from '../../src/components/ui/markdown.js';

describe('Markdown', () => {
  describe('基本渲染', () => {
    it('应该渲染纯文本', () => {
      const { lastFrame } = render(<Markdown>Hello World</Markdown>);
      expect(lastFrame()).toContain('Hello World');
    });

    it('应该渲染加粗文本', () => {
      const { lastFrame } = render(<Markdown>**bold**</Markdown>);
      expect(lastFrame()).toBeDefined();
    });

    it('应该渲染斜体文本', () => {
      const { lastFrame } = render(<Markdown>*italic*</Markdown>);
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('空内容处理', () => {
    it('空字符串应该返回 null', () => {
      const { lastFrame } = render(<Markdown>{''}</Markdown>);
      expect(lastFrame()).toBe('');
    });

    it('仅空白字符应该返回 null', () => {
      const { lastFrame } = render(<Markdown>{'   '}</Markdown>);
      expect(lastFrame()).toBe('');
    });
  });

  describe('代码渲染', () => {
    it('应该渲染内联代码', () => {
      const { lastFrame } = render(<Markdown>`code`</Markdown>);
      expect(lastFrame()).toContain('code');
    });

    it('应该渲染代码块', () => {
      const markdown = '```\ncode block\n```';
      const { lastFrame } = render(<Markdown>{markdown}</Markdown>);
      expect(lastFrame()).toContain('code block');
    });

    it('禁用代码高亮时应该使用纯文本', () => {
      const markdown = '```\nplain code\n```';
      const { lastFrame } = render(
        <Markdown highlightCode={false}>{markdown}</Markdown>
      );
      expect(lastFrame()).toContain('plain code');
    });
  });

  describe('列表渲染', () => {
    it('应该渲染无序列表', () => {
      const markdown = '- item 1\n- item 2';
      const { lastFrame } = render(<Markdown>{markdown}</Markdown>);
      expect(lastFrame()).toContain('item 1');
      expect(lastFrame()).toContain('item 2');
    });

    it('应该渲染有序列表', () => {
      const markdown = '1. first\n2. second';
      const { lastFrame } = render(<Markdown>{markdown}</Markdown>);
      expect(lastFrame()).toContain('first');
      expect(lastFrame()).toContain('second');
    });
  });

  describe('标题渲染', () => {
    it('应该渲染 h1 标题', () => {
      const { lastFrame } = render(<Markdown># Heading 1</Markdown>);
      expect(lastFrame()).toContain('Heading 1');
    });

    it('应该渲染 h2 标题', () => {
      const { lastFrame } = render(<Markdown>## Heading 2</Markdown>);
      expect(lastFrame()).toContain('Heading 2');
    });
  });

  describe('宽度控制', () => {
    it('应该支持 maxWidth 属性', () => {
      const longText = 'A'.repeat(200);
      const { lastFrame } = render(
        <Markdown maxWidth={50}>{longText}</Markdown>
      );
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('主题支持', () => {
    it('应该接受 theme 属性', () => {
      const mockTheme = {
        name: 'test',
        colors: {
          primary: 'blue',
          secondary: 'gray',
          success: 'green',
          error: 'red',
          warning: 'yellow',
          info: 'cyan',
          text: 'white',
          dim: 'gray',
          muted: 'darkgray',
        },
        symbols: {
          success: '✓',
          error: '✗',
          warning: '⚠',
          info: 'ℹ',
          arrow: '→',
          bullet: '•',
          spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        },
        layout: {
          indent: 2,
          maxWidth: 120,
        },
        components: {},
      };

      const { lastFrame } = render(
        <Markdown theme={mockTheme}>Themed content</Markdown>
      );
      expect(lastFrame()).toContain('Themed content');
    });
  });

  describe('链接渲染', () => {
    it('应该渲染链接', () => {
      const { lastFrame } = render(
        <Markdown>[link](https://example.com)</Markdown>
      );
      expect(lastFrame()).toContain('link');
    });
  });

  describe('引用块', () => {
    it('应该渲染引用块', () => {
      const { lastFrame } = render(<Markdown>{'> quote text'}</Markdown>);
      expect(lastFrame()).toContain('quote text');
    });
  });

  describe('组合内容', () => {
    it('应该渲染复杂的 Markdown', () => {
      const markdown = `
# Title

This is **bold** and *italic*.

- Item 1
- Item 2

\`inline code\`
      `;
      const { lastFrame } = render(<Markdown>{markdown}</Markdown>);
      expect(lastFrame()).toContain('Title');
      expect(lastFrame()).toContain('Item 1');
    });
  });
});
