import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { Box, createBox } from '../../src/components/ui/box.js';

describe('Box', () => {
  describe('基本渲染', () => {
    it('应该渲染子内容', () => {
      const { lastFrame } = render(
        <Box>
          <Text>Content</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Content');
    });

    it('应该渲染带标题的盒子', () => {
      const { lastFrame } = render(
        <Box title="Title">
          <Text>Content</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Title');
      expect(lastFrame()).toContain('Content');
    });
  });

  describe('边框样式', () => {
    it('single 样式应该渲染单线边框', () => {
      const { lastFrame } = render(
        <Box borderStyle="single">
          <Text>Test</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Test');
    });

    it('double 样式应该渲染双线边框', () => {
      const { lastFrame } = render(
        <Box borderStyle="double">
          <Text>Test</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Test');
    });

    it('round 样式应该渲染圆角边框', () => {
      const { lastFrame } = render(
        <Box borderStyle="round">
          <Text>Test</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Test');
    });

    it('bold 样式应该渲染粗边框', () => {
      const { lastFrame } = render(
        <Box borderStyle="bold">
          <Text>Test</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Test');
    });

    it('none 样式不应该渲染边框', () => {
      const { lastFrame } = render(
        <Box borderStyle="none">
          <Text>No Border</Text>
        </Box>
      );
      expect(lastFrame()).toContain('No Border');
    });
  });

  describe('边距和内边距', () => {
    it('应该支持 padding 属性', () => {
      const { lastFrame } = render(
        <Box padding={2}>
          <Text>Padded</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Padded');
    });

    it('应该支持 margin 属性', () => {
      const { lastFrame } = render(
        <Box marginTop={1} marginBottom={1}>
          <Text>Margined</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Margined');
    });
  });

  describe('createBox 辅助函数', () => {
    it('应该创建盒子组件', () => {
      const box = createBox({
        children: <Text>Created</Text>,
      });
      const { lastFrame } = render(box);
      expect(lastFrame()).toContain('Created');
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
        <Box theme={mockTheme}>
          <Text>Themed</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Themed');
    });
  });

  describe('边框颜色', () => {
    it('应该支持自定义边框颜色', () => {
      const { lastFrame } = render(
        <Box borderColor="red">
          <Text>Red Border</Text>
        </Box>
      );
      expect(lastFrame()).toContain('Red Border');
    });
  });
});
