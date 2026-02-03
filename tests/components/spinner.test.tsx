import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Spinner } from '../../src/components/ui/spinner.js';

describe('Spinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该渲染初始帧与文本', () => {
    const { lastFrame } = render(
      <Spinner type="line" interval={100} text="Loading" />
    );

    const frame = lastFrame();
    expect(frame).toContain('-');
    expect(frame).toContain('Loading');
  });

  it('应随时间推进帧', async () => {
    const { lastFrame } = render(
      <Spinner type="line" interval={100} text="Loading" />
    );

    await vi.advanceTimersByTimeAsync(100);

    expect(lastFrame()).toContain('\\');
  });

  it('text 为空时不渲染文本', () => {
    const { lastFrame } = render(<Spinner type="line" interval={100} text="" />);

    const frame = lastFrame();
    expect(frame).toContain('-');
    expect(frame).not.toContain('Loading');
  });
});
