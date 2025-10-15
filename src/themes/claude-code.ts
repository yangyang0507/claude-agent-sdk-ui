/**
 * Claude Code 主题配置
 * 模拟 Claude Code CLI 的视觉风格
 * 特点:极简、高信息密度、使用特殊符号
 */

import type { Theme } from '../types/theme.js';

export const claudeCodeTheme: Theme = {
  name: 'claude-code',

  colors: {
    primary: '#4A9EFF', // 亮蓝色 - Claude 品牌色
    secondary: '#9B87F5', // 紫色 - 副标题
    success: '#52C77A', // 绿色 - 成功消息
    error: '#FF6B6B', // 红色 - 错误消息
    warning: '#FFB84D', // 橙黄色 - 警告消息
    info: '#4ECDC4', // 青色 - 信息消息
    text: '#E8E8E8', // 浅灰色 - 常规文本
    dim: '#7A7A7A', // 暗灰色 - 次要信息
    background: '#1E1E1E', // 深色背景
    highlight: '#FF9F5A', // 橙色 - 高亮
  },

  symbols: {
    success: '✅',
    error: '❌',
    warning: '⚠',
    info: 'ℹ',
    pending: '⏺',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    bullet: '●',
    arrow: '→',
    thinking: '💭',
    tool: '🔧',
    aiPrefix: '⏺', // Claude Code 特有的圆点符号
    userPrefix: '>',
    toolOutput: '└', // 树状输出符号
    expandable: '…', // 折叠展开提示
  },

  borders: {
    style: 'round',
    color: '#4A9EFF',
  },

  layout: {
    indent: 2,
    lineSpacing: 0, // Claude Code 使用紧凑间距
    componentSpacing: 1, // 组件之间的间距也较小
    maxWidth: 120,
  },
};
