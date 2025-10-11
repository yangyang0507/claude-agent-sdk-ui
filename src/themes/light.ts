import type { ThemeConfig } from '../types.js';

export const lightTheme: ThemeConfig = {
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0891B2',
    text: '#111827',
    dim: '#4B5563',
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
    color: '#2563EB',
  },
};
