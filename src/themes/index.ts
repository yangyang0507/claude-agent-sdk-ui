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

const REQUIRED_COLOR_KEYS: Array<keyof Theme['colors']> = [
  'primary',
  'secondary',
  'success',
  'error',
  'warning',
  'info',
  'text',
  'dim',
];

const REQUIRED_SYMBOL_KEYS: Array<keyof Theme['symbols']> = [
  'success',
  'error',
  'warning',
  'info',
  'pending',
  'spinner',
  'bullet',
  'arrow',
];

const REQUIRED_COMPONENT_KEYS: Array<keyof Theme['components']> = [
  'assistantMessage',
  'streamingAssistantMessage',
  'toolResultMessage',
  'systemMessage',
  'finalResult',
];

let hasWarnedAboutInvalidTheme = false;

export interface ThemeValidationResult {
  valid: boolean;
  missing: string[];
}

export function validateTheme(theme: Theme): ThemeValidationResult {
  const missing: string[] = [];

  if (!theme.colors) {
    missing.push('colors');
  } else {
    for (const key of REQUIRED_COLOR_KEYS) {
      if (!theme.colors[key]) {
        missing.push(`colors.${key}`);
      }
    }
  }

  if (!theme.symbols) {
    missing.push('symbols');
  } else {
    for (const key of REQUIRED_SYMBOL_KEYS) {
      const value = theme.symbols[key];
      if (key === 'spinner') {
        if (!Array.isArray(value) || value.length === 0) {
          missing.push('symbols.spinner');
        }
      } else if (!value) {
        missing.push(`symbols.${key}`);
      }
    }
  }

  if (!theme.borders) {
    missing.push('borders');
  } else {
    if (!theme.borders.style) missing.push('borders.style');
    if (!theme.borders.color) missing.push('borders.color');
  }

  if (!theme.layout) {
    missing.push('layout');
  } else {
    if (theme.layout.indent === undefined) missing.push('layout.indent');
    if (theme.layout.lineSpacing === undefined) missing.push('layout.lineSpacing');
  }

  if (!theme.components) {
    missing.push('components');
  } else {
    for (const key of REQUIRED_COMPONENT_KEYS) {
      const value = theme.components[key];
      if (typeof value !== 'function') {
        missing.push(`components.${key}`);
      }
    }
  }

  return { valid: missing.length === 0, missing };
}

export const MINIMAL_THEME_TEMPLATE: Theme = {
  name: 'custom-theme',
  colors: {
    primary: '#000000',
    secondary: '#333333',
    success: '#00AA00',
    error: '#CC0000',
    warning: '#CC8800',
    info: '#0066CC',
    text: '#000000',
    dim: '#777777',
  },
  symbols: {
    success: '✓',
    error: '✗',
    warning: '!',
    info: 'i',
    pending: '○',
    spinner: ['-'],
    bullet: '•',
    arrow: '→',
  },
  borders: {
    style: 'single',
    color: '#777777',
  },
  layout: {
    indent: 2,
    lineSpacing: 1,
  },
  components: {
    assistantMessage: () => null,
    streamingAssistantMessage: () => null,
    toolResultMessage: () => null,
    systemMessage: () => null,
    finalResult: () => null,
  },
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

  if (process.env.NODE_ENV === 'development') {
    const validation = validateTheme(input);
    if (!validation.valid && !hasWarnedAboutInvalidTheme) {
      console.warn(
        `[claude-agent-sdk-ui] Theme is missing required fields: ${validation.missing.join(
          ', '
        )}`
      );
      hasWarnedAboutInvalidTheme = true;
    }
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
