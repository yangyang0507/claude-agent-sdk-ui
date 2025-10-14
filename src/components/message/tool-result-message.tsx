/**
 * ToolResultMessage 组件 - 显示工具执行结果
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import { isToolResultContent } from '../../types/messages.js';
import { useTheme } from '../../hooks/use-theme.js';
import { truncateOutput } from '../../utils/string.js';

export interface ToolResultMessageProps {
  message: SDKUserMessage;
  maxOutputLines?: number;
}

/**
 * 工具结果消息组件
 *
 * 显示工具执行的输出结果，支持成功和错误状态
 *
 * @example
 * ```tsx
 * <ToolResultMessage message={userMessage} maxOutputLines={100} />
 * ```
 */
export const ToolResultMessage: React.FC<ToolResultMessageProps> = ({
  message,
  maxOutputLines = 100,
}) => {
  const theme = useTheme();
  const { content } = message.message;

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

        // 箭头符号和颜色
        const arrow = '↳';
        const arrowColor = is_error ? theme.colors.error : theme.colors.info;

        return (
          <Box key={index} flexDirection="column" marginBottom={1}>
            {/* 第一行带箭头 */}
            <Box>
              <Text color={arrowColor}>{arrow} </Text>
              <Text color={is_error ? theme.colors.error : undefined} dimColor={!is_error}>
                {lines[0]}
              </Text>
            </Box>

            {/* 后续行缩进显示 */}
            {lines.slice(1).map((line, lineIndex) => (
              <Box key={lineIndex} marginLeft={2}>
                <Text color={is_error ? theme.colors.error : undefined} dimColor={!is_error}>
                  {line}
                </Text>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
