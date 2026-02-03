import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Table } from '../../src/components/ui/table.js';

describe('Table', () => {
  describe('基本渲染', () => {
    it('应该渲染表格数据', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toContain('Alice');
      expect(lastFrame()).toContain('Bob');
      expect(lastFrame()).toContain('25');
      expect(lastFrame()).toContain('30');
    });

    it('应该渲染表头', () => {
      const data = [{ name: 'Alice', age: 25 }];
      const { lastFrame } = render(<Table data={data} showHeader={true} />);
      expect(lastFrame()).toContain('name');
      expect(lastFrame()).toContain('age');
    });

    it('不显示表头时应该只显示数据', () => {
      const data = [{ name: 'Alice', age: 25 }];
      const { lastFrame } = render(<Table data={data} showHeader={false} />);
      expect(lastFrame()).toContain('Alice');
      expect(lastFrame()).toContain('25');
    });
  });

  describe('空数据处理', () => {
    it('空数组应该返回 null', () => {
      const { lastFrame } = render(<Table data={[]} />);
      expect(lastFrame()).toBe('');
    });

    it('undefined 数据应该返回 null', () => {
      const { lastFrame } = render(<Table data={undefined as unknown as []} />);
      expect(lastFrame()).toBe('');
    });
  });

  describe('列配置', () => {
    it('应该支持自定义列', () => {
      const data = [
        { firstName: 'Alice', lastName: 'Smith', age: 25 },
        { firstName: 'Bob', lastName: 'Jones', age: 30 },
      ];
      const columns = [
        { key: 'firstName', header: 'First Name' },
        { key: 'lastName', header: 'Last Name' },
      ];
      const { lastFrame } = render(<Table data={data} columns={columns} />);
      expect(lastFrame()).toContain('First Name');
      expect(lastFrame()).toContain('Last Name');
      expect(lastFrame()).toContain('Alice');
      expect(lastFrame()).toContain('Smith');
      // age 列不应该显示（未在 columns 中定义）
      expect(lastFrame()).not.toContain('age');
    });

    it('应该使用 key 作为默认 header', () => {
      const data = [{ name: 'Alice' }];
      const columns = [{ key: 'name' }];
      const { lastFrame } = render(<Table data={data} columns={columns} />);
      expect(lastFrame()).toContain('name');
    });
  });

  describe('数据类型处理', () => {
    it('应该将数值转换为字符串', () => {
      const data = [{ value: 123 }];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toContain('123');
    });

    it('应该处理 null 值', () => {
      const data = [{ value: null }];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toBeDefined();
    });

    it('应该处理 undefined 值', () => {
      const data = [{ value: undefined }];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toBeDefined();
    });

    it('应该处理布尔值', () => {
      const data = [{ active: true, disabled: false }];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toContain('true');
      expect(lastFrame()).toContain('false');
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

      const data = [{ name: 'Test' }];
      const { lastFrame } = render(<Table data={data} theme={mockTheme} />);
      expect(lastFrame()).toContain('Test');
    });
  });

  describe('多行数据', () => {
    it('应该正确渲染多行数据', () => {
      const data = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
        { id: 3, name: 'Third' },
      ];
      const { lastFrame } = render(<Table data={data} />);
      expect(lastFrame()).toContain('First');
      expect(lastFrame()).toContain('Second');
      expect(lastFrame()).toContain('Third');
    });
  });
});
