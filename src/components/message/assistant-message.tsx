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
import { StatusLine } from '../ui/status-line.js';
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
  const toolOutputSymbol = theme.symbols.toolOutput || '⎿';

  return (
    <Box flexDirection="column">
      {content.map((item: any, index: number) => {
        // 1. 文本内容
        if (isTextContent(item)) {
          return (
            <StatusLine
              key={index}
              marginBottom={1}
              label={
                <Markdown theme={theme} highlightCode={true} maxWidth={theme.layout.maxWidth ?? 120}>
                  {item.text}
                </Markdown>
              }
            />
          );
        }

        // 2. 思考内容
        if (isThinkingContent(item) && showThinking) {
          return (
            <StatusLine
              key={index}
              status="active"
              color={theme.colors.dim}
              symbol={theme.symbols?.thinking || theme.symbols.aiPrefix || '…'}
              marginBottom={1}
              label={<Text dimColor>{item.thinking}</Text>}
            />
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
          const tone = isError ? 'error' : isPending ? 'active' : 'success';

          return (
            <React.Fragment key={index}>
              <StatusLine
                status={tone}
                spinner={isPending}
                marginBottom={details.length > 0 ? 0 : 1}
                label={
                  <Text color={isError ? theme.colors.error : theme.colors.text}>{displayText}</Text>
                }
              />

              {details.map((detail, detailIndex) => (
                <StatusLine
                  key={`${index}-detail-${detailIndex}`}
                  indentLevel={1}
                  symbol={toolOutputSymbol}
                  color={theme.colors.dim}
                  marginBottom={detailIndex === details.length - 1 ? 1 : 0}
                  label={<Text dimColor>{detail}</Text>}
                />
              ))}
            </React.Fragment>
          );
        }

        return null;
      })}
    </Box>
  );
};
