/**
 * AppLayout 代理组件
 * 
 * 根据主题选择使用自定义布局或默认布局
 */

import React from 'react';
import { Box } from 'ink';
import { useTheme } from '../../hooks/use-theme.js';
import type { AppLayoutProps } from '../../types/theme.js';

/**
 * 默认应用布局组件
 * 
 * 简单的垂直堆叠布局
 */
const DefaultAppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box flexDirection="column">
      {children}
    </Box>
  );
};

/**
 * 应用布局代理组件
 * 
 * 如果主题提供了自定义的 appLayout 组件，则使用自定义组件
 * 否则使用默认的垂直布局
 */
export const AppLayoutProxy: React.FC<AppLayoutProps> = (props) => {
  const theme = useTheme();
  const Component = theme.components?.appLayout ?? DefaultAppLayout;
  
  return <Component {...props} />;
};
