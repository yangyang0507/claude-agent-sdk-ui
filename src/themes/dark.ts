/**
 * 深色主题配置
 * 基于 One Dark Pro 配色方案
 */

import type { Theme } from '../types/theme.js';

export const darkTheme: Theme = {
  name: 'dark',

  colors: {
    primary: '#61AFEF', // 亮蓝色 - 用于标题和重要信息
    secondary: '#C678DD', // 紫色 - 用于副标题
    success: '#98C379', // 绿色 - 用于成功消息
    error: '#E06C75', // 红色 - 用于错误消息
    warning: '#E5C07B', // 黄色 - 用于警告消息
    info: '#56B6C2', // 青色 - 用于信息消息
    text: '#ABB2BF', // 浅灰色 - 常规文本
    dim: '#5C6370', // 暗灰色 - 次要信息
    background: '#282C34', // 深色背景
    highlight: '#D19A66', // 橙色 - 高亮
  },

  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '○',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    bullet: '•',
    arrow: '→',
    thinking: '💭',
    tool: '🔧',
  },

  borders: {
    style: 'round',
    color: '#5C6370',
  },

  layout: {
    indent: 2,
    lineSpacing: 1,
    componentSpacing: 2,
  },
};
