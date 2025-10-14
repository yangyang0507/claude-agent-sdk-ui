# Ink 渲染器 - 使用指南

**新一代 React 驱动的终端 UI 渲染器** 🎉

---

## ✨ 特性

- 🎨 **React 组件化** - 声明式 UI，代码量减少 50%
- ⚡ **Flexbox 布局** - 自动处理复杂布局
- ⌨️ **打字机效果** - 逐字符流式显示
- 🎯 **TypeScript 支持** - 完整类型定义
- 🌈 **主题系统** - 灵活的主题定制
- 📦 **向后兼容** - 无缝集成现有代码

---

## 🚀 快速开始

### 基础用法

```typescript
import { renderQueryWithInk } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

// 一行代码搞定！
await renderQueryWithInk(query({ prompt: '你好，Claude！' }));
```

### 带打字机效果（推荐）

```typescript
import { renderQueryStreaming } from 'claude-agent-sdk-ui';

await renderQueryStreaming(query({ prompt: '你好，Claude！' }), {
  theme: 'dark',
  typingEffect: true,    // 启用打字机效果
  typingSpeed: 20,       // 速度：20ms/字符
  showTokenUsage: true,  // 显示 Token 统计
});
```

---

## 📖 API 参考

### 1. `renderQueryWithInk()`

最简单的方式，渲染整个会话。

```typescript
await renderQueryWithInk(
  queryGenerator: AsyncGenerator<SDKMessage>,
  options?: RendererOptions
);
```

**选项：**
- `theme`: `'dark' | 'light' | Theme` - 主题
- `showTokenUsage`: `boolean` - 显示 Token 统计
- `showToolDetails`: `boolean` - 显示工具详情

---

### 2. `renderQueryStreaming()`

带打字机效果的流式渲染。

```typescript
await renderQueryStreaming(
  queryGenerator: AsyncGenerator<SDKMessage>,
  options?: RendererOptions
);
```

**额外选项：**
- `typingEffect`: `boolean` - 启用打字机效果
- `typingSpeed`: `number` - 速度（毫秒/字符）
- `streaming`: `boolean` - 启用流式渲染

---

### 3. `createInkRenderer()`

手动控制渲染流程。

```typescript
const renderer = createInkRenderer({
  theme: 'dark',
  showTokenUsage: true,
});

for await (const message of query({ prompt: '...' })) {
  await renderer.render(message);
}

renderer.cleanup(); // ⚠️ 记得清理
```

---

### 4. `createStreamingRenderer()`

创建流式渲染器实例。

```typescript
const renderer = createStreamingRenderer({
  theme: 'dark',
  typingEffect: true,
  typingSpeed: 15,
});

for await (const message of query({ prompt: '...' })) {
  await renderer.render(message);  // 自动等待打字机效果完成
}

renderer.cleanup();
```

---

## 🎨 主题配置

### 使用内置主题

#### Dark 主题（默认）
基于 **One Dark Pro** 配色方案的深色主题，提供柔和的颜色对比，适合长时间使用。

```typescript
await renderQuery(query({ prompt: '...' }), {
  theme: 'dark',  // 默认深色主题
});
```

#### Light 主题
基于 **One Light** 配色方案的浅色主题，高对比度，适合明亮环境。

```typescript
await renderQuery(query({ prompt: '...' }), {
  theme: 'light',  // 浅色主题
});
```

#### Claude Code 主题
模拟 Claude Code CLI 的极简风格，使用绿色主色调，注重简洁性。

```typescript
await renderQuery(query({ prompt: '...' }), {
  theme: 'claude-code',  // Claude Code 主题
});
```

#### Droid 主题
模拟 Droid CLI 的结构化风格，使用蓝色主色调，注重信息层次。

```typescript
await renderQuery(query({ prompt: '...' }), {
  theme: 'droid',  // Droid 主题
});
```

### 自定义主题

```typescript
import { Theme } from 'claude-agent-sdk-ui';

const myTheme: Theme = {
  name: 'my-theme',
  colors: {
    primary: '#00D9FF',
    success: '#00FF7F',
    error: '#FF006E',
    warning: '#FFD700',
    info: '#00D9FF',
    dim: '#666666',
  },
  symbols: {
    bullet: '▸',
    arrow: '→',
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  },
};

await renderQueryWithInk(query({ prompt: '...' }), {
  theme: myTheme,
});
```

---

## 🎯 使用场景

### 场景 1: CLI 工具

