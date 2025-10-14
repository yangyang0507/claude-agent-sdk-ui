/**
 * 浅色主题配置
 * 基于 One Light 配色方案
 */

import type { Theme } from '../types/theme.js';

export const lightTheme: Theme = {
  name: 'light',

  colors: {
    primary: '#0184BC', // 蓝色 - 用于标题和重要信息
    secondary: '#A626A4', // 紫色 - 用于副标题
    success: '#50A14F', // 绿色 - 用于成功消息
    error: '#E45649', // 红色 - 用于错误消息
    warning: '#C18401', // 黄色 - 用于警告消息
    info: '#0997B3', // 青色 - 用于信息消息
    text: '#383A42', // 深灰色 - 常规文本
    dim: '#A0A1A7', // 灰色 - 次要信息
    background: '#FAFAFA', // 浅色背景
    highlight: '#D75F00', // 橙色 - 高亮
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
    color: '#A0A1A7',
  },

  layout: {
    indent: 2,
    lineSpacing: 1,
    componentSpacing: 2,
  },
};
