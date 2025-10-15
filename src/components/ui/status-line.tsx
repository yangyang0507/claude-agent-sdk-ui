import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from './spinner.js';
import { useTheme } from '../../hooks/use-theme.js';

export type StatusTone = 'default' | 'active' | 'success' | 'error';

export interface StatusLineProps {
  label: React.ReactNode;
  status?: StatusTone;
  indentLevel?: number;
  spinner?: boolean;
  symbol?: string;
  color?: string;
  marginBottom?: number;
}

export const StatusLine: React.FC<StatusLineProps> = ({
  label,
  status = 'default',
  indentLevel = 0,
  spinner = false,
  symbol,
  color,
  marginBottom = 0,
}) => {
  const theme = useTheme();
  const indentSize = theme.layout.indent ?? 2;
  const colorMap = {
    default: theme.colors.primary,
    active: theme.colors.info,
    success: theme.colors.success,
    error: theme.colors.error,
  } as const;

  const indicatorColor = color ?? colorMap[status] ?? theme.colors.primary;
  const indicatorSymbol = symbol ?? theme.symbols.aiPrefix ?? theme.symbols.bullet ?? '●';
  const labelColor = status === 'default' ? theme.colors.text : indicatorColor;

  return (
    <Box flexDirection="row" alignItems="flex-start" marginBottom={marginBottom}>
      <Box marginLeft={indentLevel * indentSize}>
        {spinner ? (
          <Spinner text="" color={indicatorColor} type="dots" />
        ) : (
          <Text color={indicatorColor}>{indicatorSymbol}</Text>
        )}
      </Box>

      <Box marginLeft={1} flexDirection="column">
        {typeof label === 'string' ? <Text color={labelColor}>{label}</Text> : label}
      </Box>
    </Box>
  );
};
