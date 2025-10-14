# 流式渲染指南

> 实时显示 Claude 的响应内容

## 概述

流式渲染功能允许你实时显示 Claude 的响应内容,而不是等待整个响应完成后再显示。这提供了更好的用户体验,特别是在处理长响应时。

## 特性

- ✅ **实时内容更新** - 字符逐步显示
- ✅ **工具调用可视化** - 实时显示工具的使用过程
- ✅ **思考过程展示** - 可选显示 Claude 的思考过程
- ✅ **光标控制** - 智能的终端光标管理
- ✅ **TTY 检测** - 自动适配不同的终端环境
- ✅ **性能优化** - 60fps 更新频率,流畅不卡顿

## 快速开始

### 最简单的方式

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

// 🎉 一行代码搞定流式渲染!
await renderQuery(
  query({
    prompt: '写一段关于 TypeScript 的介绍',
    options: {
      includePartialMessages: true, // 启用流式消息
    },
  }),
  {
    streaming: true, // 启用流式渲染
  }
);
```

### 自定义配置

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

const renderer = createRenderer({
  theme: 'dark',
  streaming: true, // 启用流式渲染
  showThinking: true, // 显示思考过程
  showToolDetails: true, // 显示工具调用详情
  showToolContent: true, // 需要时显示 content 字段（默认隐藏）
  maxWidth: 100,
});

for await (const message of query({
  prompt: '你的问题',
  options: {
    includePartialMessages: true,
  },
})) {
  await renderer.render(message);
}
```

## 配置选项

### RendererOptions

```typescript
interface RendererOptions {
  /** 启用流式渲染 */
  streaming?: boolean; // 默认: false

  /** 显示思考过程 (仅流式模式) */
  showThinking?: boolean; // 默认: false

  /** 显示工具调用详情 */
  showToolDetails?: boolean; // 默认: true

  /** 显示工具参数中的 content 字段 */
  showToolContent?: boolean; // 默认: false

  /** 主题 */
  theme?: 'dark' | 'light' | Theme; // 默认: 'dark'

  /** 终端最大宽度 */
  maxWidth?: number; // 默认: 120

  // ... 其他选项
}
```

### Query Options

**重要**: 必须在 query 的 options 中设置 `includePartialMessages: true` 才能接收流式消息!

```typescript
query({
  prompt: '你的问题',
  options: {
    includePartialMessages: true, // ⚠️ 必须启用!
    allowedTools: ['Bash', 'Read'], // 可选: 限制工具
    maxTurns: 5, // 可选: 最大轮次
  },
});
```

## 工作原理

### 流式消息类型

流式渲染基于 `SDKPartialAssistantMessage` 类型,它包含多种事件:

```typescript
type StreamEvent =
  | 'message_start' // 消息开始
  | 'content_block_start' // 内容块开始
  | 'content_block_delta' // 内容增量更新 ⭐
  | 'content_block_stop' // 内容块结束
  | 'message_delta' // 消息级别更新
  | 'message_stop'; // 消息结束
```

### 增量更新

`content_block_delta` 事件携带不同类型的增量数据:

- **text_delta** - 文本内容增量
- **thinking_delta** - 思考内容增量
- **input_json_delta** - 工具输入 JSON 增量

### 渲染流程

```
message_start
    ↓
content_block_start (text)
    ↓
content_block_delta (text_delta) ← 实时更新
    ↓
content_block_delta (text_delta) ← 实时更新
    ↓
content_block_stop
    ↓
content_block_start (tool_use)
    ↓
content_block_delta (input_json_delta) ← 实时更新
    ↓
content_block_stop
    ↓
message_stop
```

## 终端兼容性

### TTY 环境

在 TTY 环境下(标准终端),流式渲染会:

- ✅ 使用光标控制实现原地更新
- ✅ 60fps 流畅动画
- ✅ 隐藏/显示光标

### 非 TTY 环境

在非 TTY 环境下(如日志文件、CI/CD),流式渲染会:

- ✅ 自动降级为简单的增量输出
- ✅ 不使用 ANSI 转义码
- ✅ 保持可读性

## 示例

### 示例 1: 基础文本流式渲染

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

await renderQuery(
  query({
    prompt: '解释什么是 TypeScript',
    options: { includePartialMessages: true },
  }),
  { streaming: true }
);
```

### 示例 2: 带工具调用的流式渲染

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

const renderer = createRenderer({
  streaming: true,
  showToolDetails: true,
});

for await (const message of query({
  prompt: '列出当前目录的文件',
  options: {
    includePartialMessages: true,
    allowedTools: ['Bash', 'Read'],
  },
})) {
  await renderer.render(message);
}
```

