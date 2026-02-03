import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { ThemeProvider, useTheme, useThemedColor } from '../../src/hooks/use-theme.js';
import { claudeCodeTheme, droidTheme } from '../../src/themes/index.js';
import type { Theme } from '../../src/types/theme.js';

const TestComponent: React.FC = () => {
  const theme = useTheme();
  return <Text>{theme.name}</Text>;
};

const TestColorComponent: React.FC = () => {
  const getColor = useThemedColor();
  return <Text>{getColor('primary')}</Text>;
};

describe('ThemeProvider', () => {
  it('应该提供默认主题（claude-code）', () => {
    const { lastFrame } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('claude-code');
  });

  it('应该通过名称提供 claude-code 主题', () => {
    const { lastFrame } = render(
      <ThemeProvider theme="claude-code">
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('claude-code');
  });

  it('应该通过名称提供 droid 主题', () => {
    const { lastFrame } = render(
      <ThemeProvider theme="droid">
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('droid');
  });

  it('应该在主题名称无效时回退到默认主题', () => {
    const { lastFrame } = render(
      <ThemeProvider theme={'invalid' as any}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('claude-code');
  });

  it('应该提供自定义主题对象', () => {
    const customTheme: Theme = {
      name: 'custom',
      colors: {
        primary: '#FF0000',
        secondary: '#00FF00',
        success: '#00FF00',
        error: '#FF0000',
        warning: '#FFFF00',
        info: '#0000FF',
        text: '#FFFFFF',
        dim: '#888888',
      },
      symbols: {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ',
        pending: '○',
        spinner: ['⠋', '⠙'],
        bullet: '•',
        arrow: '→',
      },
      borders: {
        style: 'single',
        color: '#888888',
      },
      layout: {
        indent: 2,
        lineSpacing: 1,
      },
    };

    const { lastFrame } = render(
      <ThemeProvider theme={customTheme}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('custom');
  });

  it('应该允许嵌套的组件访问主题', () => {
    const NestedComponent: React.FC = () => {
      const theme = useTheme();
      return <Text>{theme.colors.primary}</Text>;
    };

    const { lastFrame } = render(
      <ThemeProvider theme="claude-code">
        <NestedComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe(claudeCodeTheme.colors.primary);
  });
});

describe('useTheme', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('应该返回 Provider 提供的主题', () => {
    const { lastFrame } = render(
      <ThemeProvider theme="droid">
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('droid');
  });

  it('应该在没有 Provider 时返回默认主题', () => {
    const { lastFrame } = render(<TestComponent />);

    expect(lastFrame()).toBe('claude-code');
  });

  it('应该在没有 Provider 时发出警告（开发环境）', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<TestComponent />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('useTheme was called outside of ThemeProvider')
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('应该在生产环境不发出警告', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<TestComponent />);

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('应该返回完整的主题对象', () => {
    let capturedTheme: Theme | null = null;

    const CaptureThemeComponent: React.FC = () => {
      const theme = useTheme();
      capturedTheme = theme;
      return <Text>test</Text>;
    };

    render(
      <ThemeProvider theme="claude-code">
        <CaptureThemeComponent />
      </ThemeProvider>
    );

    expect(capturedTheme).not.toBeNull();
    expect(capturedTheme!.name).toBe('claude-code');
    expect(capturedTheme!.colors).toBeDefined();
    expect(capturedTheme!.symbols).toBeDefined();
    expect(capturedTheme!.borders).toBeDefined();
    expect(capturedTheme!.layout).toBeDefined();
  });
});

describe('useThemedColor', () => {
  it('应该返回主题颜色', () => {
    const { lastFrame } = render(
      <ThemeProvider theme="claude-code">
        <TestColorComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe(claudeCodeTheme.colors.primary);
  });

  it('应该返回不同主题的颜色', () => {
    const { lastFrame } = render(
      <ThemeProvider theme="droid">
        <TestColorComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe(droidTheme.colors.primary);
  });

  it('应该能够获取不同的颜色键', () => {
    const TestMultiColorComponent: React.FC = () => {
      const getColor = useThemedColor();
      return (
        <Text>
          {getColor('primary')},{getColor('success')},{getColor('error')}
        </Text>
      );
    };

    const { lastFrame } = render(
      <ThemeProvider theme="claude-code">
        <TestMultiColorComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toContain(claudeCodeTheme.colors.primary);
    expect(lastFrame()).toContain(claudeCodeTheme.colors.success);
    expect(lastFrame()).toContain(claudeCodeTheme.colors.error);
  });

  it('应该在没有 Provider 时使用默认主题颜色', () => {
    const { lastFrame } = render(<TestColorComponent />);

    expect(lastFrame()).toBe(claudeCodeTheme.colors.primary);
  });
});

describe('主题切换', () => {
  it('应该支持动态切换主题', () => {
    const { lastFrame, rerender } = render(
      <ThemeProvider theme="claude-code">
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('claude-code');

    rerender(
      <ThemeProvider theme="droid">
        <TestComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe('droid');
  });

  it('应该在主题切换后更新颜色', () => {
    const { lastFrame, rerender } = render(
      <ThemeProvider theme="claude-code">
        <TestColorComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe(claudeCodeTheme.colors.primary);

    rerender(
      <ThemeProvider theme="droid">
        <TestColorComponent />
      </ThemeProvider>
    );

    expect(lastFrame()).toBe(droidTheme.colors.primary);
  });
});

describe('useTheme 警告行为', () => {
  it('开发环境下只应警告一次', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    vi.resetModules();

    const React = await import('react');
    const { render } = await import('ink-testing-library');
    const { Text } = await import('ink');
    const { useTheme } = await import('../../src/hooks/use-theme.js');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const WarnComponent: React.FC = () => {
      useTheme();
      return <Text>ok</Text>;
    };

    render(<WarnComponent />);
    render(<WarnComponent />);

    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
