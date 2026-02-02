import { describe, it, expect } from 'vitest';
import {
  getTheme,
  createTheme,
  isBuiltInTheme,
  claudeCodeTheme,
  droidTheme,
} from '../../src/themes/index.js';
import type { Theme } from '../../src/types/theme.js';

describe('getTheme', () => {
  it('应该返回默认主题（claude-code）当没有输入时', () => {
    const theme = getTheme();
    expect(theme).toBe(claudeCodeTheme);
    expect(theme.name).toBe('claude-code');
  });

  it('应该通过名称获取 claude-code 主题', () => {
    const theme = getTheme('claude-code');
    expect(theme).toBe(claudeCodeTheme);
    expect(theme.name).toBe('claude-code');
  });

  it('应该通过名称获取 droid 主题', () => {
    const theme = getTheme('droid');
    expect(theme).toBe(droidTheme);
    expect(theme.name).toBe('droid');
  });

  it('应该在主题名称无效时返回默认主题', () => {
    const theme = getTheme('invalid-theme' as any);
    expect(theme).toBe(claudeCodeTheme);
  });

  it('应该直接返回传入的主题对象', () => {
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

    const theme = getTheme(customTheme);
    expect(theme).toBe(customTheme);
    expect(theme.name).toBe('custom');
  });
});

describe('createTheme', () => {
  it('应该创建自定义主题并继承默认值', () => {
    const customTheme = createTheme({
      name: 'my-theme',
      colors: {
        primary: '#FF0000',
      } as any,
    });

    expect(customTheme.name).toBe('my-theme');
    expect(customTheme.colors.primary).toBe('#FF0000');
    expect(customTheme.colors.secondary).toBe(claudeCodeTheme.colors.secondary);
    expect(customTheme.symbols).toEqual(claudeCodeTheme.symbols);
    expect(customTheme.borders).toEqual(claudeCodeTheme.borders);
    expect(customTheme.layout).toEqual(claudeCodeTheme.layout);
  });

  it('应该允许覆盖颜色配置', () => {
    const customTheme = createTheme({
      name: 'custom-colors',
      colors: {
        primary: '#FF0000',
        success: '#00FF00',
        error: '#0000FF',
      } as any,
    });

    expect(customTheme.colors.primary).toBe('#FF0000');
    expect(customTheme.colors.success).toBe('#00FF00');
    expect(customTheme.colors.error).toBe('#0000FF');
    expect(customTheme.colors.text).toBe(claudeCodeTheme.colors.text);
  });

  it('应该允许覆盖符号配置', () => {
    const customTheme = createTheme({
      name: 'custom-symbols',
      symbols: {
        success: '✅',
        error: '❌',
      } as any,
    });

    expect(customTheme.symbols.success).toBe('✅');
    expect(customTheme.symbols.error).toBe('❌');
    expect(customTheme.symbols.warning).toBe(claudeCodeTheme.symbols.warning);
    expect(customTheme.symbols.spinner).toEqual(claudeCodeTheme.symbols.spinner);
  });

  it('应该允许覆盖边框配置', () => {
    const customTheme = createTheme({
      name: 'custom-borders',
      borders: {
        style: 'double',
        color: '#FF0000',
      },
    });

    expect(customTheme.borders.style).toBe('double');
    expect(customTheme.borders.color).toBe('#FF0000');
  });

  it('应该允许覆盖布局配置', () => {
    const customTheme = createTheme({
      name: 'custom-layout',
      layout: {
        indent: 4,
        maxWidth: 80,
      } as any,
    });

    expect(customTheme.layout.indent).toBe(4);
    expect(customTheme.layout.maxWidth).toBe(80);
    expect(customTheme.layout.lineSpacing).toBe(claudeCodeTheme.layout.lineSpacing);
  });

  it('应该允许部分覆盖配置', () => {
    const customTheme = createTheme({
      name: 'partial-override',
      colors: {
        primary: '#123456',
      } as any,
      symbols: {
        bullet: '▪',
      } as any,
    });

    expect(customTheme.colors.primary).toBe('#123456');
    expect(customTheme.colors.secondary).toBe(claudeCodeTheme.colors.secondary);
    expect(customTheme.symbols.bullet).toBe('▪');
    expect(customTheme.symbols.arrow).toBe(claudeCodeTheme.symbols.arrow);
  });

  it('应该创建完全自定义的主题', () => {
    const customTheme = createTheme({
      name: 'fully-custom',
      colors: {
        primary: '#111111',
        secondary: '#222222',
        success: '#333333',
        error: '#444444',
        warning: '#555555',
        info: '#666666',
        text: '#777777',
        dim: '#888888',
        background: '#999999',
        highlight: '#AAAAAA',
      },
      symbols: {
        success: 'S',
        error: 'E',
        warning: 'W',
        info: 'I',
        pending: 'P',
        spinner: ['1', '2', '3'],
        bullet: 'B',
        arrow: 'A',
        thinking: 'T',
        tool: 'O',
      },
      borders: {
        style: 'bold',
        color: '#BBBBBB',
      },
      layout: {
        indent: 8,
        lineSpacing: 2,
        componentSpacing: 3,
        maxWidth: 150,
      },
    });

    expect(customTheme.name).toBe('fully-custom');
    expect(customTheme.colors.primary).toBe('#111111');
    expect(customTheme.symbols.success).toBe('S');
    expect(customTheme.borders.style).toBe('bold');
    expect(customTheme.layout.indent).toBe(8);
  });
});

