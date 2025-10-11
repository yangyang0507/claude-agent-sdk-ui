/**
 * Core types for Claude Agent UI
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: string;
    dim: string;
  };
  symbols: {
    success: string;
    error: string;
    warning: string;
    info: string;
    pending: string;
    spinner: string[];
  };
  borders: {
    style: 'single' | 'double' | 'round' | 'bold' | 'none';
    color: string;
  };
}

export interface RenderOptions {
  // Display options
  theme?: 'dark' | 'light' | ThemeConfig;
  showTimestamps?: boolean;
  showTokenUsage?: boolean;
  showToolDetails?: boolean;
  compactMode?: boolean;

  // Streaming options
  streaming?: boolean;
  typingEffect?: boolean;
  typingSpeed?: number;

  // Interactive options
  interactive?: boolean;
  confirmActions?: boolean;

  // Formatting
  codeHighlight?: boolean;
  markdownRendering?: boolean;
  maxWidth?: number;

  // Custom renderers
  customRenderers?: {
    [toolName: string]: (data: any) => string;
  };

  // Callbacks
  onToolStart?: (tool: string) => void;
  onToolEnd?: (tool: string, result: any) => void;
  onError?: (error: Error) => void;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
  timestamp?: number;
}

export interface MessageContent {
  type: 'text' | 'tool_use' | 'tool_result' | 'thinking';
  text?: string;
  name?: string;
  input?: any;
  output?: any;
  error?: string;
  tool_use_id?: string;
}

export interface ToolUse {
  id: string;
  name: string;
  input: any;
  timestamp?: number;
}

export interface ToolResult {
  tool_use_id: string;
  output?: any;
  error?: string;
  timestamp?: number;
  duration?: number;
}
