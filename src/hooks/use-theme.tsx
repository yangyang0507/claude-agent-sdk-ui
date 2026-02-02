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
 * 开发环境警告标志，避免重复警告
 */
let hasWarnedAboutMissingProvider = false;

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
    // 开发环境下发出警告
    if (process.env.NODE_ENV === 'development' && !hasWarnedAboutMissingProvider) {
      console.warn(
        '[claude-agent-sdk-ui] useTheme was called outside of ThemeProvider. ' +
        'Using default theme. Wrap your app with <ThemeProvider> for proper theming.'
      );
      hasWarnedAboutMissingProvider = true;
    }
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