describe('isBuiltInTheme', () => {
  it('应该识别 claude-code 为内置主题', () => {
    expect(isBuiltInTheme('claude-code')).toBe(true);
  });

  it('应该识别 droid 为内置主题', () => {
    expect(isBuiltInTheme('droid')).toBe(true);
  });

  it('应该拒绝非内置主题名称', () => {
    expect(isBuiltInTheme('custom')).toBe(false);
    expect(isBuiltInTheme('invalid')).toBe(false);
    expect(isBuiltInTheme('')).toBe(false);
  });
});

describe('claudeCodeTheme', () => {
  it('应该有正确的名称', () => {
    expect(claudeCodeTheme.name).toBe('claude-code');
  });

  it('应该包含所有必需的颜色', () => {
    expect(claudeCodeTheme.colors).toHaveProperty('primary');
    expect(claudeCodeTheme.colors).toHaveProperty('secondary');
    expect(claudeCodeTheme.colors).toHaveProperty('success');
    expect(claudeCodeTheme.colors).toHaveProperty('error');
    expect(claudeCodeTheme.colors).toHaveProperty('warning');
    expect(claudeCodeTheme.colors).toHaveProperty('info');
    expect(claudeCodeTheme.colors).toHaveProperty('text');
    expect(claudeCodeTheme.colors).toHaveProperty('dim');
  });

  it('应该包含所有必需的符号', () => {
    expect(claudeCodeTheme.symbols).toHaveProperty('success');
    expect(claudeCodeTheme.symbols).toHaveProperty('error');
    expect(claudeCodeTheme.symbols).toHaveProperty('warning');
    expect(claudeCodeTheme.symbols).toHaveProperty('info');
    expect(claudeCodeTheme.symbols).toHaveProperty('pending');
    expect(claudeCodeTheme.symbols).toHaveProperty('spinner');
    expect(claudeCodeTheme.symbols).toHaveProperty('bullet');
    expect(claudeCodeTheme.symbols).toHaveProperty('arrow');
  });

  it('应该有 spinner 动画帧', () => {
    expect(Array.isArray(claudeCodeTheme.symbols.spinner)).toBe(true);
    expect(claudeCodeTheme.symbols.spinner.length).toBeGreaterThan(0);
  });

  it('应该有边框配置', () => {
    expect(claudeCodeTheme.borders).toHaveProperty('style');
    expect(claudeCodeTheme.borders).toHaveProperty('color');
  });

  it('应该有布局配置', () => {
    expect(claudeCodeTheme.layout).toHaveProperty('indent');
    expect(claudeCodeTheme.layout).toHaveProperty('lineSpacing');
  });
});

describe('droidTheme', () => {
  it('应该有正确的名称', () => {
    expect(droidTheme.name).toBe('droid');
  });

  it('应该包含所有必需的颜色', () => {
    expect(droidTheme.colors).toHaveProperty('primary');
    expect(droidTheme.colors).toHaveProperty('secondary');
    expect(droidTheme.colors).toHaveProperty('success');
    expect(droidTheme.colors).toHaveProperty('error');
    expect(droidTheme.colors).toHaveProperty('warning');
    expect(droidTheme.colors).toHaveProperty('info');
    expect(droidTheme.colors).toHaveProperty('text');
    expect(droidTheme.colors).toHaveProperty('dim');
  });

  it('应该包含所有必需的符号', () => {
    expect(droidTheme.symbols).toHaveProperty('success');
    expect(droidTheme.symbols).toHaveProperty('error');
    expect(droidTheme.symbols).toHaveProperty('warning');
    expect(droidTheme.symbols).toHaveProperty('info');
    expect(droidTheme.symbols).toHaveProperty('pending');
    expect(droidTheme.symbols).toHaveProperty('spinner');
    expect(droidTheme.symbols).toHaveProperty('bullet');
    expect(droidTheme.symbols).toHaveProperty('arrow');
  });

  it('应该有不同于 claude-code 的配色', () => {
    expect(droidTheme.colors.primary).not.toBe(claudeCodeTheme.colors.primary);
  });

  it('应该有不同于 claude-code 的符号', () => {
    expect(droidTheme.symbols.success).not.toBe(claudeCodeTheme.symbols.success);
  });
});
