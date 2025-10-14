/**
 * StreamingAssistantMessage 组件 - 流式显示 Assistant 消息
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKAssistantMessage } from '@anthropic-ai/claude-agent-sdk';
import { useTheme } from '../../hooks/use-theme.js';
import { StreamingText } from '../ui/streaming-text.js';
import { InfoBadge } from '../ui/badge.js';
import { Markdown } from '../ui/markdown.js';
import { isTextContent, isToolUseContent } from '../../types/messages.js';
import { sanitizeToolInput, summarizeToolInput, extractToolDetailLines, formatToolLabel } from '../../utils/tools.js';

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
}) => {
  const theme = useTheme();
  const { content } = message.message;

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

        // 文本内容
        if (isTextContent(item)) {
          // 如果是 thinking，根据配置决定是否显示
          if ('thinking' in item && !showThinking) {
            // 跳过 thinking，直接标记为完成
            if (isCurrentBlock && streamingEnabled) {
              setTimeout(handleBlockComplete, 0);
            }
            return null;
          }

          const text = item.text;

          return (
            <Box key={index} flexDirection="column">
              {isCurrentBlock && streamingEnabled ? (
                <StreamingText
                  text={text}
                  speed={typingSpeed}
                  enabled={streamingEnabled}
                  onComplete={handleBlockComplete}
                />
              ) : (
                <Markdown theme={theme} highlightCode={true} maxWidth={120}>
                  {text}
                </Markdown>
              )}
            </Box>
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

          return (
            <Box key={index} flexDirection="column" marginBottom={1}>
              <InfoBadge>{formatToolLabel(name)}</InfoBadge>
              {summary && <Text dimColor> {summary}</Text>}

              {/* 工具参数详情 */}
              {details.length > 0 && (
                <Box flexDirection="column" marginLeft={2}>
                  {details.map((detail: string, i: number) => (
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
