/**
 * Spinner Component - 自定义实现
 * 使用 React hooks 实现加载动画
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * Spinner 动画帧定义
 */
const SPINNER_FRAMES = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
  dots3: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
  line: ['-', '\\', '|', '/'],
  bounce: ['⠁', '⠂', '⠄', '⠂'],
  arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
  circle: ['◐', '◓', '◑', '◒'],
  simpleDots: ['.  ', '.. ', '...', '   '],
  clock: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'],
};

/**
 * Spinner 类型
 */
export type SpinnerType = keyof typeof SPINNER_FRAMES;

/**
 * Spinner 组件属性
 */
export interface SpinnerProps {
  /** 显示的文本 */
  text?: string;
  /** Spinner 类型 */
  type?: SpinnerType;
  /** Spinner 颜色 */
  color?: string;
  /** 主题 */
  theme?: Theme;
  /** 动画间隔（毫秒） */
  interval?: number;
}

/**
 * Spinner 组件
 *
 * @example
 * ```tsx
 * <Spinner text="Loading..." type="dots" color="cyan" />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  text = 'Loading...',
  type = 'dots',
  color,
  theme,
  interval = 80,
}) => {
  const [frame, setFrame] = useState(0);
  const spinnerColor = color || theme?.colors.info || 'cyan';
  const frames = SPINNER_FRAMES[type] || SPINNER_FRAMES.dots;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, interval);

    return () => clearInterval(timer);
  }, [frames.length, interval]);

  return (
    <Box>
      <Text color={spinnerColor}>{frames[frame]}</Text>
      {text && (
        <Text color={spinnerColor} dimColor>
          {' '}
          {text}
        </Text>
      )}
    </Box>
  );
};

/**
 * 创建 Spinner 组件的辅助函数
 */
export const createSpinner = (props: SpinnerProps) => <Spinner {...props} />;

/**
 * Spinner 组件导出（用于类似原 API 的兼容）
 */
export default Spinner;
