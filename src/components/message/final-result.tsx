/**
 * FinalResult 组件 - 显示最终执行结果
 */

import React from 'react';
import { Box } from 'ink';
import type { SDKResultMessage } from '@anthropic-ai/claude-agent-sdk';
import { Divider } from '../ui/divider.js';
import { SuccessBadge, InfoBadge, WarningBadge } from '../ui/badge.js';
import { isResultSuccessMessage } from '../../types/messages.js';
import { useTheme } from '../../hooks/use-theme.js';
import { formatDuration } from '../../utils/time.js';
import { Markdown } from '../ui/markdown.js';
import { Table } from '../ui/table.js';

export interface FinalResultProps {
  message: SDKResultMessage;
  showTokenUsage?: boolean;
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
  showTokenUsage = false,
}) => {
  const theme = useTheme();
  const isSuccess = isResultSuccessMessage(message);

  // 构建统计数据
  const statsData = [
    { Metric: 'Status', Value: isSuccess ? '✅ Success' : '❌ Failed' },
    { Metric: 'Duration', Value: formatDuration(message.duration_ms) },
    { Metric: 'Turns', Value: message.num_turns.toString() },
    { Metric: 'Total Cost', Value: `$${message.total_cost_usd.toFixed(4)}` },
  ];

  const tokenData = [
    {
      Type: 'Input Tokens',
      Count: message.usage.input_tokens.toLocaleString(),
    },
    {
      Type: 'Output Tokens',
      Count: message.usage.output_tokens.toLocaleString(),
    },
  ];

  if (message.usage.cache_read_input_tokens) {
    tokenData.push({
      Type: 'Cache Read',
      Count: message.usage.cache_read_input_tokens.toLocaleString(),
    });
  }


  return (
    <Box flexDirection="column">
      {/* 最终结果文本 */}
      {isSuccess && 'result' in message && (
        <Box flexDirection="column" marginBottom={1}>
          <SuccessBadge>FINAL RESULT</SuccessBadge>
          <Box marginTop={1} flexDirection="column">
            <Markdown theme={theme} highlightCode={true} maxWidth={120}>
              {message.result}
            </Markdown>
          </Box>
        </Box>
      )}

      {/* 执行统计 */}
      <Box flexDirection="column" marginBottom={1}>
        <InfoBadge>EXECUTION STATS</InfoBadge>
        <Box marginTop={1}>
          <Table data={statsData} theme={theme} />
        </Box>
      </Box>

      {/* Token 使用信息（可选） */}
      {showTokenUsage && (
        <Box flexDirection="column" marginBottom={1}>
          <InfoBadge>TOKEN USAGE</InfoBadge>
          <Box marginTop={1}>
            <Table data={tokenData} theme={theme} />
          </Box>
        </Box>
      )}

      {/* 权限拒绝提示 */}
      {message.permission_denials.length > 0 && (
        <Box marginBottom={1}>
          <WarningBadge>
            {message.permission_denials.length} PERMISSION DENIALS
          </WarningBadge>
        </Box>
      )}
    </Box>
  );
};
