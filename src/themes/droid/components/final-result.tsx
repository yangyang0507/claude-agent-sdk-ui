/**
 * FinalResult 组件 - 显示最终执行结果
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKResultMessage } from '@anthropic-ai/claude-agent-sdk';
import { Box as CustomBox } from '../../../components/ui/box.js';
import { isResultSuccessMessage } from '../../../types/messages.js';
import { useTheme } from '../../../hooks/use-theme.js';
import { formatDuration } from '../../../utils/time.js';
import { Markdown } from '../../../components/ui/markdown.js';

export interface FinalResultProps {
  message: SDKResultMessage;
  /** 是否显示最终结果（默认: true） */
  showFinalResult?: boolean;
  /** 是否显示执行统计（默认: false） */
  showExecutionStats?: boolean;
  /** 是否显示 Token 使用统计（默认: false） */
  showTokenUsage?: boolean;
  /** 是否启用代码高亮 */
  codeHighlight?: boolean;
}

/**
 * 最终结果组件
 *
 * 显示执行完成后的结果、统计信息和 token 使用情况
 *
 * @example
 * ```tsx
 * <FinalResult message={resultMessage} showTokenUsage={true} />
 * ```
 */
export const FinalResult: React.FC<FinalResultProps> = ({
  message,
  showFinalResult = false,
  showExecutionStats = false,
  showTokenUsage = false,
  codeHighlight = true,
}) => {
  const theme = useTheme();
  const isSuccess = isResultSuccessMessage(message);

  return (
    <Box flexDirection="column">
      {/* 最终结果文本 */}
      {showFinalResult && isSuccess && 'result' in message && (
        <CustomBox
          borderStyle="round"
          borderColor={theme.colors.success}
          title="✅ Final Result"
          padding={1}
          marginBottom={1}
          marginRight={1}
        >
          <Markdown theme={theme} highlightCode={codeHighlight} maxWidth={120}>
            {message.result}
          </Markdown>
        </CustomBox>
      )}

      {/* 执行统计 */}
      {showExecutionStats && (
        <CustomBox
        borderStyle="round"
        borderColor={theme.colors.info}
        title="📊 Execution Stats"
        padding={1}
        marginBottom={1}
        marginRight={1}
      >
        <Box flexDirection="column">
          <Box>
            <Text dimColor>Status: </Text>
            <Text color={isSuccess ? theme.colors.success : theme.colors.error}>
              {isSuccess ? '✅ Success' : '❌ Failed'}
            </Text>
          </Box>
          <Box>
            <Text dimColor>Duration: </Text>
            <Text color={theme.colors.primary}>{formatDuration(message.duration_ms)}</Text>
          </Box>
          <Box>
            <Text dimColor>Turns: </Text>
            <Text color={theme.colors.primary}>{message.num_turns}</Text>
          </Box>
          <Box>
            <Text dimColor>Total Cost: </Text>
            <Text color={theme.colors.warning}>${message.total_cost_usd.toFixed(4)}</Text>
          </Box>
        </Box>
      </CustomBox>
      )}

      {/* Token 使用信息（可选） */}
      {showTokenUsage && (
        <CustomBox
          borderStyle="round"
          borderColor={theme.colors.info}
          title="🔢 Token Usage"
          padding={1}
          marginBottom={1}
          marginRight={1}
        >
          <Box flexDirection="column">
            <Box>
              <Text dimColor>Input Tokens: </Text>
              <Text color={theme.colors.primary}>
                {message.usage.input_tokens.toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text dimColor>Output Tokens: </Text>
              <Text color={theme.colors.primary}>
                {message.usage.output_tokens.toLocaleString()}
              </Text>
            </Box>
            {message.usage.cache_read_input_tokens > 0 && (
              <Box>
                <Text dimColor>Cache Read: </Text>
                <Text color={theme.colors.success}>
                  {message.usage.cache_read_input_tokens.toLocaleString()}
                </Text>
              </Box>
            )}
          </Box>
        </CustomBox>
      )}

      {/* 权限拒绝提示 */}
      {message.permission_denials.length > 0 && (
        <CustomBox
          borderStyle="round"
          borderColor={theme.colors.warning}
          title="⚠️  Permission Denials"
          padding={1}
          marginBottom={1}
          marginRight={1}
        >
          <Text color={theme.colors.warning}>
            {message.permission_denials.length} tool(s) were denied permission
          </Text>
        </CustomBox>
      )}
    </Box>
  );
};