```typescript
#!/usr/bin/env node
import { renderQueryStreaming } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

const userPrompt = process.argv[2];

await renderQueryStreaming(query({ prompt: userPrompt }), {
  typingEffect: true,
  typingSpeed: 15,
});
```

### 场景 2: 交互式应用

```typescript
import { createStreamingRenderer } from 'claude-agent-sdk-ui';

const renderer = createStreamingRenderer({
  theme: 'dark',
  typingEffect: true,
  typingSpeed: 20,
});

// 处理多个会话
for (const userInput of userInputs) {
  for await (const message of query({ prompt: userInput })) {
    await renderer.render(message);
  }
}

renderer.cleanup();
```

### 场景 3: 自定义 React 组件

```typescript
import React from 'react';
import { render, Box, Text } from 'ink';
import { ThemeProvider, useTheme } from 'claude-agent-sdk-ui';

const MyApp = () => {
  const theme = useTheme();

  return (
    <Box flexDirection="column">
      <Text color={theme.colors.primary}>
        自定义 Ink 组件！
      </Text>
    </Box>
  );
};

render(
  <ThemeProvider theme="dark">
    <MyApp />
  </ThemeProvider>
);
```

---

## 🔧 高级配置

### 完整配置选项

```typescript
interface RendererOptions {
  // 主题
  theme?: 'dark' | 'light' | Theme;

  // 显示选项
  showTimestamps?: boolean;      // 显示时间戳
  showTokenUsage?: boolean;      // 显示 Token 统计
  showToolDetails?: boolean;     // 显示工具调用详情
  showToolContent?: boolean;     // 显示工具输出内容
  showThinking?: boolean;        // 显示思考过程

  // 流式选项
  streaming?: boolean;           // 启用流式渲染
  typingEffect?: boolean;        // 启用打字机效果
  typingSpeed?: number;          // 打字速度（毫秒）

  // 输出控制
  compact?: boolean;             // 紧凑模式
  maxOutputLines?: number;       // 最大输出行数
  maxWidth?: number;             // 最大宽度

  // 高亮
  codeHighlight?: boolean;       // 代码高亮
}
```

---

## 📦 导出的组件

### UI 组件

```typescript
import {
  Box,
  Badge,
  Divider,
  Spinner,
  StreamingText,
  InfoBadge,
  SuccessBadge,
  ErrorBadge,
  WarningBadge,
} from 'claude-agent-sdk-ui';
```

### 消息组件

```typescript
import {
  SystemMessage,
  AssistantMessage,
  StreamingAssistantMessage,
  ToolResultMessage,
  FinalResult,
} from 'claude-agent-sdk-ui';
```

### 主题 Hook

```typescript
import {
  ThemeProvider,
  useTheme,
} from 'claude-agent-sdk-ui';
```

---

## 🎬 示例

### 运行示例

```bash
# 基础 Ink 渲染示例
npm run demo:ink

# 流式渲染示例（打字机效果）
npm run demo:ink:streaming
```

### 查看示例代码

- **集成示例**: [`examples/integration/ink-renderer-demo.ts`](../examples/integration/ink-renderer-demo.ts)
- **流式示例**: [`examples/streaming/full-session-streaming.tsx`](../examples/streaming/full-session-streaming.tsx)
- **基础组件**: [`examples/ink-test/basic-components.tsx`](../examples/ink-test/basic-components.tsx)

---

## 📚 文档

- [完整重构指南](./INK_REFACTOR_GUIDE.md)
- [快速入门](./INK_QUICK_START.md)
- [迁移指南](./INK_MIGRATION_GUIDE.md)

---

## ❓ 常见问题

### Q: 如何禁用打字机效果？

```typescript
await renderQueryWithInk(query({ prompt: '...' }), {
  typingEffect: false,
});
```

### Q: 如何调整打字速度？

```typescript
await renderQueryStreaming(query({ prompt: '...' }), {
  typingEffect: true,
  typingSpeed: 10,  // 更快
  // typingSpeed: 50,  // 更慢
});
```

### Q: 如何显示 Token 使用情况？

```typescript
await renderQueryWithInk(query({ prompt: '...' }), {
  showTokenUsage: true,
});
```

### Q: 可以自定义组件吗？

可以！Ink 渲染器完全支持 React 组件。查看[完整文档](./INK_REFACTOR_GUIDE.md)了解更多。

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

---

**开始使用 Ink 渲染器，打造更好的终端体验！** 🚀
