/**
 * 主题系统导出
 */

import type { Theme, ThemeOptions, ThemeInput, BuiltInTheme } from '../types/theme.js';
import { darkTheme } from './dark.js';
import { lightTheme } from './light.js';
import { claudeCodeTheme } from './claude-code.js';
import { droidTheme } from './droid.js';

/**
 * 内置主题映射
 */
const builtInThemes: Record<BuiltInTheme, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  'claude-code': claudeCodeTheme,
  droid: droidTheme,
};

/**
 * 获取主题
 * @param input - 主题名称或主题对象
 * @returns 主题对象
 */
export function getTheme(input?: ThemeInput): Theme {
  if (!input) {
    return darkTheme; // 默认深色主题
  }

  if (typeof input === 'string') {
    return builtInThemes[input] || darkTheme;
  }

  return input;
}

/**
 * 创建自定义主题
 * @param options - 主题选项(部分配置会从默认主题继承)
 * @returns 完整的主题对象
 */
export function createTheme(options: ThemeOptions): Theme {
  const baseTheme = darkTheme;

  return {
    name: options.name,
    colors: {
      ...baseTheme.colors,
      ...options.colors,
    },
    symbols: {
      ...baseTheme.symbols,
      ...options.symbols,
    },
    borders: {
      ...baseTheme.borders,
      ...options.borders,
    },
    layout: {
      ...baseTheme.layout,
      ...options.layout,
    },
  };
}

/**
 * 检查是否为内置主题
 */
export function isBuiltInTheme(name: string): name is BuiltInTheme {
  return name === 'dark' || name === 'light' || name === 'claude-code' || name === 'droid';
}

// 导出内置主题
export { darkTheme, lightTheme, claudeCodeTheme, droidTheme };

// 导出主题类型
export type { Theme, ThemeOptions, ThemeInput, BuiltInTheme };
