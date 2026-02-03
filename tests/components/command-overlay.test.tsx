import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { CommandOverlay } from '../../src/components/ui/command-overlay.js';
import { ThemeProvider } from '../../src/hooks/use-theme.js';
import { claudeCodeTheme } from '../../src/themes/index.js';

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={claudeCodeTheme}>{component}</ThemeProvider>
  );
};

describe('CommandOverlay', () => {
  describe('基本渲染', () => {
    it('所有状态都为 false/null 时不应该渲染任何内容', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={false}
          showHelp={false}
          feedback={null}
        />
      );
      expect(lastFrame()).toBe('');
    });
  });

  describe('命令模式', () => {
    it('命令模式激活时应该显示提示', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={false}
          feedback={null}
        />
      );
      expect(lastFrame()).toContain('Command mode');
    });

    it('应该显示默认的 leader key', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={false}
          feedback={null}
        />
      );
      expect(lastFrame()).toContain('\\');
    });

    it('应该支持自定义 leader key', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={false}
          feedback={null}
          leaderKey=":"
        />
      );
      expect(lastFrame()).toContain(':');
    });
  });

  describe('帮助显示', () => {
    it('showHelp 为 true 时应该显示命令列表', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={false}
          showHelp={true}
          feedback={null}
        />
      );
      expect(lastFrame()).toContain('Commands');
      expect(lastFrame()).toContain('Thinking');
      expect(lastFrame()).toContain('Tool details');
    });

    it('应该显示所有命令提示', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={false}
          showHelp={true}
          feedback={null}
        />
      );
      // 验证部分命令提示
      expect(lastFrame()).toContain('t');
      expect(lastFrame()).toContain('d');
      expect(lastFrame()).toContain('?');
    });
  });

  describe('反馈显示', () => {
    it('应该显示反馈消息', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={false}
          showHelp={false}
          feedback="Thinking: ON"
        />
      );
      expect(lastFrame()).toContain('Thinking: ON');
    });

    it('feedback 为 null 时不应该显示反馈', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={false}
          showHelp={false}
          feedback={null}
        />
      );
      expect(lastFrame()).toBe('');
    });
  });

  describe('组合状态', () => {
    it('命令模式和帮助同时显示', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={true}
          feedback={null}
        />
      );
      expect(lastFrame()).toContain('Command mode');
      expect(lastFrame()).toContain('Commands');
    });

    it('命令模式和反馈同时显示', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={false}
          feedback="Test feedback"
        />
      );
      expect(lastFrame()).toContain('Command mode');
      expect(lastFrame()).toContain('Test feedback');
    });

    it('所有状态同时激活', () => {
      const { lastFrame } = renderWithTheme(
        <CommandOverlay
          commandMode={true}
          showHelp={true}
          feedback="All active"
        />
      );
      expect(lastFrame()).toContain('Command mode');
      expect(lastFrame()).toContain('Commands');
      expect(lastFrame()).toContain('All active');
    });
  });
});