### 示例 3: 显示思考过程

```typescript
await renderQuery(
  query({
    prompt: '计算斐波那契数列的第 10 项',
    options: {
      includePartialMessages: true,
      maxThinkingTokens: 1000, // 允许更多思考
    },
  }),
  {
    streaming: true,
    showThinking: true, // 启用思考过程显示
  }
);
```

### 示例 4: 自定义主题

```typescript
import { renderQuery, darkTheme } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

await renderQuery(
  query({
    prompt: '你的问题',
    options: { includePartialMessages: true },
  }),
  {
    streaming: true,
    theme: {
      ...darkTheme,
      colors: {
        ...darkTheme.colors,
        primary: '#00FF00', // 自定义颜色
      },
    },
  }
);
```

## 性能优化

### 更新频率控制

流式渲染器内部使用节流机制,默认 60fps (16ms):

```typescript
// src/stream-renderer.ts
private updateThrottleMs: number = 16; // ~60fps
```

这确保了:

- ✅ 流畅的视觉效果
- ✅ 不会过度消耗 CPU
- ✅ 减少终端闪烁

### 内存管理

- 累积的内容会在渲染完成后自动清理
- 工具调用信息只保留必要的数据
- 不会无限增长内存占用

## API 参考

### StreamRenderer 类

```typescript
class StreamRenderer {
  /** 开始流式渲染会话 */
  start(): void;

  /** 处理流式事件 */
  processEvent(message: SDKPartialAssistantMessage): Promise<void>;

  /** 结束流式渲染会话 */
  end(): void;

  /** 获取累积的文本内容 */
  getText(): string;

  /** 获取累积的思考内容 */
  getThinking(): string;

  /** 获取所有工具调用 */
  getToolUses(): Array<{
    id: string;
    name: string;
    input: Record<string, unknown>;
  }>;

  /** 获取停止原因 */
  getStopReason(): string | null;
}
```

### CursorController 类

```typescript
class CursorController {
  /** 隐藏光标 */
  hide(): void;

  /** 显示光标 */
  show(): void;

  /** 向上移动 n 行 */
  up(lines: number): void;

  /** 向下移动 n 行 */
  down(lines: number): void;

  /** 清除当前行 */
  clearLine(): void;

  /** 更新当前行的文本 */
  updateLine(text: string): void;

  /** 检查是否在 TTY 环境 */
  get isTTY(): boolean;
}
```

## 运行演示

```bash
# 完整流式渲染演示
npm run demo:streaming

# 简单流式渲染示例
npm run demo:streaming:simple
```

## 故障排除

### 问题: 没有看到流式更新

**解决方案**:

1. 确保在 query options 中设置了 `includePartialMessages: true`
2. 确保在 renderer options 中设置了 `streaming: true`
3. 检查终端是否支持 ANSI 转义码

### 问题: 输出有闪烁

**原因**: 更新频率过高或终端性能问题

**解决方案**: 调整 `updateThrottleMs` 值(需要修改源码)

### 问题: 非 TTY 环境下输出混乱

**说明**: 这是预期行为。在非 TTY 环境下,流式渲染会自动降级为简单输出。

## 最佳实践

1. **总是启用 includePartialMessages**

   ```typescript
   options: { includePartialMessages: true }
   ```

2. **根据场景选择是否显示思考**

   ```typescript
   showThinking: process.env.NODE_ENV === 'development'
   ```

3. **在 CI/CD 中禁用流式渲染**

   ```typescript
   streaming: process.stdout.isTTY
   ```

4. **合理设置最大宽度**
   ```typescript
   maxWidth: process.stdout.columns || 100
   ```

## 限制

- ⚠️ 仅支持 `SDKPartialAssistantMessage` 类型的消息
- ⚠️ 在非 TTY 环境下功能受限
- ⚠️ 不支持打字机效果(暂未实现)

## 下一步

- 探索 [UI 组件库](../UI_COMPONENTS_SUMMARY.md)
- 查看 [主题定制指南](./THEMES.md)
- 了解 [完整 API 文档](../README.md)

---

**提示**: 流式渲染是 Claude Agent SDK UI 的核心特性之一,建议在所有交互式应用中使用!
