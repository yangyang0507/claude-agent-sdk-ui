/**
 * useCommandMode Hook
 * 提供基于命令模式的快捷键切换与提示
 */

import React from 'react';
import { useInput } from 'ink';
import type { RendererOptions } from '../types/renderer.js';

export interface CommandModeState {
  /** 应用后的渲染配置 */
  options: Required<RendererOptions>;
  /** 工具输出预览行数（用于折叠/展开） */
  toolOutputPreviewLines?: number;
  /** 是否进入命令模式 */
  commandMode: boolean;
  /** 是否显示帮助面板 */
  showHelp: boolean;
  /** 命令反馈文本 */
  feedback: string | null;
}

const COMMAND_TIMEOUT_MS = 1500;
const TOOL_OUTPUT_PREVIEW_LINES = 8;

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export function useCommandMode(options: Required<RendererOptions>): CommandModeState {
  const [overrides, setOverrides] = React.useState<Partial<RendererOptions>>({});
  const [toolOutputCollapsed, setToolOutputCollapsed] = React.useState(false);
  const [commandMode, setCommandMode] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const feedbackTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const commandTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const enableHotkeys = (options.enableHotkeys ?? true) && isInteractive();

  const effectiveOptions = React.useMemo(
    () => ({
      ...options,
      ...overrides,
    }),
    [options, overrides]
  );

  const toolOutputPreviewLines = toolOutputCollapsed ? TOOL_OUTPUT_PREVIEW_LINES : undefined;

  const clearFeedbackTimer = () => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const pushFeedback = (text: string) => {
    clearFeedbackTimer();
    setFeedback(text);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  const clearCommandTimer = () => {
    if (commandTimerRef.current) {
      clearTimeout(commandTimerRef.current);
      commandTimerRef.current = null;
    }
  };

  const exitCommandMode = React.useCallback(() => {
    clearCommandTimer();
    setCommandMode(false);
  }, []);

  const toggleOption = React.useCallback(
    (key: keyof RendererOptions, label: string) => {
      setOverrides((prev) => {
        const current = prev[key] ?? options[key];
        const nextValue = !current;
        pushFeedback(`${label}: ${nextValue ? 'ON' : 'OFF'}`);
        return {
          ...prev,
          [key]: nextValue as RendererOptions[typeof key],
        };
      });
    },
    [options]
  );

  const toggleToolOutput = React.useCallback(() => {
    setToolOutputCollapsed((prev) => {
      const next = !prev;
      pushFeedback(`Tool output: ${next ? 'COLLAPSED' : 'EXPANDED'}`);
      return next;
    });
  }, []);

  useInput(
    (input, key) => {
      if (!enableHotkeys) return;

      if (commandMode) {
        if (key.escape) {
          exitCommandMode();
          return;
        }

        const normalized = input.trim().toLowerCase();
        if (!normalized) {
          return;
        }

        switch (normalized) {
          case '\\':
            exitCommandMode();
            return;
          case '?':
          case 'h':
            setShowHelp((prev) => !prev);
            exitCommandMode();
            return;
          case 't':
            toggleOption('showThinking', 'Thinking');
            exitCommandMode();
            return;
          case 'd':
            toggleOption('showToolDetails', 'Tool details');
            exitCommandMode();
            return;
          case 's':
            toggleOption('showSessionInfo', 'Session info');
            exitCommandMode();
            return;
          case 'f':
            toggleOption('showFinalResult', 'Final result');
            exitCommandMode();
            return;
          case 'e':
            toggleOption('showExecutionStats', 'Execution stats');
            exitCommandMode();
            return;
          case 'u':
            toggleOption('showTokenUsage', 'Token usage');
            exitCommandMode();
            return;
          case 'm':
            toggleOption('showTimestamps', 'Timestamps');
            exitCommandMode();
            return;
          case 'c':
            toggleToolOutput();
            exitCommandMode();
            return;
          default:
            pushFeedback(`Unknown command: ${normalized}`);
            exitCommandMode();
        }

        return;
      }

      if (input === '\\') {
        clearCommandTimer();
        setCommandMode(true);
        commandTimerRef.current = setTimeout(() => {
          setCommandMode(false);
        }, COMMAND_TIMEOUT_MS);
      }
    },
    {
      isActive: enableHotkeys,
    }
  );

  React.useEffect(() => {
    return () => {
      clearFeedbackTimer();
      clearCommandTimer();
    };
  }, []);

  return {
    options: effectiveOptions,
    toolOutputPreviewLines,
    commandMode,
    showHelp,
    feedback,
  };
}
