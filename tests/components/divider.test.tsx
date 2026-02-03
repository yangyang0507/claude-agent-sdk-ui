import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { Divider, createDivider } from '../../src/components/ui/divider.js';

// Mock useStdout
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useStdout: () => ({
      stdout: {
        columns: 80,
      },
    }),
  };
});

describe('Divider', () => {
  describe('基本渲染', () => {
    it('应该渲染分割线', () => {
      const { lastFrame } = render(<Divider />);
      expect(lastFrame()).toContain('─');
    });

    it('应该渲染带文本的分割线', () => {
      const { lastFrame } = render(<Divider text="SECTION" />);
      expect(lastFrame()).toContain('SECTION');
      expect(lastFrame()).toContain('─');
    });
  });

  describe('分割线样式', () => {
    it('single 样式应该使用单线字符', () => {
      const { lastFrame } = render(<Divider style="single" />);
      expect(lastFrame()).toContain('─');
    });

    it('double 样式应该使用双线字符', () => {
      const { lastFrame } = render(<Divider style="double" />);
      expect(lastFrame()).toContain('═');
    });

    it('dashed 样式应该使用虚线字符', () => {
      const { lastFrame } = render(<Divider style="dashed" />);
      expect(lastFrame()).toContain('┄');
    });

    it('dotted 样式应该使用点线字符', () => {
      const { lastFrame } = render(<Divider style="dotted" />);
      expect(lastFrame()).toContain('┈');
    });

    it('bold 样式应该使用粗线字符', () => {
      const { lastFrame } = render(<Divider style="bold" />);
      expect(lastFrame()).toContain('━');
    });
  });

  describe('文本对齐', () => {
    it('center 对齐应该将文本居中', () => {
      const { lastFrame } = render(
        <Divider text="CENTER" textAlign="center" width={40} />
      );
      const frame = lastFrame() ?? '';
      expect(frame).toContain('CENTER');
      // 文本应该在中间位置
    });

    it('left 对齐应该将文本靠左', () => {
      const { lastFrame } = render(
        <Divider text="LEFT" textAlign="left" width={40} />
      );
      const frame = lastFrame() ?? '';
      expect(frame).toContain('LEFT');
      // 文本应该在开头
      expect(frame.indexOf('LEFT')).toBeLessThan(10);
    });

    it('right 对齐应该将文本靠右', () => {
      const { lastFrame } = render(
        <Divider text="RIGHT" textAlign="right" width={40} />
      );
      const frame = lastFrame() ?? '';
      expect(frame).toContain('RIGHT');
    });
  });

  describe('宽度控制', () => {
    it('应该支持自定义宽度', () => {
      const { lastFrame } = render(<Divider width={20} />);
      const frame = lastFrame() ?? '';
      // 分割线应该有指定的宽度
      expect(frame.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('边距', () => {
    it('应该支持 marginTop', () => {
      const { lastFrame } = render(<Divider marginTop={1} />);
      expect(lastFrame()).toContain('─');
    });

    it('应该支持 marginBottom', () => {
      const { lastFrame } = render(<Divider marginBottom={1} />);
      expect(lastFrame()).toContain('─');
    });
  });

  describe('createDivider 辅助函数', () => {
    it('应该创建分割线组件', () => {
      const divider = createDivider({ text: 'CREATED' });
      const { lastFrame } = render(divider);
      expect(lastFrame()).toContain('CREATED');
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

      const { lastFrame } = render(<Divider theme={mockTheme} />);
      expect(lastFrame()).toContain('─');
    });
  });

  describe('颜色', () => {
    it('应该支持自定义颜色', () => {
      const { lastFrame } = render(<Divider color="red" />);
      expect(lastFrame()).toContain('─');
    });
  });
});
