import type { ThemeConfig } from '../types.js';

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    text: '#F3F4F6',
    dim: '#6B7280',
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
    color: '#3B82F6',
  },
};
