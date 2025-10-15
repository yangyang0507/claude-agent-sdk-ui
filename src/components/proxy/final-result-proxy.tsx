/**
 * FinalResult 代理组件
 * 
 * 根据主题选择使用自定义组件或默认组件
 */

import React from 'react';
import { useTheme } from '../../hooks/use-theme.js';
import type { FinalResultProps } from '../../types/theme.js';

/**
 * Final Result 代理组件
 * 
 * 使用当前主题的 finalResult 组件实现
 */
export const FinalResultProxy: React.FC<FinalResultProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components.finalResult;
  
  return <Component {...props} />;
};
