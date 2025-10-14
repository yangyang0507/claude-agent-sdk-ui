/**
 * StreamingAssistantMessage 组件 - 流式显示 Assistant 消息
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import { useTheme } from '../../hooks/use-theme.js';
import { StreamingText } from '../ui/streaming-text.js';
import { Markdown } from '../ui/markdown.js';
import { StatusLine } from '../ui/status-line.js';
import { isTextContent, isThinkingContent, isToolUseContent } from '../../types/messages.js';
import { sanitizeToolInput, summarizeToolInput, extractToolDetailLines } from '../../utils/tools.js';
import type { ToolExecutionStateMap } from '../../utils/tool-states.js';

export interface StreamingAssistantMessageProps {
  /**
   * Assistant 消息对象
   */
  message: SDKAssistantMessage;

  /**
   * 是否显示 thinking 内容
   */
  showThinking?: boolean;

  /**
   * 是否显示工具调用详情
   */
  showToolDetails?: boolean;

  /**
   * 打字机速度（毫秒）
   */
  typingSpeed?: number;

  /**
   * 是否启用流式效果
   */
  streamingEnabled?: boolean;

  /**
   * 流式完成回调
   */
  onStreamComplete?: () => void;
  /**
   * 工具执行状态
   */
  toolStates?: ToolExecutionStateMap;
}

/**
 * 流式 Assistant 消息组件
 *
 * 支持打字机效果显示文本和工具调用
 *
 * @example
 * ```tsx
 * <StreamingAssistantMessage
 *   message={assistantMessage}
 *   typingSpeed={20}
 *   streamingEnabled={true}
 * />
 * ```
 */
export const StreamingAssistantMessage: React.FC<StreamingAssistantMessageProps> = ({
  message,
  showThinking = false,
  showToolDetails = true,
  typingSpeed = 20,
  streamingEnabled = true,
  onStreamComplete,
  toolStates = {},
}) => {
  const theme = useTheme();
  const { content } = message.message;
  const thinkingSymbol = theme.symbols?.thinking || theme.symbols.aiPrefix || '…';
  const toolOutputSymbol = theme.symbols.toolOutput || '└';

  const [completedBlocks, setCompletedBlocks] = React.useState(0);

  const handleBlockComplete = () => {
    const newCompleted = completedBlocks + 1;
    setCompletedBlocks(newCompleted);

    // 如果所有块都完成了，触发回调
    if (newCompleted >= content.length && onStreamComplete) {
      onStreamComplete();
    }
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      {content.map((item: any, index: number) => {
        // 只显示已完成的块和当前正在流式的块
        const shouldShow = index <= completedBlocks;
        if (!shouldShow) return null;

        const isCurrentBlock = index === completedBlocks;

        if (isThinkingContent(item)) {
          if (!showThinking) {
            if (isCurrentBlock && streamingEnabled) {
              setTimeout(handleBlockComplete, 0);
            }
            return null;
          }

          if (isCurrentBlock && streamingEnabled) {
            setTimeout(handleBlockComplete, 0);
          }

          return (
            <StatusLine
              key={index}
              status="active"
              color={theme.colors.dim}
              symbol={thinkingSymbol}
              marginBottom={1}
              label={<Text dimColor>{item.thinking}</Text>}
            />
          );
        }

        // 文本内容
        if (isTextContent(item)) {
          // 如果是 thinking，根据配置决定是否显示
          const text = item.text;

          return (
            <StatusLine
              key={index}
              marginBottom={1}
              label={
                isCurrentBlock && streamingEnabled ? (
                  <StreamingText
                    text={text}
                    speed={typingSpeed}
                    enabled={streamingEnabled}
                    onComplete={handleBlockComplete}
                  />
                ) : (
                  <Markdown
                    theme={theme}
                    highlightCode={true}
                    maxWidth={theme.layout.maxWidth ?? 120}
                  >
                    {text}
                  </Markdown>
                )
              }
            />
          );
        }

        // 工具调用
        if (isToolUseContent(item)) {
          const { name, input } = item;

          // 如果是当前块且启用了流式，自动标记为完成
          if (isCurrentBlock && streamingEnabled) {
            setTimeout(handleBlockComplete, 100);
          }

          const sanitizedInput = sanitizeToolInput(input, {
            showContent: false,
          });
          const summary = summarizeToolInput(name, sanitizedInput);
          const details = showToolDetails ? extractToolDetailLines(sanitizedInput) : [];
          const toolState = toolStates[item.id];
          const status = toolState?.status ?? 'pending';
          const isError = status === 'error';
          const isPending = status === 'pending';
          const displayText = summary ? `${name}(${summary})` : name;
          const tone = isError ? 'error' : isPending ? 'active' : 'success';

          return (
            <React.Fragment key={index}>
              <StatusLine
                status={tone}
                spinner={isPending}
                marginBottom={details.length > 0 ? 0 : 1}
                label={<Text color={isError ? theme.colors.error : theme.colors.text}>{displayText}</Text>}
              />

              {details.map((detail: string, detailIndex: number) => (
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
