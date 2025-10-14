/**
 * Divider Component - Ink 版本
 * 分割线组件
 */

import React, { useMemo } from 'react';
import { Box, Text, useStdout } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * Divider 样式
 */
export type DividerStyle = 'single' | 'double' | 'dashed' | 'dotted' | 'bold';

/**
 * Divider 对齐方式
 */
export type DividerAlign = 'left' | 'center' | 'right';

/**
 * Divider 组件属性
 */
export interface DividerProps {
  /** 分割线样式 */
  style?: DividerStyle;
  /** 分割线颜色 */
  color?: string;
  /** 标题文本 */
  text?: string;
  /** 文本对齐 */
  textAlign?: DividerAlign;
  /** 上边距 */
  marginTop?: number;
  /** 下边距 */
  marginBottom?: number;
  /** 宽度（默认使用终端宽度） */
  width?: number;
  /** 主题 */
  theme?: Theme;
}

/**
 * 分割线字符映射
 */
const dividerChars: Record<DividerStyle, string> = {
  single: '─',
  double: '═',
  dashed: '┄',
  dotted: '┈',
  bold: '━',
};

/**
 * Divider 组件
 *
 * @example
 * ```tsx
 * <Divider style="double" text="SECTION" color="cyan" />
 * <Divider style="single" />
 * ```
 */
export const Divider: React.FC<DividerProps> = ({
  style = 'single',
  color,
  text,
  textAlign = 'center',
  marginTop = 0,
  marginBottom = 0,
  width,
  theme,
}) => {
  const { stdout } = useStdout();
  const terminalWidth = width || stdout?.columns || 80;

  // 生成分割线内容
  const dividerLine = useMemo(() => {
    const char = dividerChars[style];

    // 如果没有文本，直接返回完整分割线
    if (!text) {
      return char.repeat(terminalWidth);
    }

    // 有文本时，根据对齐方式生成
    const textWithSpaces = ` ${text} `;
    const textLength = textWithSpaces.length;
    const remainingWidth = Math.max(0, terminalWidth - textLength);

    switch (textAlign) {
      case 'left': {
        const rightPadding = remainingWidth;
        return textWithSpaces + char.repeat(rightPadding);
      }
      case 'right': {
        const leftPadding = remainingWidth;
        return char.repeat(leftPadding) + textWithSpaces;
      }
      case 'center':
      default: {
        const leftPadding = Math.floor(remainingWidth / 2);
        const rightPadding = remainingWidth - leftPadding;
        return char.repeat(leftPadding) + textWithSpaces + char.repeat(rightPadding);
      }
    }
  }, [style, text, textAlign, terminalWidth]);

  const dividerColor = color || theme?.colors.primary || 'cyan';

  return (
    <Box
      marginTop={marginTop}
      marginBottom={marginBottom}
      flexDirection="column"
    >
      <Text color={dividerColor}>{dividerLine}</Text>
    </Box>
  );
};

/**
 * 创建 Divider 组件的辅助函数
 */
export const createDivider = (props: DividerProps) => <Divider {...props} />;
