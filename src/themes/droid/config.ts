/**
 * Droid 主题配置
 * 模拟 Droid CLI 的视觉风格
 * 特点:结构化、视觉层次清晰、使用特殊几何符号
 */

import type { Theme } from '../../types/theme.js';
import { AssistantMessage } from './components/assistant-message.js';
import { StreamingAssistantMessage } from './components/streaming-assistant-message.js';
import { ToolResultMessage } from './components/tool-result-message.js';
import { SystemMessage } from './components/system-message.js';
import { FinalResult } from './components/final-result.js';
import { AppLayout } from './components/app-layout.js';

export const droidTheme: Theme = {
  name: 'droid',

  colors: {
    primary: '#FEB17F', // 橙色 - Droid 主色（工具标签、thinking）
    secondary: '#DA793C', // 亮橙色 - 副标题和边框
    success: '#A5E075', // 亮绿色 - 成功消息
    error: '#FF616E', // 亮红色 - 错误消息
    warning: '#FFD740', // 亮黄色 - 警告消息
    info: '#DA793C', // 橙色 - "进行中"状态（active/streaming/thinking）
    text: '#ABB2BF', // 浅灰色 - 常规文本
    dim: '#A49C97', // 暗灰色 - 次要信息
    background: '#282C34', // 极深色背景
    highlight: '#DA793C', // 橙色 - 高亮（与主色一致）
  },

  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '○',
    spinner: ['◐', '◓', '◑', '◒'], // 圆形旋转动画
    bullet: '●',
    arrow: '↳',
    thinking: '…',
    tool: '⚙',
    aiPrefix: '⛬', // Droid 特有的六芒星符号
    userPrefix: '>', // 用户输入使用简单的 >
    toolOutput: '↳', // 使用箭头表示输出
    expandable: '▼', // 展开/折叠符号
  },

  borders: {
    style: 'round',
    color: '#00D9FF',
  },

  layout: {
    indent: 3, // Droid 使用稍大的缩进
    lineSpacing: 1,
    componentSpacing: 2,
    maxWidth: 100,
  },

  components: {
    assistantMessage: AssistantMessage,
    streamingAssistantMessage: StreamingAssistantMessage,
    toolResultMessage: ToolResultMessage,
    systemMessage: SystemMessage,
    finalResult: FinalResult,
    appLayout: AppLayout,
  },
};
