/**
 * Droid 主题 - 应用布局
 * 
 * 带有更多呼吸空间的垂直布局
 */

import React from 'react';
import { Box } from 'ink';
import type { AppLayoutProps } from '../../../types/theme.js';

/**
 * Droid 应用布局组件
 * 
 * 使用带间距的垂直布局，提供更好的可读性
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box flexDirection="column" paddingY={1}>
      {children}
    </Box>
  );
};
