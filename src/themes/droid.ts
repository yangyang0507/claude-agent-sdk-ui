/**
 * Droid 主题配置
 * 模拟 Droid CLI 的视觉风格
 * 特点:结构化、视觉层次清晰、使用特殊几何符号
 */

import type { Theme } from '../types/theme.js';

export const droidTheme: Theme = {
  name: 'droid',

  colors: {
    primary: '#00D9FF', // 青色 - Droid 品牌色
    secondary: '#B794F6', // 紫色 - 副标题
    success: '#00E676', // 亮绿色 - 成功消息
    error: '#FF5252', // 亮红色 - 错误消息
    warning: '#FFD740', // 亮黄色 - 警告消息
    info: '#40C4FF', // 亮蓝色 - 信息消息
    text: '#F5F5F5', // 白色 - 常规文本
    dim: '#90A4AE', // 蓝灰色 - 次要信息
    background: '#0D1117', // 极深色背景
    highlight: '#FFA726', // 橙色 - 高亮
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
    thinking: '💭',
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
};
