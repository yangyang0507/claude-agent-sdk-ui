/**
 * AssistantMessage 组件 - 渲染 Assistant 的响应
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import { Markdown } from '../../../components/ui/markdown.js';
import {
  isTextContent,
  isThinkingContent,
  isToolUseContent,
  type MessageContent,
} from '../../../types/messages.js';
import { useTheme } from '../../../hooks/use-theme.js';
import {
  sanitizeToolInput,
  summarizeToolInput,
  extractToolDetailLines,
} from '../../../utils/tools.js';
import { StatusLine } from '../../../components/ui/status-line.js';
import type { ToolExecutionStateMap } from '../../../utils/tool-states.js';
import { parseThinkingTags } from '../../../utils/string.js';

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
  const thinkingSymbol = theme.symbols?.thinking || theme.symbols.aiPrefix || '…';

  // 渲染多行 thinking 内容的辅助函数 - Droid 风格（橙色表示思考中）
  const renderThinkingContent = (thinkingText: string, key: string | number) => {
    const lines = thinkingText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return null;

    return (
      <Box key={key} flexDirection="column" marginBottom={1}>
        {/* 第一行：图标 + 文本（橙色 - 表示进行中状态） */}
        <Box flexDirection="row">
          <Text color={theme.colors.primary}>{thinkingSymbol}</Text>
          <Box marginLeft={1}>
            <Text color={theme.colors.primary}>{lines[0]}</Text>
          </Box>
        </Box>
        {/* 后续行：缩进对齐 */}
        {lines.slice(1).map((line, lineIndex) => (
          <Box key={lineIndex} flexDirection="row">
            <Text>{' '.repeat(thinkingSymbol.length)}</Text>
            <Box marginLeft={1}>
              <Text color={theme.colors.primary}>{line}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box flexDirection="column">
      {content.map((item: MessageContent, index: number) => {
        // 1. 文本内容
        if (isTextContent(item)) {
          // 跳过空内容或特殊标记
          const trimmedText = item.text.trim();
          if (!trimmedText || trimmedText === '(no content)') {
            return null;
          }

          // 解析文本中的 thinking 标签
          const parsedContent = parseThinkingTags(item.text);

          return (
            <React.Fragment key={index}>
              {parsedContent.map((parsed, parsedIndex) => {
                if (parsed.type === 'thinking') {
                  // 如果是 thinking 内容，根据 showThinking 选项决定是否显示
                  if (!showThinking) {
                    return null;
                  }
                  return renderThinkingContent(parsed.content, `${index}-${parsedIndex}`);
                }

                // 普通文本内容 - Droid 风格（六芒星前缀 - 青色）
                return (
                  <Box key={`${index}-${parsedIndex}`} flexDirection="row" marginBottom={1}>
                    <Text color={theme.colors.secondary}>{theme.symbols.aiPrefix}</Text>
                    <Box marginLeft={1} flexGrow={1}>
                      <Markdown theme={theme} highlightCode={true} maxWidth={theme.layout.maxWidth ?? 120}>
                        {parsed.content}
                      </Markdown>
                    </Box>
                  </Box>
                );
              })}
            </React.Fragment>
          );
        }

        // 2. 思考内容
        if (isThinkingContent(item) && showThinking) {
          return renderThinkingContent(item.thinking, index);
        }

        // 3. 工具调用 - Droid 风格（橙色标签 + 箭头）
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
          const displayText = summary ? `${summary}` : '';

          return (
            <React.Fragment key={index}>
              {/* 工具调用行 - 橙色标签 */}
              <Box flexDirection="row" marginBottom={0}>
                <Box marginRight={1} paddingX={1} backgroundColor={theme.colors.primary}>
                  <Text color="#000000" bold>{item.name.toUpperCase()}</Text>
                </Box>
                <Text color={theme.colors.dim}>
                  {displayText}
                  {isPending && ' ...'}
                </Text>
              </Box>

              {/* 工具详情 - 使用箭头符号 */}
              {details.map((detail, detailIndex) => (
                <Box 
                  key={`${index}-detail-${detailIndex}`} 
                  flexDirection="row" 
                  marginBottom={detailIndex === details.length - 1 ? 1 : 0}
                >
                  <Text color={theme.colors.dim}>{toolOutputSymbol} {detail}</Text>
                </Box>
              ))}
            </React.Fragment>
          );
        }

        return null;
      })}
    </Box>
  );
};
