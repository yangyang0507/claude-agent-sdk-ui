/**
 * 渲染器配置测试
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeOptions,
  DEFAULT_RENDERER_OPTIONS,
  STREAMING_RENDERER_DEFAULTS,
} from '../../src/renderer/options.js';

describe('normalizeOptions', () => {
  it('应该返回完整的默认配置', () => {
    const options = normalizeOptions();

    expect(options.theme).toBe('claude-code');
    expect(options.showTimestamps).toBe(false);
    expect(options.showSessionInfo).toBe(true);
    expect(options.showFinalResult).toBe(true);
    expect(options.showExecutionStats).toBe(false);
    expect(options.showTokenUsage).toBe(false);
    expect(options.compact).toBe(false);
    expect(options.maxOutputLines).toBe(100);
    expect(options.codeHighlight).toBe(true);
    expect(options.streaming).toBe(false);
    expect(options.typingEffect).toBe(false);
    expect(options.typingSpeed).toBe(20);
    expect(options.showThinking).toBe(false);
    expect(options.showToolDetails).toBe(true);
    expect(options.showToolContent).toBe(false);
    expect(options.maxWidth).toBe(120);
    expect(options.logging).toEqual({ enabled: false });
  });

  it('应该使用用户提供的配置覆盖默认值', () => {
    const options = normalizeOptions({
      theme: 'droid',
      showTimestamps: true,
      maxOutputLines: 50,
    });

    expect(options.theme).toBe('droid');
    expect(options.showTimestamps).toBe(true);
    expect(options.maxOutputLines).toBe(50);
    // 未覆盖的配置应该使用默认值
    expect(options.showSessionInfo).toBe(true);
  });

  it('应该支持额外的默认值覆盖', () => {
    const options = normalizeOptions({}, STREAMING_RENDERER_DEFAULTS);

    expect(options.streaming).toBe(true);
    expect(options.typingEffect).toBe(true);
  });

  it('用户配置应该优先于额外默认值', () => {
    const options = normalizeOptions(
      { streaming: false },
      STREAMING_RENDERER_DEFAULTS
    );

    expect(options.streaming).toBe(false);
  });

  it('应该正确处理日志配置', () => {
    const options = normalizeOptions({
      logging: {
        enabled: true,
        logPath: './custom-logs',
        verbose: true,
      },
    });

    expect(options.logging.enabled).toBe(true);
    expect(options.logging.logPath).toBe('./custom-logs');
    expect(options.logging.verbose).toBe(true);
  });
});

describe('DEFAULT_RENDERER_OPTIONS', () => {
  it('应该包含所有必需的配置项', () => {
    const requiredKeys = [
      'theme',
      'showTimestamps',
      'showSessionInfo',
      'showFinalResult',
      'showExecutionStats',
      'showTokenUsage',
      'compact',
      'maxOutputLines',
      'codeHighlight',
      'streaming',
      'typingEffect',
      'typingSpeed',
      'showThinking',
      'showToolDetails',
      'showToolContent',
      'maxWidth',
      'logging',
    ];

    for (const key of requiredKeys) {
      expect(DEFAULT_RENDERER_OPTIONS).toHaveProperty(key);
    }
  });
});

describe('STREAMING_RENDERER_DEFAULTS', () => {
  it('应该启用流式渲染选项', () => {
    expect(STREAMING_RENDERER_DEFAULTS.streaming).toBe(true);
    expect(STREAMING_RENDERER_DEFAULTS.typingEffect).toBe(true);
  });
});
