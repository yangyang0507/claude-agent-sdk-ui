/**
 * 主题系统类型定义
 */

/**
 * 颜色配置
 */
export interface ThemeColors {
  /** 主色 - 用于标题、强调 */
  primary: string;
  /** 次要色 - 用于副标题 */
  secondary: string;
  /** 成功色 - 用于成功消息 */
  success: string;
  /** 错误色 - 用于错误消息 */
  error: string;
  /** 警告色 - 用于警告消息 */
  warning: string;
  /** 信息色 - 用于信息消息 */
  info: string;
  /** 文本色 - 常规文本 */
  text: string;
  /** 暗淡色 - 次要信息 */
  dim: string;
  /** 背景色 - 可选 */
  background?: string;
  /** 高亮色 - 代码高亮等 */
  highlight?: string;
}

/**
 * 符号配置
 */
export interface ThemeSymbols {
  /** 成功符号 */
  success: string;
  /** 错误符号 */
  error: string;
  /** 警告符号 */
  warning: string;
  /** 信息符号 */
  info: string;
  /** 等待符号 */
  pending: string;
  /** 加载动画符号 */
  spinner: string[];
  /** 列表项符号 */
  bullet: string;
  /** 箭头符号 */
  arrow: string;
  /** 思考符号 */
  thinking?: string;
  /** 工具符号 */
  tool?: string;
  /** 主前缀符号 (用于 AI 消息) */
  aiPrefix?: string;
  /** 用户输入前缀符号 */
  userPrefix?: string;
  /** 工具输出前缀符号 */
  toolOutput?: string;
  /** 折叠/展开符号 */
  expandable?: string;
}

/**
 * 边框样式
 */
export type BorderStyle = 'single' | 'double' | 'round' | 'bold' | 'none';

/**
 * 边框配置
 */
export interface ThemeBorders {
  /** 边框样式 */
  style: BorderStyle;
  /** 边框颜色 */
  color: string;
}

/**
 * 布局配置
 */
export interface ThemeLayout {
  /** 最大宽度(字符数) */
  maxWidth?: number;
  /** 缩进空格数 */
  indent: number;
  /** 行间距 */
  lineSpacing: number;
  /** 组件间距 */
  componentSpacing?: number;
}

/**
 * 主题配置
 */
export interface Theme {
  /** 主题名称 */
  name: string;
  /** 颜色配置 */
  colors: ThemeColors;
  /** 符号配置 */
  symbols: ThemeSymbols;
  /** 边框配置 */
  borders: ThemeBorders;
  /** 布局配置 */
  layout: ThemeLayout;
}

/**
 * 主题选项(用于创建自定义主题)
 */
export type ThemeOptions = Partial<Theme> & {
  name: string;
};

/**
 * 内置主题名称
 */
export type BuiltInTheme = 'claude-code' | 'droid';

/**
 * 主题或主题名称
 */
export type ThemeInput = Theme | BuiltInTheme;
