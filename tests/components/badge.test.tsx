import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import {
  Badge,
  SuccessBadge,
  ErrorBadge,
  WarningBadge,
  InfoBadge,
  createBadge,
} from '../../src/components/ui/badge.js';

describe('Badge', () => {
  describe('基本渲染', () => {
    it('应该渲染徽章文本', () => {
      const { lastFrame } = render(<Badge>TEST</Badge>);
      expect(lastFrame()).toContain('TEST');
    });

    it('应该渲染带图标的徽章', () => {
      const { lastFrame } = render(<Badge type="success">SUCCESS</Badge>);
      expect(lastFrame()).toContain('✓');
      expect(lastFrame()).toContain('SUCCESS');
    });

    it('不显示图标时应该只显示文本', () => {
      const { lastFrame } = render(
        <Badge type="success" showIcon={false}>
          SUCCESS
        </Badge>
      );
      expect(lastFrame()).not.toContain('✓');
      expect(lastFrame()).toContain('SUCCESS');
    });
  });

  describe('徽章类型', () => {
    it('应该渲染 success 类型', () => {
      const { lastFrame } = render(<Badge type="success">OK</Badge>);
      expect(lastFrame()).toContain('✓');
    });

    it('应该渲染 error 类型', () => {
      const { lastFrame } = render(<Badge type="error">FAIL</Badge>);
      expect(lastFrame()).toContain('✗');
    });

    it('应该渲染 warning 类型', () => {
      const { lastFrame } = render(<Badge type="warning">WARN</Badge>);
      expect(lastFrame()).toContain('⚠');
    });

    it('应该渲染 info 类型', () => {
      const { lastFrame } = render(<Badge type="info">INFO</Badge>);
      expect(lastFrame()).toContain('ℹ');
    });

    it('应该渲染 custom 类型（无图标）', () => {
      const { lastFrame } = render(
        <Badge type="custom" color="magenta">
          CUSTOM
        </Badge>
      );
      expect(lastFrame()).toContain('CUSTOM');
      expect(lastFrame()).not.toContain('✓');
      expect(lastFrame()).not.toContain('✗');
    });
  });

  describe('徽章样式', () => {
    it('filled 样式应该包含空格填充', () => {
      const { lastFrame } = render(
        <Badge type="success" style="filled">
          OK
        </Badge>
      );
      // filled 样式会在文本周围添加空格
      expect(lastFrame()).toContain('OK');
    });

    it('outlined 样式应该包含方括号', () => {
      const { lastFrame } = render(
        <Badge type="success" style="outlined">
          OK
        </Badge>
      );
      expect(lastFrame()).toContain('[');
      expect(lastFrame()).toContain(']');
    });
  });

  describe('便捷组件', () => {
    it('SuccessBadge 应该渲染成功徽章', () => {
      const { lastFrame } = render(<SuccessBadge>DONE</SuccessBadge>);
      expect(lastFrame()).toContain('✓');
      expect(lastFrame()).toContain('DONE');
    });

    it('ErrorBadge 应该渲染错误徽章', () => {
      const { lastFrame } = render(<ErrorBadge>ERROR</ErrorBadge>);
      expect(lastFrame()).toContain('✗');
      expect(lastFrame()).toContain('ERROR');
    });

    it('WarningBadge 应该渲染警告徽章', () => {
      const { lastFrame } = render(<WarningBadge>WARN</WarningBadge>);
      expect(lastFrame()).toContain('⚠');
      expect(lastFrame()).toContain('WARN');
    });

    it('InfoBadge 应该渲染信息徽章', () => {
      const { lastFrame } = render(<InfoBadge>INFO</InfoBadge>);
      expect(lastFrame()).toContain('ℹ');
      expect(lastFrame()).toContain('INFO');
    });
  });

  describe('createBadge 辅助函数', () => {
    it('应该创建徽章组件', () => {
      const badge = createBadge({ type: 'success', children: 'TEST' });
      const { lastFrame } = render(badge);
      expect(lastFrame()).toContain('TEST');
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
        <Badge type="success" theme={mockTheme}>
          THEMED
        </Badge>
      );
      expect(lastFrame()).toContain('THEMED');
    });
  });
});
