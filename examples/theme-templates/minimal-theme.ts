import { createTheme, claudeCodeTheme } from '../../src/themes/index.js';

export const minimalTheme = createTheme({
  name: 'minimal',
  colors: {
    primary: '#5BB98C',
    secondary: '#89CFF0',
    success: '#7ED957',
    error: '#FF6B6B',
    warning: '#F6C85F',
    info: '#6CCFF6',
    text: '#E6E6E6',
    dim: '#8A8A8A',
    background: '#1B1F24',
    highlight: '#F4D06F',
  },
  symbols: {
    aiPrefix: '◆',
    bullet: '•',
    arrow: '→',
    toolOutput: '↳',
  },
  components: claudeCodeTheme.components,
});
