/**
 * AssistantMessage 组件 - 渲染 Assistant 的响应
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import { WarningBadge } from '../ui/badge.js';
import { Markdown } from '../ui/markdown.js';
import {
  isTextContent,
  isThinkingContent,
  isToolUseContent,
} from '../../types/messages.js';
import { useTheme } from '../../hooks/use-theme.js';
import {
  sanitizeToolInput,
  formatToolLabel,
  summarizeToolInput,
  extractToolDetailLines,
} from '../../utils/tools.js';

export interface AssistantMessageProps {
  message: SDKAssistantMessage;
  showThinking?: boolean;
  showToolDetails?: boolean;
  showToolContent?: boolean;
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
}) => {
  const theme = useTheme();
  const { content } = message.message;

  return (
    <Box flexDirection="column">
      {content.map((item: any, index: number) => {
        // 1. 文本内容
        if (isTextContent(item)) {
          return (
            <Box key={index} flexDirection="column" marginBottom={1}>
              <Text color={theme.colors.primary}>
                {theme.symbols?.bullet || '●'}{' '}
              </Text>
              <Markdown theme={theme} highlightCode={true} maxWidth={120}>
                {item.text}
              </Markdown>
            </Box>
          );
        }

        // 2. 思考内容
        if (isThinkingContent(item) && showThinking) {
          return (
            <Box key={index} flexDirection="column" marginBottom={1}>
              <Text dimColor>
                {theme.symbols?.thinking || '💭'} 思考中...
              </Text>
              <Text dimColor>  {item.thinking}</Text>
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

          return (
            <Box key={index} flexDirection="column" marginBottom={1}>
              {/* 工具名称和摘要 */}
              <Box>
                <WarningBadge showIcon={false}>{formatToolLabel(item.name)}</WarningBadge>
                {summary && <Text dimColor> {summary}</Text>}
              </Box>

              {/* 工具参数详情 */}
              {details.length > 0 && (
                <Box flexDirection="column" marginLeft={2}>
                  {details.map((detail, i) => (
                    <Text key={i} dimColor>
                      • {detail}
                    </Text>
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
