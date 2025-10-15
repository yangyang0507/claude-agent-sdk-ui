/**
 * Claude Code 主题 - 应用布局
 * 
 * 简洁的垂直堆叠布局
 */

import React from 'react';
import { Box } from 'ink';
import type { AppLayoutProps } from '../../types/theme.js';

/**
 * Claude Code 应用布局组件
 * 
 * 使用简单的垂直堆叠布局
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box flexDirection="column">
      {children}
    </Box>
  );
};
