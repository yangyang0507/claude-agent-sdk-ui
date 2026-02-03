/**
 * ProgressBar Component - 进度条组件
 * 显示任务进度或加载状态
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * 进度条样式
 */
export type ProgressBarStyle = 'default' | 'minimal' | 'blocks' | 'dots';

/**
 * ProgressBar 组件属性
 */
export interface ProgressBarProps {
  /** 当前进度值 (0-100) */
  percent: number;
  /** 进度条宽度 */
  width?: number;
  /** 进度条样式 */
  style?: ProgressBarStyle;
  /** 是否显示百分比文本 */
  showPercent?: boolean;
  /** 进度条颜色 */
  color?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 标签文本 */
  label?: string;
  /** 主题 */
  theme?: Theme;
}

/**
 * 进度条字符配置
 */
const styleChars: Record<ProgressBarStyle, { filled: string; empty: string }> = {
  default: { filled: '█', empty: '░' },
  minimal: { filled: '━', empty: '─' },
  blocks: { filled: '▓', empty: '░' },
  dots: { filled: '●', empty: '○' },
};

/**
 * ProgressBar 组件
 *
 * 显示任务进度的可视化进度条
 *
 * @example
 * ```tsx
 * <ProgressBar percent={75} width={30} />
 * <ProgressBar percent={50} style="blocks" showPercent />
 * <ProgressBar percent={30} label="Downloading" color="cyan" />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  width = 20,
  style = 'default',
  showPercent = false,
  color,
  backgroundColor,
  label,
  theme,
}) => {
  // 确保 percent 在 0-100 范围内
  const normalizedPercent = Math.max(0, Math.min(100, percent));
  const filledWidth = Math.round((normalizedPercent / 100) * width);
  const emptyWidth = width - filledWidth;

  const chars = styleChars[style];
  const filledBar = chars.filled.repeat(filledWidth);
  const emptyBar = chars.empty.repeat(emptyWidth);

  const barColor = color || theme?.colors.primary || 'green';
  const bgColor = backgroundColor || theme?.colors.dim || 'gray';

  return (
    <Box>
      {label && (
        <Text color={theme?.colors.text}>
          {label}{' '}
        </Text>
      )}
      <Text color={barColor}>{filledBar}</Text>
      <Text color={bgColor}>{emptyBar}</Text>
      {showPercent && (
        <Text color={theme?.colors.dim || 'gray'}>
          {' '}{Math.round(normalizedPercent)}%
        </Text>
      )}
    </Box>
  );
};

/**
 * 创建 ProgressBar 组件的辅助函数
 */
export const createProgressBar = (props: ProgressBarProps) => <ProgressBar {...props} />;
