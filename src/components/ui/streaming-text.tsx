/**
 * StreamingText 组件 - 打字机效果文本流式显示
 */

import React, { useEffect, useState } from 'react';
import { Text } from 'ink';

export interface StreamingTextProps {
  /**
   * 要显示的完整文本
   */
  text: string;

  /**
   * 打字速度（每个字符的延迟，单位毫秒）
   * @default 20
   */
  speed?: number;

  /**
   * 是否启用流式效果
   * @default true
   */
  enabled?: boolean;

  /**
   * 流式完成时的回调
   */
  onComplete?: () => void;

  /**
   * 文本颜色
   */
  color?: string;

  /**
   * 是否加粗
   */
  bold?: boolean;

  /**
   * 是否使用暗色显示
   */
  dimColor?: boolean;
}

/**
 * 流式文本组件
 *
 * 实现打字机效果，逐字符显示文本
 *
 * @example
 * ```tsx
 * <StreamingText
 *   text="Hello, World!"
 *   speed={20}
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */
export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speed = 20,
  enabled = true,
  onComplete,
  color,
  bold,
  dimColor,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 如果未启用流式效果，直接显示全部文本
    if (!enabled) {
      setDisplayedText(text);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // 如果已经显示完成
    if (currentIndex >= text.length) {
      if (onComplete && displayedText === text) {
        onComplete();
      }
      return;
    }

    // 逐字符显示
    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, enabled, onComplete, displayedText]);

  // 当 text 改变时重置
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <Text color={color} bold={bold} dimColor={dimColor}>
      {displayedText}
    </Text>
  );
};
