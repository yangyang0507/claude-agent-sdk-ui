/**
 * 主题系统导出
 */

import type { Theme, ThemeOptions, ThemeInput, BuiltInTheme } from '../types/theme.js';
import { claudeCodeTheme } from './claude-code/config.js';
import { droidTheme } from './droid/config.js';

/**
 * 内置主题映射
 */
const builtInThemes: Record<BuiltInTheme, Theme> = {
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
    return claudeCodeTheme; // 默认 claude-code 主题
  }

  if (typeof input === 'string') {
    return builtInThemes[input] || claudeCodeTheme;
  }

  return input;
}

/**
 * 创建自定义主题
 * @param options - 主题选项(部分配置会从默认主题继承)
 * @returns 完整的主题对象
 * 
 * 注意：必须提供 components 字段，可以复用现有主题的组件
 */
export function createTheme(options: ThemeOptions & { components: Theme['components'] }): Theme {
  const baseTheme = claudeCodeTheme;

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
    components: options.components,
  };
}

/**
 * 检查是否为内置主题
 */
export function isBuiltInTheme(name: string): name is BuiltInTheme {
  return name === 'claude-code' || name === 'droid';
}

// 导出内置主题
export { claudeCodeTheme, droidTheme };

// 导出主题类型
export type { Theme, ThemeOptions, ThemeInput, BuiltInTheme };
