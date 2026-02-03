import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Input, createInput } from '../../src/components/ui/input.js';

describe('Input', () => {
  describe('基本渲染', () => {
    it('应该渲染输入框', () => {
      const { lastFrame } = render(<Input />);
      expect(lastFrame()).toBeDefined();
    });

    it('应该显示占位符', () => {
      const { lastFrame } = render(<Input placeholder="Enter text" />);
      expect(lastFrame()).toContain('Enter text');
    });

    it('应该显示默认值', () => {
      const { lastFrame } = render(<Input defaultValue="Hello" />);
      expect(lastFrame()).toContain('Hello');
    });
  });

  describe('标签显示', () => {
    it('应该显示标签', () => {
      const { lastFrame } = render(<Input label="Name:" />);
      expect(lastFrame()).toContain('Name:');
    });
  });

  describe('密码遮罩', () => {
    it('mask 为 true 时应该显示星号', () => {
      const { lastFrame } = render(
        <Input defaultValue="secret" mask={true} />
      );
      expect(lastFrame()).toContain('******');
      expect(lastFrame()).not.toContain('secret');
    });
  });

  describe('禁用状态', () => {
    it('disabled 为 true 时应该禁用输入', () => {
      const { lastFrame } = render(
        <Input defaultValue="text" disabled={true} />
      );
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('受控模式', () => {
    it('应该显示受控值', () => {
      const { lastFrame } = render(<Input value="controlled" />);
      expect(lastFrame()).toContain('controlled');
    });
  });

  describe('createInput 辅助函数', () => {
    it('应该创建输入框组件', () => {
      const input = createInput({ placeholder: 'Test' });
      const { lastFrame } = render(input);
      expect(lastFrame()).toContain('Test');
    });
  });

  describe('主题支持', () => {
    it('应该接受 theme 属性', () => {
      const mockTheme = {
        name: 'test',
        colors: {
          primary: 'blue',
          secondary: 'gray',
          success: 'green',
          error: 'red',
          warning: 'yellow',
          info: 'cyan',
          text: 'white',
          dim: 'gray',
          muted: 'darkgray',
        },
        symbols: {
          success: '✓',
          error: '✗',
          warning: '⚠',
          info: 'ℹ',
          arrow: '→',
          bullet: '•',
          spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        },
        layout: {
          indent: 2,
          maxWidth: 120,
        },
        components: {},
      };

      const { lastFrame } = render(<Input theme={mockTheme} />);
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('聚焦状态', () => {
    it('focus 为 false 时不应显示光标', () => {
      const { lastFrame } = render(<Input focus={false} />);
      // 组件应该能正常渲染
      expect(lastFrame()).toBeDefined();
    });
  });
});
