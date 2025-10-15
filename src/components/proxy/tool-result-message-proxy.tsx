/**
 * ToolResultMessage 代理组件
 * 
 * 根据主题选择使用自定义组件或默认组件
 */

import React from 'react';
import { useTheme } from '../../hooks/use-theme.js';
import type { ToolResultMessageProps } from '../../types/theme.js';

/**
 * Tool Result 消息代理组件
 * 
 * 使用当前主题的 toolResultMessage 组件实现
 */
export const ToolResultMessageProxy: React.FC<ToolResultMessageProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components.toolResultMessage;
  
  return <Component {...props} />;
};
