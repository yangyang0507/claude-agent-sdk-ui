/**
 * AssistantMessage 代理组件
 * 
 * 根据主题获取对应的组件实现
 */

import React from 'react';
import { useTheme } from '../../hooks/use-theme.js';
import type { AssistantMessageProps } from '../../types/theme.js';

/**
 * Assistant 消息代理组件
 * 
 * 使用当前主题的 assistantMessage 组件实现
 */
export const AssistantMessageProxy: React.FC<AssistantMessageProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components.assistantMessage;
  
  return <Component {...props} />;
};
