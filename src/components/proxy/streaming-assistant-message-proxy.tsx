/**
 * StreamingAssistantMessage 代理组件
 * 
 * 根据主题获取对应的组件实现
 */

import React from 'react';
import { useTheme } from '../../hooks/use-theme.js';
import type { StreamingAssistantMessageProps } from '../../types/theme.js';

/**
 * 流式 Assistant 消息代理组件
 * 
 * 使用当前主题的 streamingAssistantMessage 组件实现
 */
export const StreamingAssistantMessageProxy: React.FC<StreamingAssistantMessageProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components.streamingAssistantMessage;
  
  return <Component {...props} />;
};
