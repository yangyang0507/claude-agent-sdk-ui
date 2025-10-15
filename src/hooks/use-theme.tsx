/**
 * Theme Hooks - React Context for Theme
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import type { Theme, BuiltInTheme } from '../types/theme.js';
import { getTheme } from '../themes/index.js';

/**
 * Theme Context
 */
const ThemeContext = createContext<Theme | null>(null);

/**
 * Theme Provider Props
 */
export interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme | BuiltInTheme;
}

/**
 * Theme Provider Component
 *
 * @example
 * ```tsx
 * <ThemeProvider theme="dark">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme = 'claude-code' }) => {
  const resolvedTheme = typeof theme === 'string' ? getTheme(theme) : theme;

  return <ThemeContext.Provider value={resolvedTheme}>{children}</ThemeContext.Provider>;
};

/**
 * useTheme Hook
 *
 * 获取当前主题
 *
 * @example
 * ```tsx
 * const theme = useTheme();
 * <Text color={theme.colors.primary}>Hello</Text>
 * ```
 */
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    // 如果没有 Provider，返回默认主题
    return getTheme('claude-code');
  }

  return theme;
};

/**
 * useThemedColor Hook
 *
 * 获取主题颜色的快捷方式
 *
 * @example
 * ```tsx
 * const getColor = useThemedColor();
 * <Text color={getColor('primary')}>Hello</Text>
 * ```
 */
export const useThemedColor = () => {
  const theme = useTheme();

  return (colorKey: keyof Theme['colors']) => {
    return theme.colors[colorKey];
  };
};
