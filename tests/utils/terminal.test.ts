import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getTerminalWidth,
  getTerminalHeight,
  supportsColor,
  isTTY,
  clearTerminal,
  moveCursor,
  moveCursorToStart,
  clearLine,
  hideCursor,
  showCursor,
  applyColor,
  applyThemeColor,
  bold,
  italic,
  underline,
  strikethrough,
  dim,
  gradient,
  rainbow,
  createProgressBar,
  sleep,
  getEnvConfig,
} from '../../src/utils/terminal.js';
import type { Theme } from '../../src/types/theme.js';

describe('getTerminalWidth', () => {
  it('应该返回终端宽度', () => {
    const width = getTerminalWidth();
    expect(width).toBeGreaterThan(0);
  });

  it('应该在没有 columns 时返回默认值 80', () => {
    const originalColumns = process.stdout.columns;
    Object.defineProperty(process.stdout, 'columns', {
      value: undefined,
      configurable: true,
    });

    expect(getTerminalWidth()).toBe(80);

    Object.defineProperty(process.stdout, 'columns', {
      value: originalColumns,
      configurable: true,
    });
  });
});

describe('getTerminalHeight', () => {
  it('应该返回终端高度', () => {
    const height = getTerminalHeight();
    expect(height).toBeGreaterThan(0);
  });

  it('应该在没有 rows 时返回默认值 24', () => {
    const originalRows = process.stdout.rows;
    Object.defineProperty(process.stdout, 'rows', {
      value: undefined,
      configurable: true,
    });

    expect(getTerminalHeight()).toBe(24);

    Object.defineProperty(process.stdout, 'rows', {
      value: originalRows,
      configurable: true,
    });
  });
});

describe('supportsColor', () => {
  it('应该返回布尔值', () => {
    const result = supportsColor();
    expect(typeof result).toBe('boolean');
  });
});

describe('isTTY', () => {
  it('应该返回布尔值', () => {
    const result = isTTY();
    expect(typeof result).toBe('boolean');
  });

  it('应该在 isTTY 为 undefined 时返回 false', () => {
    const originalIsTTY = process.stdout.isTTY;
    Object.defineProperty(process.stdout, 'isTTY', {
      value: undefined,
      configurable: true,
    });

    expect(isTTY()).toBe(false);

    Object.defineProperty(process.stdout, 'isTTY', {
      value: originalIsTTY,
      configurable: true,
    });
  });
});

describe('clearTerminal', () => {
  let writeSpy: any;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('应该在 TTY 环境下清空终端', () => {
    if (isTTY()) {
      clearTerminal();
      expect(writeSpy).toHaveBeenCalledWith('\x1B[2J\x1B[0f');
    }
  });
});

describe('moveCursor', () => {
  let writeSpy: any;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('应该在 TTY 环境下移动光标', () => {
    if (isTTY()) {
      moveCursor(10, 5);
      expect(writeSpy).toHaveBeenCalledWith('\x1B[5;10H');
    }
  });
});

describe('applyColor', () => {
  it('应该应用颜色', () => {
    const result = applyColor('test', '#FF0000');
    expect(result).toContain('test');
  });

  it('应该处理空字符串', () => {
    const result = applyColor('', '#FF0000');
    expect(result).toBe('');
  });
});

describe('applyThemeColor', () => {
  const mockTheme: Theme = {
    name: 'test',
    colors: {
      primary: '#FF0000',
      secondary: '#00FF00',
      success: '#00FF00',
      error: '#FF0000',
      warning: '#FFFF00',
      info: '#0000FF',
      text: '#FFFFFF',
      dim: '#888888',
      background: '#000000',
      highlight: '#FFFF00',
    },
    symbols: {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ',
      pending: '○',
      spinner: ['⠋', '⠙', '⠹'],
      bullet: '•',
      arrow: '→',
      aiPrefix: '🤖',
      userPrefix: '👤',
      toolOutput: '📄',
    },
    borders: {
      style: 'single',
      color: '#888888',
    },
    layout: {
      indent: 2,
      lineSpacing: 1,
      maxWidth: 120,
    },
  };

  it('应该应用主题颜色', () => {
    const result = applyThemeColor('test', 'primary', mockTheme);
    expect(result).toContain('test');
  });

  it('应该处理不存在的颜色类型', () => {
    const themeWithoutColor: Theme = {
      ...mockTheme,
      colors: {
        ...mockTheme.colors,
        primary: undefined as any,
      },
    };
    const result = applyThemeColor('test', 'primary', themeWithoutColor);
    expect(result).toBe('test');
  });
});

