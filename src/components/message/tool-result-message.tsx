/**
 * ToolResultMessage 组件 - 显示工具执行结果
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import { isToolResultContent } from '../../types/messages.js';
import { useTheme } from '../../hooks/use-theme.js';
import { truncateOutput } from '../../utils/string.js';
import { StatusLine } from '../ui/status-line.js';
import type { StatusTone } from '../ui/status-line.js';

export interface ToolResultMessageProps {
  message: SDKUserMessage;
  maxOutputLines?: number;
  previewLines?: number;
}

/**
 * 工具结果消息组件
 *
 * 显示工具执行的输出结果，支持成功和错误状态
 *
 * @example
 * ```tsx
 * <ToolResultMessage message={userMessage} maxOutputLines={100} previewLines={3} />
 * ```
 */
export const ToolResultMessage: React.FC<ToolResultMessageProps> = ({
  message,
  maxOutputLines = 100,
  previewLines,
}) => {
  const theme = useTheme();
  const { content } = message.message;
  const toolOutputSymbol = theme.symbols.toolOutput || '⎿';

  return (
    <Box flexDirection="column">
      {content.map((item: any, index: number) => {
        if (!isToolResultContent(item)) return null;

        const { content: output, is_error } = item;

        // 截断输出
        const truncated = maxOutputLines ? truncateOutput(output, maxOutputLines) : output;

        // 分割为行
        const lines = truncated ? truncated.split('\n') : [];

        // 如果没有输出，显示默认文本
        if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
          lines.length = 0;
          lines.push(is_error ? 'No output (error)' : 'No output');
        }

        const status: StatusTone = is_error ? 'error' : 'default';
        const indicatorColor = is_error ? theme.colors.error : theme.colors.dim;
        const textColor = is_error ? theme.colors.error : theme.colors.dim;

        // 判断是否需要折叠（只有配置了 previewLines 才折叠）
        const shouldCollapse = previewLines !== undefined && lines.length > previewLines;
        const visibleLines = shouldCollapse ? lines.slice(0, previewLines) : lines;
        const hiddenCount = shouldCollapse ? lines.length - previewLines! : 0;

        return (
          <Box key={index} flexDirection="column" marginBottom={1}>
            <StatusLine
              indentLevel={1}
              status={status as any}
              color={indicatorColor}
              symbol={toolOutputSymbol}
              label={
                <Box flexDirection="column">
                  {visibleLines.map((line, lineIndex) => (
                    <Text
                      key={lineIndex}
                      color={textColor}
                      dimColor={!is_error}
                    >
                      {lineIndex === 0 ? ' ' : '   '}{line}
                    </Text>
                  ))}
                  {shouldCollapse && (
                    <Text color={theme.colors.dim} dimColor>
                      {'   '}… +{hiddenCount} lines
                    </Text>
                  )}
                </Box>
              }
            />
          </Box>
        );
      })}
    </Box>
  );
};
