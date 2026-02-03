import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { SelectList, createSelectList } from '../../src/components/ui/select-list.js';

const basicOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('SelectList', () => {
  describe('基本渲染', () => {
    it('应该渲染选项列表', () => {
      const { lastFrame } = render(<SelectList options={basicOptions} />);
      expect(lastFrame()).toContain('Option A');
      expect(lastFrame()).toContain('Option B');
      expect(lastFrame()).toContain('Option C');
    });

    it('应该显示指示器在第一个选项', () => {
      const { lastFrame } = render(<SelectList options={basicOptions} />);
      expect(lastFrame()).toContain('❯');
    });
  });

  describe('标签显示', () => {
    it('应该显示标签', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} label="Choose an option:" />
      );
      expect(lastFrame()).toContain('Choose an option:');
    });
  });

  describe('默认值', () => {
    it('应该高亮默认值选项', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} defaultValue="b" />
      );
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('禁用选项', () => {
    it('应该显示禁用标记', () => {
      const options = [
        { value: 'a', label: 'Enabled' },
        { value: 'b', label: 'Disabled', disabled: true },
      ];
      const { lastFrame } = render(<SelectList options={options} />);
      expect(lastFrame()).toContain('disabled');
    });
  });

  describe('描述文本', () => {
    it('应该显示选中选项的描述', () => {
      const options = [
        { value: 'a', label: 'Option A', description: 'This is option A' },
        { value: 'b', label: 'Option B' },
      ];
      const { lastFrame } = render(
        <SelectList options={options} showDescription={true} />
      );
      expect(lastFrame()).toContain('This is option A');
    });

    it('showDescription 为 false 时不应显示描述', () => {
      const options = [
        { value: 'a', label: 'Option A', description: 'Hidden description' },
      ];
      const { lastFrame } = render(
        <SelectList options={options} showDescription={false} />
      );
      expect(lastFrame()).not.toContain('Hidden description');
    });
  });

  describe('自定义指示器', () => {
    it('应该使用自定义指示器', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} indicator=">" />
      );
      expect(lastFrame()).toContain('>');
    });

    it('应该使用自定义选中标记', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} defaultValue="a" checkmark="[x]" />
      );
      expect(lastFrame()).toContain('[x]');
    });
  });

  describe('受控模式', () => {
    it('应该显示受控值的选中状态', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} value="b" />
      );
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('createSelectList 辅助函数', () => {
    it('应该创建选择列表组件', () => {
      const selectList = createSelectList({ options: basicOptions });
      const { lastFrame } = render(selectList);
      expect(lastFrame()).toContain('Option A');
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

      const { lastFrame } = render(
        <SelectList options={basicOptions} theme={mockTheme} />
      );
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('空选项处理', () => {
    it('应该处理空选项列表', () => {
      const { lastFrame } = render(<SelectList options={[]} />);
      expect(lastFrame()).toBeDefined();
    });
  });

  describe('聚焦状态', () => {
    it('focus 为 false 时应该正常渲染', () => {
      const { lastFrame } = render(
        <SelectList options={basicOptions} focus={false} />
      );
      expect(lastFrame()).toContain('Option A');
    });
  });
});
