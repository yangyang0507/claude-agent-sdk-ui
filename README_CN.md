<div align="center">

# Claude Agent SDK UI

**基于 React + Ink 的声明式终端 UI 渲染框架**

为 Claude Agent SDK 提供开箱即用的美观 CLI UI 体验

![hello.gif](./docs/resources/hello.gif)

[![npm version](https://img.shields.io/npm/v/claude-agent-sdk-ui.svg)](https://www.npmjs.com/package/claude-agent-sdk-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## ✨ 核心特性

- 🎨 **React + Ink 架构** - 使用声明式组件构建终端 UI
- 🚀 **极简 API** - 一行代码实现完整渲染
- 🎭 **组件级主题系统** - 每个主题完全控制布局和交互，而不仅仅是样式
- 🎁 **丰富组件库** - Badge、Box、Divider、Table、Spinner、Markdown 等
- 🌊 **流式渲染** - 支持实时更新和打字机效果
- 📼 **日志重放** - 完整的会话日志记录和重放功能
- 💪 **类型安全** - 完整的 TypeScript 类型定义，编译时保证
- ⚡ **高性能** - 优化的渲染引擎，流畅处理大量消息

---

## 📦 安装

```bash
npm install claude-agent-sdk-ui @anthropic-ai/claude-agent-sdk
```

**要求：**
- Node.js >= 18.0.0
- @anthropic-ai/claude-agent-sdk >= 0.1.14

---

## 🚀 快速开始

### 最简用法 - 一行代码

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

// 🎉 超级简洁！一行代码搞定
await renderQuery(query({ prompt: '你好，Claude！' }));
```

### 流式渲染 - 带打字机效果

```typescript
import { renderQueryStreaming } from 'claude-agent-sdk-ui';

// 流式渲染，带打字机效果
await renderQueryStreaming(
  query({
    prompt: '解释一下 TypeScript 的优势',
    options: { includePartialMessages: true }
  }),
  {
    streaming: true,
    typingEffect: true,
    typingSpeed: 20
  }
);
```

### 自定义配置

```typescript
await renderQuery(
  query({
    prompt: '分析当前目录的文件结构',
    options: {
      maxTurns: 10,
      allowedTools: ['Read', 'Grep', 'Glob'],
    }
  }),
  {
    theme: 'claude-code',         // 主题选择
    showTimestamps: true,          // 显示时间戳
    showSessionInfo: true,         // 显示会话信息
    showFinalResult: true,         // 显示最终结果
    showExecutionStats: false,     // 显示执行统计
    showTokenUsage: false,         // 显示 Token 统计
    showThinking: true,            // 显示思考过程
    showToolDetails: true,         // 显示工具详情
    maxOutputLines: 50,            // 最大输出行数
    logging: {                     // 日志配置
      enabled: true,
      logPath: './logs'
    }
  }
);
```

### 使用渲染器类

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';

// 创建渲染器实例
const renderer = createRenderer({
  theme: 'droid',
  showTokenUsage: true,
});

// 渲染消息
for await (const message of query({ prompt: '...' })) {
  await renderer.render(message);
}

// 清理资源
await renderer.cleanup();
```

---

## 📖 核心 API

### 函数式 API

```typescript
// 渲染整个会话
await renderQuery(queryGenerator, options?);

// 渲染整个会话（流式版本）
await renderQueryStreaming(queryGenerator, options?);

// 渲染单条消息
await render(message, options?);
```

### 类式 API

```typescript
// 创建标准渲染器
const renderer = createRenderer(options?);

// 创建流式渲染器
const streamingRenderer = createStreamingRenderer(options?);

// 渲染消息
await renderer.render(message);

// 清理资源
await renderer.cleanup();
```

---

## 🎭 主题系统

### 组件级架构

**v1.0.0** 引入了革命性的主题系统，每个主题都拥有**对布局和组件的完全控制权**，而不仅仅是颜色和符号。

- 🏗️ 每个主题包含完整的组件实现
- 🎨 主题可以自定义消息布局、交互模式和视觉设计
- 🔄 通过代理模式实现动态组件路由
- 💪 类型安全，编译时保证完整性

### 内置主题

#### Claude Code 主题
灵感来自 Claude Code 的简洁专业设计：
```typescript
const renderer = createRenderer({ theme: 'claude-code' });
```

#### Droid 主题
现代 CLI 美学，独特视觉设计：
- 🟠 橙色表示"进行中"状态（思考、流式、工具执行）
- 🔵 青色表示已完成内容和稳定 UI 元素
- ⛬ 六芒星符号（⛬）作为 AI 消息前缀
- ↳ 箭头符号（↳）表示工具输出
- 橙色背景标签显示工具调用

```typescript
const renderer = createRenderer({ theme: 'droid' });
```

### 自定义主题

#### 简单主题（仅颜色和符号）

```typescript
import { createTheme } from 'claude-agent-sdk-ui';

const myTheme = createTheme({
  name: 'my-theme',
  colors: {
    primary: '#FF6B6B',
    success: '#51CF66',
    error: '#FF6B6B',
    warning: '#FFD93D',
    info: '#4DABF7',
    text: '#F8F9FA',
    dim: '#868E96',
  },
  symbols: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    pending: '⏳',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  },
});

const renderer = createRenderer({ theme: myTheme });
```

#### 高级主题（自定义布局）

要实现完全的布局控制，可以创建自定义组件实现：

```typescript
// themes/my-theme/config.ts
import { AssistantMessage } from './components/assistant-message';
import { StreamingAssistantMessage } from './components/streaming-assistant-message';
// ... 导入其他组件

export const myTheme: Theme = {
  name: 'my-theme',
  colors: { /* ... */ },
  symbols: { /* ... */ },
  components: {
    assistantMessage: AssistantMessage,
    streamingAssistantMessage: StreamingAssistantMessage,
    toolResultMessage: ToolResultMessage,
    systemMessage: SystemMessage,
    finalResult: FinalResult,
    appLayout: AppLayout,
  },
};
```

📚 **详见[自定义布局主题指南](./docs/custom-layout-theme.md)获取详细说明。**

---

## 🎁 UI 组件库

所有组件都基于 React + Ink 构建，可以在自己的项目中直接使用：

```typescript
import {
  Badge,
  Box,
  Divider,
  Spinner,
  StatusLine,
  Markdown,
  StreamingText,
  Table
} from 'claude-agent-sdk-ui';

// Badge - 状态标签
<Badge type="success">SUCCESS</Badge>
<Badge type="error">ERROR</Badge>
<Badge type="info">INFO</Badge>

// Box - 边框容器
<Box borderStyle="round" padding={1}>
  Content here
</Box>

// Divider - 分隔线
<Divider style="heavy" text="SECTION TITLE" />

// Spinner - 加载动画
<Spinner type="dots" text="Loading..." />

// StatusLine - 状态行
<StatusLine
  status="success"
  label="Read"
  message="File loaded"
  duration={500}
/>

// Markdown - Markdown 渲染
<Markdown>{markdownContent}</Markdown>

// StreamingText - 流式文本
<StreamingText
  text="Hello, world!"
  speed={20}
  onComplete={() => {}}
/>

// Table - 表格
<Table
  headers={['Name', 'Value']}
  rows={[
    ['Foo', 'Bar'],
    ['Baz', 'Qux']
  ]}
/>
```

---

## 📼 日志记录与重放

### 启用日志记录

```typescript
await renderQuery(
  query({ prompt: '...' }),
  {
    logging: {
      enabled: true,
      logPath: './logs',
      fileNameFormat: 'session-{sessionId}-{timestamp}.jsonl',
      verbose: true
    }
  }
);
```

日志会保存为 JSONL 格式（每行一个 JSON 对象），包含完整的消息数据和时间戳。

### 重放日志

使用 CLI 工具重放之前的会话：

```bash
# 基本用法
npm run replay -- logs/session-xxx.jsonl

# 使用自定义主题
npm run replay -- logs/session-xxx.jsonl --theme droid

# 实时模式，2倍速播放
npm run replay -- logs/session-xxx.jsonl --realtime --speed 2

# 流式渲染，显示思考内容
npm run replay -- logs/session-xxx.jsonl --streaming --show-thinking

# 固定延迟模式，每条消息间隔 500ms
npm run replay -- logs/session-xxx.jsonl --fixed-delay 500
```

在代码中使用：

```typescript
import { replayLog } from 'claude-agent-sdk-ui';

await replayLog('logs/session-xxx.jsonl', {
  theme: 'droid',
  realtime: true,
  speed: 2,
  showThinking: true,
  showToolDetails: true
});
```

---

## ⚙️ 配置选项

### RendererOptions

```typescript
interface RendererOptions {
  // 主题配置
  theme?: 'claude-code' | 'droid' | Theme;

  // 显示选项
  showTimestamps?: boolean;          // 显示时间戳（默认：false）
  showSessionInfo?: boolean;         // 显示会话信息（默认：true）
  showFinalResult?: boolean;         // 显示最终结果（默认：false）
  showExecutionStats?: boolean;      // 显示执行统计（默认：false）
  showTokenUsage?: boolean;          // 显示 Token 使用量（默认：false）
  showThinking?: boolean;            // 显示思考过程（默认：false）
  showToolDetails?: boolean;         // 显示工具详情（默认：true）
  showToolContent?: boolean;         // 显示工具参数中的 content 字段（默认：false）

  // 格式选项
  compact?: boolean;                 // 紧凑模式（默认：false）
  maxOutputLines?: number;           // 工具结果最大行数（默认：100）
  maxWidth?: number;                 // 最大宽度（默认：120）
  codeHighlight?: boolean;           // 代码高亮（默认：true）

  // 流式选项
  streaming?: boolean;               // 启用流式渲染（默认：false）
  typingEffect?: boolean;            // 打字机效果（默认：false）
  typingSpeed?: number;              // 打字速度（默认：20ms）

  // 日志选项
  logging?: {
    enabled: boolean;                // 启用日志记录
    logPath?: string;                // 日志目录（默认：'./logs'）
    fileNameFormat?: string;         // 文件名格式
    verbose?: boolean;               // 详细日志输出
  };
}
```

---

## 📚 示例代码

项目包含多个示例代码，展示不同的使用场景：

```bash
# 简单示例（标准渲染）
npm run demo

# 流式渲染示例（实时流式渲染 with 打字效果）
npm run demo:streaming

# 主题预览（可交互切换）
npm run demo:themes
```

查看示例代码：
- `examples/agent-integration/hello-demo.ts` - 最简单的标准渲染示例
- `examples/agent-integration/hello-streaming-demo.ts` - 简单的流式渲染，实时更新
- `examples/agent-integration/sample-demo.ts` - 完整的流式渲染演示，包含日志记录和思考显示
- `examples/agent-integration/original-demo.ts` - 原生 Claude Agent SDK 使用（对比参考）
- `examples/theme-preview.tsx` - 主题预览与配置切换
- `examples/theme-templates/minimal-theme.ts` - 最小主题模板（仅颜色和符号）
- `examples/theme-templates/card-theme.tsx` - 卡片式布局模板

---

## 🛠️ 开发

### 开发环境

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 测试

```bash
# 运行测试
npm test

# 运行测试 UI
npm run test:ui

# 运行表格测试
npm run test:table
```

---

## 🏗️ 架构设计

### 核心架构

```
┌─────────────────────────────────────────────┐
│          React + Ink 组件层                  │
│  (SystemMessage, AssistantMessage, etc.)    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         渲染器层 (Renderer)                  │
│  (UIRenderer, StreamingRenderer)            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         消息路由层 (MessageRouter)           │
│  (根据消息类型路由到不同组件)                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         UI 组件库                            │
│  (Badge, Box, Divider, Table, etc.)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         工具函数层                           │
│  (String, Time, Terminal utils)             │
└─────────────────────────────────────────────┘
```

### 主要特点

1. **声明式组件**：使用 React 组件化方式构建终端 UI
2. **组件复用**：所有 UI 组件都可以独立使用
3. **主题系统**：完整的主题定制能力
4. **类型安全**：完整的 TypeScript 类型定义
5. **扩展性**：易于添加新的消息类型和组件

---

## 🎯 支持的消息类型

- ✅ **System 消息** - 会话初始化、压缩边界
- ✅ **Assistant 消息** - 文本、思考、工具使用
- ✅ **User 消息** - 工具结果
- ✅ **Result 消息** - 成功、错误
- ✅ **Partial 消息** - 流式输出

---

## 🤝 贡献

欢迎贡献！请查看以下资源：

- 🐛 [问题反馈](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 💡 [功能建议](https://github.com/yangyang0507/claude-agent-sdk-ui/issues/new)

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License © 2025

---

## 🔗 相关链接

- 📚 [Claude Agent SDK - TypeScript](https://docs.anthropic.com/en/api/agent-sdk/typescript)
- 📘 [Claude Agent SDK - Python](https://docs.anthropic.com/en/api/agent-sdk/python)
- 🌐 [Claude API 文档](https://docs.anthropic.com/)
- 💬 [GitHub Issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 📦 [npm 包](https://www.npmjs.com/package/claude-agent-sdk-ui)

---

<div align="center">

**让每个开发者都能轻松构建美观、专业的 AI Agent CLI 应用！** 🚀

Made with ❤️ for the Claude Agent SDK Community

[⭐ Star 支持我们](https://github.com/yangyang0507/claude-agent-sdk-ui) | [🐛 报告问题](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)

</div>
