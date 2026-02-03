import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { StreamingText } from '../../src/components/ui/streaming-text.js';

describe('StreamingText', () => {
  describe('基本渲染', () => {
    it('启用流式效果时初始应该为空', () => {
      const { lastFrame } = render(
        <StreamingText text="Hi" speed={50} enabled={true} />
      );
      expect(lastFrame()).toBe('');
    });

    it('应该能渲染带样式属性的组件', () => {
      // 测试组件能接受各种 props 而不报错
      const { lastFrame } = render(
        <StreamingText
          text="Test"
          enabled={false}
          color="red"
          bold={true}
          dimColor={true}
        />
      );
      expect(lastFrame).toBeDefined();
    });

    it('应该能渲染带 onComplete 回调的组件', () => {
      const onComplete = () => {};
      const { lastFrame } = render(
        <StreamingText
          text="Test"
          enabled={false}
          onComplete={onComplete}
        />
      );
      expect(lastFrame).toBeDefined();
    });
  });

  describe('空文本处理', () => {
    it('应该处理空字符串', () => {
      const { lastFrame } = render(
        <StreamingText text="" enabled={false} />
      );
      expect(lastFrame()).toBe('');
    });
  });

  describe('Props 验证', () => {
    it('应该接受 speed 属性', () => {
      const { lastFrame } = render(
        <StreamingText text="Test" speed={100} enabled={true} />
      );
      expect(lastFrame).toBeDefined();
    });

    it('应该接受默认 speed', () => {
      const { lastFrame } = render(
        <StreamingText text="Test" enabled={true} />
      );
      expect(lastFrame).toBeDefined();
    });
  });
});
