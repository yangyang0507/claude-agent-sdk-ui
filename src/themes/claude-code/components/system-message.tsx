/**
 * SystemMessage 组件 - 显示会话初始化信息
 */

import React from 'react';
import { Box, Text } from 'ink';
import type { SDKSystemMessage } from '@anthropic-ai/claude-agent-sdk';
import { Box as CustomBox } from '../../../components/ui/box.js';
import { useTheme } from '../../../hooks/use-theme.js';

export interface SystemMessageProps {
  message: SDKSystemMessage;
  /** 是否显示会话信息（默认: true） */
  showSessionInfo?: boolean;
}

/**
 * 系统初始化消息组件
 *
 * 显示会话信息、模型、工作目录和可用工具列表
 *
 * @example
 * ```tsx
 * <SystemMessage message={systemMessage} />
 * ```
 */
export const SystemMessage: React.FC<SystemMessageProps> = ({ 
  message,
  showSessionInfo = true,
}) => {
  const theme = useTheme();

  // 如果不包含 tools 字段，说明不是初始化消息
  if (!('tools' in message)) return null;

  // 如果配置不显示，直接返回 null
  if (!showSessionInfo) return null;

  return (
    <Box flexDirection="column">
      {/* 会话信息盒子 */}
      <CustomBox
        borderStyle="round"
        borderColor={theme.colors.primary}
        title="📋 Session Info"
        padding={1}
        marginBottom={1}
        marginRight={1}
      >
        <Box flexDirection="column">
          {/* Session ID */}
          <Box>
            <Text dimColor>Session ID: </Text>
            <Text color={theme.colors.info}>{message.session_id.slice(0, 8)}</Text>
          </Box>

          {/* Model */}
          <Box>
            <Text dimColor>Model: </Text>
            <Text color={theme.colors.primary}>{message.model}</Text>
          </Box>

          {/* Working Directory */}
          <Box>
            <Text dimColor>Working Dir: </Text>
            <Text dimColor>{message.cwd}</Text>
          </Box>

          {/* Permission Mode */}
          <Box>
            <Text dimColor>Permission: </Text>
            <Text color={theme.colors.warning}>{message.permissionMode.toUpperCase()}</Text>
          </Box>

          {/* 工具列表 */}
          {message.tools.length > 0 && (
            <Box flexDirection="column">
              <Box>
                <Text dimColor>Tools: </Text>
                <Text color={theme.colors.success}>
                  {message.tools.length} available
                </Text>
              </Box>
              <Box marginLeft={1}>
                <Text dimColor>⎿ </Text>
                <Text dimColor>{message.tools.join('  •  ')}</Text>
              </Box>
            </Box>
          )}
        </Box>
      </CustomBox>
    </Box>
  );
};
