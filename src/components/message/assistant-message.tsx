/**
 * AssistantMessage 组件 - 渲染 Assistant 的响应
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import { Markdown } from '../ui/markdown.js';
import {
  isTextContent,
  isThinkingContent,
  isToolUseContent,
} from '../../types/messages.js';
import { useTheme } from '../../hooks/use-theme.js';
import {
  sanitizeToolInput,
  summarizeToolInput,
  extractToolDetailLines,
} from '../../utils/tools.js';
import { Spinner } from '../ui/spinner.js';
import type { ToolExecutionStateMap } from '../../utils/tool-states.js';

export interface AssistantMessageProps {
  message: SDKAssistantMessage;
  showThinking?: boolean;
  showToolDetails?: boolean;
  showToolContent?: boolean;
  toolStates?: ToolExecutionStateMap;
}

/**
 * Assistant 消息组件
 *
 * 渲染 Assistant 的文本响应、思考过程和工具调用
 *
 * @example
 * ```tsx
 * <AssistantMessage
 *   message={assistantMessage}
 *   showThinking={true}
 *   showToolDetails={true}
 * />
 * ```
 */
export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  showThinking = false,
  showToolDetails = true,
  showToolContent = false,
  toolStates = {},
}) => {
  const theme = useTheme();
  const { content } = message.message;
  const prefix = theme.symbols.aiPrefix || theme.symbols.pending || theme.symbols.bullet || '⏺';
  const outputPrefix = theme.symbols.toolOutput || '↳';
  const indent = theme.layout.indent ?? 2;

  return (
    <Box flexDirection="column">
      {content.map((item: any, index: number) => {
        // 1. 文本内容
        if (isTextContent(item)) {
          return (
            <Box key={index} flexDirection="row" alignItems="flex-start" marginBottom={1}>
              <Text color={theme.colors.primary}>{prefix}</Text>
              <Box marginLeft={1} flexDirection="column">
                <Markdown theme={theme} highlightCode={true} maxWidth={theme.layout.maxWidth ?? 120}>
                  {item.text}
                </Markdown>
              </Box>
            </Box>
          );
        }

        // 2. 思考内容
        if (isThinkingContent(item) && showThinking) {
          return (
            <Box key={index} flexDirection="row" marginBottom={1}>
              <Text color={theme.colors.dim}>{theme.symbols?.thinking || prefix}</Text>
              <Text dimColor> {item.thinking}</Text>
            </Box>
          );
        }

        // 3. 工具调用
        if (isToolUseContent(item)) {
          const sanitizedInput = sanitizeToolInput(item.input, {
            showContent: showToolContent,
          });
          const summary = summarizeToolInput(item.name, sanitizedInput);
          const details = showToolDetails ? extractToolDetailLines(sanitizedInput) : [];
          const toolState = toolStates[item.id];
          const status = toolState?.status ?? 'pending';
          const isError = status === 'error';
          const isPending = status === 'pending';
          const displayText = summary ? `${item.name}(${summary})` : item.name;

          return (
            <Box key={index} flexDirection="column" marginBottom={details.length > 0 ? 1 : 0}>
              <Box flexDirection="row" alignItems="center">
                <Text color={isError ? theme.colors.error : theme.colors.primary}>{prefix}</Text>
                <Text color={isError ? theme.colors.error : theme.colors.text}>
                  {' '}
                  {displayText}
                </Text>
                {isPending && (
                  <Box marginLeft={1}>
                    <Spinner text="" type="dots" color={theme.colors.info} />
                  </Box>
                )}
              </Box>

              {details.length > 0 && (
                <Box flexDirection="column" marginLeft={indent}>
                  {details.map((detail, i) => (
                    <Box key={i} flexDirection="row">
                      <Text color={theme.colors.dim}>{outputPrefix}</Text>
                      <Text dimColor> {detail}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        }

        return null;
      })}
    </Box>
  );
};
