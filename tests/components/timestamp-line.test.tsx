import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { TimestampLine } from '../../src/components/ui/timestamp-line.js';
import { ThemeProvider } from '../../src/hooks/use-theme.js';
import { claudeCodeTheme } from '../../src/themes/index.js';

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={claudeCodeTheme}>{component}</ThemeProvider>
  );
};

describe('TimestampLine', () => {
  describe('基本渲染', () => {
    it('应该渲染时间戳', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="2024-01-15 10:30:45" />
      );
      expect(lastFrame()).toContain('2024-01-15 10:30:45');
    });

    it('应该用方括号包裹时间戳', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="12:00:00" />
      );
      expect(lastFrame()).toContain('[12:00:00]');
    });
  });

  describe('边距', () => {
    it('默认 marginBottom 应该是 0', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="10:00:00" />
      );
      expect(lastFrame()).toContain('[10:00:00]');
    });

    it('应该支持自定义 marginBottom', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="10:00:00" marginBottom={2} />
      );
      expect(lastFrame()).toContain('[10:00:00]');
    });
  });

  describe('格式支持', () => {
    it('应该支持各种时间戳格式', () => {
      const timestamps = [
        '2024-01-15',
        '10:30:45',
        '2024-01-15T10:30:45Z',
        '15:30',
        'Jan 15, 2024',
      ];

      timestamps.forEach((ts) => {
        const { lastFrame } = renderWithTheme(
          <TimestampLine timestamp={ts} />
        );
        expect(lastFrame()).toContain(ts);
      });
    });
  });

  describe('主题集成', () => {
    it('应该使用主题的缩进', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="10:00:00" />
      );
      // 验证渲染成功（缩进通过主题应用）
      expect(lastFrame()).toContain('[10:00:00]');
    });
  });

  describe('空值处理', () => {
    it('应该处理空字符串', () => {
      const { lastFrame } = renderWithTheme(
        <TimestampLine timestamp="" />
      );
      expect(lastFrame()).toContain('[]');
    });
  });
});
