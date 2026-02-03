import React from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { RendererOptions } from '../src/types/renderer.js';
import { ThemeProvider } from '../src/hooks/use-theme.js';
import { AppLayoutProxy } from '../src/components/proxy/app-layout-proxy.js';
import { MessageRouter } from '../src/renderer/message-router.js';
import { deriveToolExecutionState } from '../src/utils/tool-states.js';
import { normalizeOptions } from '../src/renderer/options.js';
import { getTheme } from '../src/themes/index.js';
import { cardTheme } from './theme-templates/card-theme.js';
import { minimalTheme } from './theme-templates/minimal-theme.js';
import { TimestampLine } from '../src/components/ui/timestamp-line.js';
import { formatTimestamp } from '../src/utils/time.js';

const THEME_ORDER = ['claude-code', 'droid', 'card', 'minimal'] as const;
const TOOL_OUTPUT_PREVIEW_LINES = 8;

const BASE_OPTIONS: RendererOptions = {
  theme: 'claude-code',
  showThinking: true,
  showToolDetails: true,
  showToolContent: false,
  showSessionInfo: true,
  showFinalResult: true,
  showExecutionStats: true,
  showTokenUsage: true,
  showTimestamps: true,
  codeHighlight: true,
  maxOutputLines: 200,
  enableHotkeys: false,
};

const SAMPLE_MESSAGES: SDKMessage[] = (() => {
  const sessionId = 'preview-session-123';
  const now = Date.now();

  return [
    {
      type: 'system',
      subtype: 'init',
      session_id: sessionId,
      uuid: '00000000-0000-0000-0000-000000000001',
      timestamp: now - 8000,
      cwd: '/Users/demo/project',
      tools: ['Read', 'Write', 'Grep', 'Glob'],
      mcp_servers: [{ name: 'local-mcp', status: 'connected' }],
      model: 'claude-3.5-sonnet',
      permissionMode: 'ask',
      slash_commands: ['help', 'compact'],
      output_style: 'default',
      apiKeySource: 'user',
      agents: ['planner'],
    },
    {
      type: 'assistant',
      session_id: sessionId,
      uuid: '00000000-0000-0000-0000-000000000002',
      timestamp: now - 6000,
      message: {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'Here is a quick overview:\n\n- Project summary\n- Key files\n- Next actions',
          },
          {
            type: 'thinking',
            thinking: 'We should inspect the tree and summarize the important files.',
          },
          {
            type: 'tool_use',
            id: 'tool-1',
            name: 'Read',
            input: { file_path: 'src/index.ts' },
          },
        ],
      },
    },
    {
      type: 'user',
      session_id: sessionId,
      uuid: '00000000-0000-0000-0000-000000000003',
      timestamp: now - 5000,
      message: {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: 'tool-1',
            content: 'export function renderQuery(...) { /* ... */ }\nexport function renderQueryStreaming(...) { /* ... */ }',
            is_error: false,
          },
        ],
      },
    },
    {
      type: 'assistant',
      session_id: sessionId,
      uuid: '00000000-0000-0000-0000-000000000004',
      timestamp: now - 3000,
      message: {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'Summary:\n\n```ts\nexport async function renderQuery(...) {\n  // streams messages\n}\n```',
          },
        ],
      },
    },
    {
      type: 'result',
      subtype: 'success',
      session_id: sessionId,
      uuid: '00000000-0000-0000-0000-000000000005',
      duration_ms: 12450,
      duration_api_ms: 12000,
      is_error: false,
      num_turns: 4,
      result: 'All tasks complete. Review the summary above.',
      total_cost_usd: 0.0123,
      usage: {
        input_tokens: 1324,
        output_tokens: 487,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
      },
      modelUsage: {},
      permission_denials: [],
    },
  ] as SDKMessage[];
})();

