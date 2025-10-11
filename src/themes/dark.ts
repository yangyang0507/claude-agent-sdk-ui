import type { ThemeConfig } from '../types.js';

export const darkTheme: ThemeConfig = {
  colors: {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
    text: '#F9FAFB',
    dim: '#9CA3AF',
  },
  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '○',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  },
  borders: {
    style: 'round',
    color: '#60A5FA',
  },
};
