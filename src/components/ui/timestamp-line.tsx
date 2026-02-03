/**
 * TimestampLine 组件 - 显示消息时间戳
 */

import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../../hooks/use-theme.js';

export interface TimestampLineProps {
  timestamp: string;
  marginBottom?: number;
}

export const TimestampLine: React.FC<TimestampLineProps> = ({
  timestamp,
  marginBottom = 0,
}) => {
  const theme = useTheme();
  const indent = theme.layout.indent ?? 2;

  return (
    <Box marginLeft={indent} marginBottom={marginBottom}>
      <Text color={theme.colors.dim} dimColor>
        [{timestamp}]
      </Text>
    </Box>
  );
};
