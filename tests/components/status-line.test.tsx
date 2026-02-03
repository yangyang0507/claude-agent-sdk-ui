import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { StatusLine } from '../../src/components/ui/status-line.js';

vi.mock('../../src/hooks/use-theme.js', () => ({
  useTheme: () =>
    ({
      colors: {
        primary: 'primary',
        info: 'info',
        success: 'success',
        error: 'error',
        text: 'text',
      },
      symbols: {
        aiPrefix: 'AI',
        bullet: '•',
      },
      layout: {
        indent: 2,
      },
    }) as any,
}));

vi.mock('../../src/components/ui/spinner.js', () => ({
  Spinner: ({ color, type, text }: any) => (
    <Text>{`Spinner:${color}:${type}:${text}`}</Text>
  ),
}));

describe('StatusLine', () => {
  it('应该渲染默认符号和文本', () => {
    const { lastFrame } = render(<StatusLine label="Hello" />);

    const frame = lastFrame();
    expect(frame).toContain('AI');
    expect(frame).toContain('Hello');
  });

  it('应该使用自定义符号', () => {
    const { lastFrame } = render(<StatusLine label="Hi" symbol="*" />);

    expect(lastFrame()).toContain('*');
  });

  it('spinner=true 时应渲染 Spinner 组件', () => {
    const { lastFrame } = render(<StatusLine label="Wait" spinner />);

    expect(lastFrame()).toContain('Spinner:');
  });

  it('label 为 ReactNode 时应直接渲染', () => {
    const { lastFrame } = render(<StatusLine label={<Text>Node</Text>} />);

    expect(lastFrame()).toContain('Node');
  });
});
