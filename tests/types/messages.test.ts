/**
 * 消息类型守卫测试
 */

import { describe, it, expect } from 'vitest';
import {
  isSystemMessage,
  isSystemInitMessage,
  isAssistantMessage,
  isUserMessage,
  isResultMessage,
  isResultSuccessMessage,
  isTextContent,
  isThinkingContent,
  isToolUseContent,
  isToolResultContent,
  isStreamEventMessage,
  isPartialAssistantMessage,
} from '../../src/types/messages.js';

describe('消息类型守卫', () => {
  describe('isSystemMessage', () => {
    it('应该识别 system 类型消息', () => {
      const message = { type: 'system', message: { content: 'test' } };
      expect(isSystemMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 system 类型消息', () => {
      const message = { type: 'assistant', message: { content: [] } };
      expect(isSystemMessage(message as any)).toBe(false);
    });
  });

  describe('isSystemInitMessage', () => {
    it('应该识别 system init 消息', () => {
      const message = { type: 'system', subtype: 'init', session_id: '123' };
      expect(isSystemInitMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 init 子类型的 system 消息', () => {
      const message = { type: 'system', subtype: 'other' };
      expect(isSystemInitMessage(message as any)).toBe(false);
    });

    it('应该拒绝没有 subtype 的 system 消息', () => {
      const message = { type: 'system' };
      expect(isSystemInitMessage(message as any)).toBe(false);
    });
  });

  describe('isAssistantMessage', () => {
    it('应该识别 assistant 类型消息', () => {
      const message = { type: 'assistant', message: { content: [] } };
      expect(isAssistantMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 assistant 类型消息', () => {
      const message = { type: 'user', message: { content: [] } };
      expect(isAssistantMessage(message as any)).toBe(false);
    });
  });

  describe('isUserMessage', () => {
    it('应该识别 user 类型消息', () => {
      const message = { type: 'user', message: { content: [] } };
      expect(isUserMessage(message as any)).toBe(true);
    });

    it('应该拒绝带有 isReplay 标记的消息', () => {
      const message = { type: 'user', message: { content: [] }, isReplay: true };
      expect(isUserMessage(message as any)).toBe(false);
    });

    it('应该拒绝非 user 类型消息', () => {
      const message = { type: 'assistant', message: { content: [] } };
      expect(isUserMessage(message as any)).toBe(false);
    });
  });

  describe('isResultMessage', () => {
    it('应该识别 result 类型消息', () => {
      const message = { type: 'result' };
      expect(isResultMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 result 类型消息', () => {
      const message = { type: 'assistant' };
      expect(isResultMessage(message as any)).toBe(false);
    });
  });

  describe('isResultSuccessMessage', () => {
    it('应该识别 result success 消息', () => {
      const message = { type: 'result', subtype: 'success' };
      expect(isResultSuccessMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 success 子类型的 result 消息', () => {
      const message = { type: 'result', subtype: 'error' };
      expect(isResultSuccessMessage(message as any)).toBe(false);
    });
  });

  describe('isStreamEventMessage', () => {
    it('应该识别 stream_event 类型消息', () => {
      const message = { type: 'stream_event', event: { type: 'message_start' } };
      expect(isStreamEventMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 stream_event 类型消息', () => {
      const message = { type: 'assistant' };
      expect(isStreamEventMessage(message as any)).toBe(false);
    });
  });

  describe('isPartialAssistantMessage', () => {
    it('应该识别 stream_event 作为 partial assistant 消息', () => {
      const message = { type: 'stream_event', event: { type: 'message_start' } };
      expect(isPartialAssistantMessage(message as any)).toBe(true);
    });

    it('应该拒绝非 stream_event 消息', () => {
      const message = { type: 'assistant' };
      expect(isPartialAssistantMessage(message as any)).toBe(false);
    });
  });
});

describe('内容类型守卫', () => {
  describe('isTextContent', () => {
    it('应该识别 text 类型内容', () => {
      const content = { type: 'text', text: 'Hello' };
      expect(isTextContent(content)).toBe(true);
    });

    it('应该拒绝非 text 类型内容', () => {
      const content = { type: 'thinking', thinking: 'test' };
      expect(isTextContent(content as any)).toBe(false);
    });
  });

  describe('isThinkingContent', () => {
    it('应该识别 thinking 类型内容', () => {
      const content = { type: 'thinking', thinking: 'Analyzing...' };
      expect(isThinkingContent(content)).toBe(true);
    });

    it('应该拒绝非 thinking 类型内容', () => {
      const content = { type: 'text', text: 'test' };
      expect(isThinkingContent(content as any)).toBe(false);
    });
  });

  describe('isToolUseContent', () => {
    it('应该识别 tool_use 类型内容', () => {
      const content = { type: 'tool_use', id: '1', name: 'Bash', input: {} };
      expect(isToolUseContent(content)).toBe(true);
    });

    it('应该拒绝非 tool_use 类型内容', () => {
      const content = { type: 'text', text: 'test' };
      expect(isToolUseContent(content as any)).toBe(false);
    });
  });

  describe('isToolResultContent', () => {
    it('应该识别 tool_result 类型内容', () => {
      const content = { type: 'tool_result', tool_use_id: '1', content: 'result' };
      expect(isToolResultContent(content)).toBe(true);
    });

    it('应该拒绝非 tool_result 类型内容', () => {
      const content = { type: 'text', text: 'test' };
      expect(isToolResultContent(content as any)).toBe(false);
    });
  });
});
