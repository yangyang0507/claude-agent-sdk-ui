/**
 * SystemMessage 代理组件
 * 
 * 根据主题选择使用自定义组件或默认组件
 */

import React from 'react';
import { useTheme } from '../../hooks/use-theme.js';
import type { SystemMessageProps } from '../../types/theme.js';

/**
 * System 消息代理组件
 * 
 * 使用当前主题的 systemMessage 组件实现
 */
export const SystemMessageProxy: React.FC<SystemMessageProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components.systemMessage;
  
  return <Component {...props} />;
};
