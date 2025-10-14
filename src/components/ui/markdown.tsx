/**
 * Markdown 组件 - 自定义实现
 * 使用 marked + marked-terminal 渲染 Markdown
 */

import React from 'react';
import { parse, setOptions } from 'marked';
import { Text } from 'ink';
// @ts-expect-error - marked-terminal lacks type definitions
import TerminalRenderer from 'marked-terminal';
import type { Theme } from '../../types/theme.js';

/**
 * Markdown 组件属性
 */
export interface MarkdownProps {
  /** Markdown 文本 */
  children: string;
  /** 主题 */
  theme?: Theme;
  /** 是否高亮代码 */
  highlightCode?: boolean;
  /** 最大宽度 */
  maxWidth?: number;
}

/**
 * Markdown 组件
 *
 * 渲染 Markdown 文本，支持代码高亮和主题定制
 *
 * @example
 * ```tsx
 * <Markdown theme={theme}>
 *   # Hello World
 *   This is **bold** text
 * </Markdown>
 * ```
 */
export const Markdown: React.FC<MarkdownProps> = ({
  children,
  theme: _theme,
  highlightCode: _highlightCode = true,
  maxWidth: _maxWidth,
}) => {
  if (!children || children.trim() === '') {
    return null;
  }

  // 配置 marked-terminal 渲染器
  setOptions({
    renderer: new TerminalRenderer({
      // 可以在这里添加更多配置
    }),
  });

  // 解析 Markdown 并渲染为文本
  const rendered = parse(children) as string;

  return <Text>{rendered.trim()}</Text>;
};

/**
 * 默认导出
 */
export default Markdown;
