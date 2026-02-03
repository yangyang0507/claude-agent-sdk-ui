import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { ProgressBar, createProgressBar } from '../../src/components/ui/progress-bar.js';

describe('ProgressBar', () => {
  describe('基本渲染', () => {
    it('应该渲染进度条', () => {
      const { lastFrame } = render(<ProgressBar percent={50} />);
      expect(lastFrame()).toBeDefined();
      expect(lastFrame()).toContain('█');
      expect(lastFrame()).toContain('░');
    });

    it('应该根据百分比显示进度', () => {
      const { lastFrame } = render(<ProgressBar percent={100} width={10} />);
      const frame = lastFrame() ?? '';
      // 100% 时应该全是填充字符
      expect(frame.match(/█/g)?.length).toBe(10);
    });

    it('0% 时应该全是空白字符', () => {
      const { lastFrame } = render(<ProgressBar percent={0} width={10} />);
      const frame = lastFrame() ?? '';
      expect(frame.match(/░/g)?.length).toBe(10);
    });
  });

  describe('百分比显示', () => {
    it('showPercent 为 true 时应该显示百分比', () => {
      const { lastFrame } = render(
        <ProgressBar percent={75} showPercent={true} />
      );
      expect(lastFrame()).toContain('75%');
    });

    it('showPercent 为 false 时不应该显示百分比', () => {
      const { lastFrame } = render(
        <ProgressBar percent={75} showPercent={false} />
      );
      expect(lastFrame()).not.toContain('%');
    });
  });

  describe('标签显示', () => {
    it('应该显示标签', () => {
      const { lastFrame } = render(
        <ProgressBar percent={50} label="Loading" />
      );
      expect(lastFrame()).toContain('Loading');
    });
  });

  describe('宽度控制', () => {
    it('应该支持自定义宽度', () => {
      const { lastFrame } = render(<ProgressBar percent={50} width={30} />);
      const frame = lastFrame() ?? '';
      const totalChars = (frame.match(/[█░]/g) || []).length;
      expect(totalChars).toBe(30);
    });
  });

  describe('样式', () => {
    it('minimal 样式应该使用不同字符', () => {
      const { lastFrame } = render(
        <ProgressBar percent={50} style="minimal" />
      );
      expect(lastFrame()).toContain('━');
      expect(lastFrame()).toContain('─');
    });

    it('blocks 样式应该使用方块字符', () => {
      const { lastFrame } = render(
        <ProgressBar percent={50} style="blocks" />
      );
      expect(lastFrame()).toContain('▓');
    });

    it('dots 样式应该使用圆点字符', () => {
      const { lastFrame } = render(
        <ProgressBar percent={50} style="dots" />
      );
      expect(lastFrame()).toContain('●');
      expect(lastFrame()).toContain('○');
    });
  });

  describe('边界值处理', () => {
    it('应该处理超过 100 的值', () => {
      const { lastFrame } = render(<ProgressBar percent={150} width={10} />);
      const frame = lastFrame() ?? '';
      expect(frame.match(/█/g)?.length).toBe(10);
    });

    it('应该处理负值', () => {
      const { lastFrame } = render(<ProgressBar percent={-50} width={10} />);
      const frame = lastFrame() ?? '';
      expect(frame.match(/░/g)?.length).toBe(10);
    });
  });

  describe('createProgressBar 辅助函数', () => {
    it('应该创建进度条组件', () => {
      const progressBar = createProgressBar({ percent: 60 });
      const { lastFrame } = render(progressBar);
      expect(lastFrame()).toContain('█');
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
        <ProgressBar percent={50} theme={mockTheme} />
      );
      expect(lastFrame()).toBeDefined();
    });
  });
});
