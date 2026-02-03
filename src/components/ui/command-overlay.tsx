/**
 * CommandOverlay 组件 - 命令模式提示与帮助
 */

import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../../hooks/use-theme.js';
import { StatusLine } from './status-line.js';

export interface CommandOverlayProps {
  commandMode: boolean;
  showHelp: boolean;
  feedback: string | null;
  leaderKey?: string;
}

const COMMAND_HINTS = [
  { key: 't', label: 'Thinking' },
  { key: 'd', label: 'Tool details' },
  { key: 'c', label: 'Tool output' },
  { key: 's', label: 'Session info' },
  { key: 'f', label: 'Final result' },
  { key: 'e', label: 'Exec stats' },
  { key: 'u', label: 'Token usage' },
  { key: 'm', label: 'Timestamps' },
  { key: '?', label: 'Help' },
];

export const CommandOverlay: React.FC<CommandOverlayProps> = ({
  commandMode,
  showHelp,
  feedback,
  leaderKey = '\\',
}) => {
  const theme = useTheme();

  if (!commandMode && !showHelp && !feedback) {
    return null;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      {showHelp && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color={theme.colors.dim}>
            Commands ({leaderKey} then key):
          </Text>
          {COMMAND_HINTS.map((item) => (
            <Text key={item.key} color={theme.colors.dim}>
              {item.key}  {item.label}
            </Text>
          ))}
        </Box>
      )}

      {commandMode && (
        <StatusLine
          status="active"
          symbol={leaderKey}
          label={
            <Text color={theme.colors.info}>
              Command mode (press key)
            </Text>
          }
        />
      )}

      {feedback && (
        <StatusLine
          status="default"
          symbol={leaderKey}
          label={<Text color={theme.colors.info}>{feedback}</Text>}
        />
      )}
    </Box>
  );
};