const ThemePreviewApp: React.FC = () => {
  const { exit } = useApp();
  const [themeIndex, setThemeIndex] = React.useState(0);
  const [options, setOptions] = React.useState<RendererOptions>(BASE_OPTIONS);
  const [toolOutputCollapsed, setToolOutputCollapsed] = React.useState(false);

  const themeName = THEME_ORDER[themeIndex % THEME_ORDER.length];
  const themeMap = {
    card: cardTheme,
    minimal: minimalTheme,
  } as const;
  const resolvedTheme = themeName in themeMap
    ? themeMap[themeName as keyof typeof themeMap]
    : getTheme(themeName);
  const effectiveOptions = normalizeOptions({
    ...options,
    theme: resolvedTheme.name,
  });
  const toolStates = React.useMemo(
    () => deriveToolExecutionState(SAMPLE_MESSAGES),
    []
  );
  const toolOutputPreviewLines = toolOutputCollapsed ? TOOL_OUTPUT_PREVIEW_LINES : undefined;

  useInput((input, key) => {
    if (key.leftArrow) {
      setThemeIndex((prev) => (prev - 1 + THEME_ORDER.length) % THEME_ORDER.length);
      return;
    }
    if (key.rightArrow) {
      setThemeIndex((prev) => (prev + 1) % THEME_ORDER.length);
      return;
    }
    if (input === 'q') {
      exit();
      return;
    }

    switch (input) {
      case 't':
        setOptions((prev) => ({ ...prev, showThinking: !prev.showThinking }));
        break;
      case 'd':
        setOptions((prev) => ({ ...prev, showToolDetails: !prev.showToolDetails }));
        break;
      case 'c':
        setToolOutputCollapsed((prev) => !prev);
        break;
      case 'm':
        setOptions((prev) => ({ ...prev, codeHighlight: !prev.codeHighlight }));
        break;
      case 's':
        setOptions((prev) => ({ ...prev, showSessionInfo: !prev.showSessionInfo }));
        break;
      case 'f':
        setOptions((prev) => ({ ...prev, showFinalResult: !prev.showFinalResult }));
        break;
      case 'e':
        setOptions((prev) => ({ ...prev, showExecutionStats: !prev.showExecutionStats }));
        break;
      case 'u':
        setOptions((prev) => ({ ...prev, showTokenUsage: !prev.showTokenUsage }));
        break;
      case 'p':
        setOptions((prev) => ({ ...prev, showTimestamps: !prev.showTimestamps }));
        break;
      default:
        break;
    }
  });

  return (
    <ThemeProvider theme={resolvedTheme}>
      <Box flexDirection="column">
        <Box flexDirection="column" marginBottom={1}>
          <Text>
            Theme Preview (◀/▶ to switch, q to quit)
          </Text>
          <Text>
            Theme: {resolvedTheme.name}
          </Text>
          <Text dimColor>
            t Thinking | d Tool details | c Collapse tool output | m Code highlight
          </Text>
          <Text dimColor>
            s Session | f Final | e Stats | u Tokens | p Timestamps
          </Text>
        </Box>

        <AppLayoutProxy messages={SAMPLE_MESSAGES} isStreaming={false}>
          {SAMPLE_MESSAGES.map((message, index) => {
            const timestampLabel = effectiveOptions.showTimestamps
              ? formatMessageTimestamp(message)
              : null;

            return (
              <React.Fragment key={index}>
                {timestampLabel && <TimestampLine timestamp={timestampLabel} marginBottom={0} />}
                <MessageRouter
                  message={message}
                  options={effectiveOptions}
                  toolStates={toolStates}
                  toolOutputPreviewLines={toolOutputPreviewLines}
                />
              </React.Fragment>
            );
          })}
        </AppLayoutProxy>
      </Box>
    </ThemeProvider>
  );
};

function formatMessageTimestamp(message: SDKMessage): string | null {
  const rawTimestamp = (message as { timestamp?: string | number | Date }).timestamp;
  if (!rawTimestamp) {
    return null;
  }
  const date = rawTimestamp instanceof Date ? rawTimestamp : new Date(rawTimestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return formatTimestamp(date);
}

render(<ThemePreviewApp />);