describe('bold', () => {
  it('应该加粗文本', () => {
    const result = bold('test');
    expect(result).toContain('test');
  });
});

describe('italic', () => {
  it('应该斜体文本', () => {
    const result = italic('test');
    expect(result).toContain('test');
  });
});

describe('underline', () => {
  it('应该下划线文本', () => {
    const result = underline('test');
    expect(result).toContain('test');
  });
});

describe('strikethrough', () => {
  it('应该删除线文本', () => {
    const result = strikethrough('test');
    expect(result).toContain('test');
  });
});

describe('dim', () => {
  it('应该暗淡文本', () => {
    const result = dim('test');
    expect(result).toContain('test');
  });
});

describe('gradient', () => {
  it('应该创建渐变文本', () => {
    const result = gradient('hello', ['#FF0000', '#00FF00', '#0000FF']);
    expect(result).toContain('h');
    expect(result).toContain('e');
    expect(result).toContain('l');
    expect(result).toContain('o');
  });

  it('应该处理单一颜色', () => {
    const result = gradient('test', ['#FF0000']);
    expect(result).toContain('test');
  });

  it('应该处理空颜色数组', () => {
    const result = gradient('test', []);
    expect(result).toBe('test');
  });

  it('应该处理空字符串', () => {
    const result = gradient('', ['#FF0000']);
    expect(result).toBe('');
  });
});

describe('rainbow', () => {
  it('应该创建彩虹文本', () => {
    const result = rainbow('hello');
    expect(result).toContain('h');
    expect(result).toContain('e');
    expect(result).toContain('l');
    expect(result).toContain('o');
  });
});

describe('createProgressBar', () => {
  it('应该创建进度条', () => {
    const result = createProgressBar(50, 100);
    expect(result).toContain('[');
    expect(result).toContain(']');
    expect(result).toContain('50.0%');
  });

  it('应该处理 0% 进度', () => {
    const result = createProgressBar(0, 100);
    expect(result).toContain('0.0%');
  });

  it('应该处理 100% 进度', () => {
    const result = createProgressBar(100, 100);
    expect(result).toContain('100.0%');
  });

  it('应该处理超过 100% 的进度', () => {
    const result = createProgressBar(150, 100);
    expect(result).toContain('100.0%');
  });

  it('应该处理负数进度', () => {
    const result = createProgressBar(-10, 100);
    expect(result).toContain('0.0%');
  });

  it('应该支持自定义宽度', () => {
    const result = createProgressBar(50, 100, 20);
    expect(result).toContain('[');
    expect(result).toContain(']');
  });

  it('应该处理 total 为 0 的情况', () => {
    const result = createProgressBar(0, 0);
    expect(result).toContain('%');
  });
});

describe('sleep', () => {
  it('应该等待指定时间', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();

    expect(end - start).toBeGreaterThanOrEqual(90);
  });

  it('应该返回 Promise', () => {
    const result = sleep(10);
    expect(result).toBeInstanceOf(Promise);
  });
});

describe('getEnvConfig', () => {
  it('应该返回环境配置', () => {
    const config = getEnvConfig();

    expect(config).toHaveProperty('colorLevel');
    expect(config).toHaveProperty('isTTY');
    expect(config).toHaveProperty('supportsColor');
    expect(config).toHaveProperty('terminalWidth');
    expect(config).toHaveProperty('terminalHeight');
    expect(config).toHaveProperty('platform');
    expect(config).toHaveProperty('nodeVersion');
  });

  it('应该返回正确的类型', () => {
    const config = getEnvConfig();

    expect(typeof config.colorLevel).toBe('number');
    expect(typeof config.isTTY).toBe('boolean');
    expect(typeof config.supportsColor).toBe('boolean');
    expect(typeof config.terminalWidth).toBe('number');
    expect(typeof config.terminalHeight).toBe('number');
    expect(typeof config.platform).toBe('string');
    expect(typeof config.nodeVersion).toBe('string');
  });
});
