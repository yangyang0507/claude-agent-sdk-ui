/**
 * 渲染器配置类型定义
 */

import type { Theme, ThemeInput } from './theme.js';

/**
 * Token 使用统计 (简化版,用于内部统计)
 */
export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

/**
 * 分隔线样式
 */
export type DividerStyle = 'light' | 'heavy' | 'double' | 'dashed';

/**
 * 渲染器配置选项
 */
export interface RendererOptions {
  /** 主题配置 */
  theme?: ThemeInput;

  /** 是否显示时间戳 */
  showTimestamps?: boolean;

  /** 是否显示会话信息（Session Info）（默认: true） */
  showSessionInfo?: boolean;

  /** 是否显示最终结果（Final Result）（默认: true） */
  showFinalResult?: boolean;

  /** 是否显示执行统计（Execution Stats）（默认: false） */
  showExecutionStats?: boolean;

  /** 是否显示 Token 使用统计（Token Usage）（默认: false） */
  showTokenUsage?: boolean;

  /** 紧凑模式 - 减少空白行 */
  compact?: boolean;

  /** 工具结果的最大输出行数 */
  maxOutputLines?: number;

  /** 是否启用代码高亮 */
  codeHighlight?: boolean;

  /** 是否启用流式渲染 */
  streaming?: boolean;

  /** 打字机效果(仅在流式模式下) */
  typingEffect?: boolean;

  /** 打字速度(毫秒/字符) */
  typingSpeed?: number;

  /** 是否显示思考过程 */
  showThinking?: boolean;

  /** 是否显示工具使用详情 */
  showToolDetails?: boolean;

  /** 是否显示工具参数中的 content 字段 */
  showToolContent?: boolean;

  /** 终端最大宽度 */
  maxWidth?: number;
}

/**
 * 会话统计信息
 */
export interface SessionStats {
  /** 执行时长(毫秒) */
  duration: number;

  /** API 调用时长(毫秒) */
  apiDuration?: number;

  /** 对话轮次 */
  turns: number;

  /** Token 使用统计 */
  tokens: TokenUsage;

  /** 总成本(USD) */
  cost: number;

  /** 是否成功 */
  success: boolean;

  /** 错误信息 */
  error?: string;
}

/**
 * 工具调用信息
 */
export interface ToolCallInfo {
  /** 工具调用 ID */
  id: string;

  /** 工具名称 */
  name: string;

  /** 工具输入参数（会根据配置进行脱敏处理） */
  input: Record<string, unknown>;

  /** 输入概要描述 */
  summary?: string;

  /** 开始时间 */
  startTime: number;

  /** 结束时间 */
  endTime?: number;

  /** 是否成功 */
  success?: boolean;

  /** 输出结果 */
  output?: string;

  /** 是否为错误 */
  isError?: boolean;
}

/**
 * 渲染器状态
 */
export interface RendererState {
  /** 当前会话 ID */
  sessionId: string | null;

  /** 当前对话轮次 */
  currentTurn: number;

  /** 活跃的工具调用 */
  activeToolCalls: Map<string, ToolCallInfo>;

  /** 总 Token 统计 */
  totalTokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheCreation: number;
  };

  /** 总成本 */
  totalCost: number;

  /** 开始时间 */
  startTime: number | null;

  /** 结束时间 */
  endTime: number | null;

  /** 已处理的消息数 */
  processedMessages: number;
}

/**
 * 盒子配置
 */
export interface BoxOptions {
  /** 标题 */
  title?: string;

  /** 边框样式 */
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'none';

  /** 边框颜色 */
  borderColor?: string;

  /** 内边距 */
  padding?: number;

  /** 最小宽度 */
  minWidth?: number;

  /** 最大宽度 */
  maxWidth?: number;

  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
}


/**
 * 代码高亮配置
 */
export interface CodeHighlightOptions {
  /** 语言 */
  language?: string;

  /** 主题 */
  theme?: Theme;

  /** 是否显示行号 */
  lineNumbers?: boolean;

  /** 起始行号 */
  startLine?: number;
}
