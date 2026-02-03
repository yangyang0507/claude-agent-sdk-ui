import React from 'react';
import { Box, Text } from 'ink';
import type { AssistantMessageProps, AppLayoutProps, Theme } from '../../src/types/theme.js';
import { claudeCodeTheme } from '../../src/themes/index.js';
import { useTheme } from '../../src/hooks/use-theme.js';

const CardAssistantMessage: React.FC<AssistantMessageProps> = (props) => {
  const theme = useTheme();
  const Inner = claudeCodeTheme.components.assistantMessage;

  return (
    <Box
      borderStyle="round"
      borderColor={theme.colors.primary}
      padding={1}
      marginBottom={1}
    >
      <Box flexDirection="column">
        <Text color={theme.colors.primary} bold>
          {theme.symbols.aiPrefix ?? '•'} Assistant
        </Text>
        <Box marginTop={1}>
          <Inner {...props} />
        </Box>
      </Box>
    </Box>
  );
};

const CardLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box flexDirection="column" paddingY={1}>
      {children}
    </Box>
  );
};

export const cardTheme: Theme = {
  ...claudeCodeTheme,
  name: 'card',
  colors: {
    ...claudeCodeTheme.colors,
    primary: '#7BDFF2',
    secondary: '#B2F7EF',
    highlight: '#F2B5D4',
  },
  components: {
    ...claudeCodeTheme.components,
    assistantMessage: CardAssistantMessage,
    appLayout: CardLayout,
  },
};
