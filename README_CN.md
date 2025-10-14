# Claude Agent SDK UI

<div align="center">

**一行代码实现 Claude Code 级别的 CLI UI 渲染体验**

为 Claude Agent SDK 提供开箱即用的美观 CLI UI 渲染

[![npm version](https://img.shields.io/npm/v/claude-agent-sdk-ui.svg)](https://www.npmjs.com/package/claude-agent-sdk-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## ✨ 特性

- 🎨 **开箱即用** - 零配置即可获得美观的终端 UI
- 🚀 **极简 API** - 一行代码实现消息渲染
- 🎭 **主题系统** - 内置暗色/亮色主题,支持完全自定义
- 📊 **丰富展示** - 工具调用、代码高亮、Markdown 渲染、统计信息等
- 🎁 **UI 组件库** - Badge、Box、Divider、Table、Spinner 等专业组件
- ⚡ **高性能** - 优化的渲染引擎,流畅处理大量消息
- 🌊 **流式渲染** - 支持实时更新和打字机效果
- 💪 **类型安全** - 完整的 TypeScript 类型定义
- 🔧 **灵活配置** - 丰富的配置选项满足各种需求

---

## 📦 安装

```bash
npm install claude-agent-sdk-ui @anthropic-ai/claude-agent-sdk
```

**要求:**
- Node.js >= 18.0.0
- @anthropic-ai/claude-agent-sdk >= 0.1.0

---

## 🚀 快速开始

### 最简用法 - 一行代码

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

// 🎉 超级简洁!一行代码搞定
await renderQuery(query({ prompt: '你好,Claude!' }));
```

### 逐条渲染(可选)

```typescript
import { render } from 'claude-agent-sdk-ui';

// 如果需要对每条消息进行额外处理
for await (const message of query({ prompt: '你好!' })) {
  // 可以在这里添加自定义逻辑
  await render(message);
}
```

### 高级用法 - 自定义配置

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

await renderQuery(
  query({
    prompt: '请帮我分析一下当前目录的文件结构',
    options: {
      maxTurns: 10,
      allowedTools: ['Read', 'Grep', 'Glob'],
    }
  }),
  {
    theme: 'dark',               // 主题选择
    showTimestamps: true,        // 显示时间戳
    showTokenUsage: true,        // 显示 Token 统计（默认关闭）
    showThinking: true,          // 显示思考过程
    showToolDetails: true,       // 显示工具详情
    showToolContent: true,       // 需要时显示 content 字段（默认隐藏）
    maxOutputLines: 50,          // 最大输出行数
  }
);
```

### 使用 Renderer 类

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { Renderer } from 'claude-agent-sdk-ui';

// 创建渲染器实例
const renderer = new Renderer({
  theme: 'dark',
  showTokenUsage: true,
});

// 渲染消息
for await (const message of query({ prompt: '...' })) {
  await renderer.render(message);
}

// 获取状态
const stats = renderer.getState();
console.log(`处理了 ${stats.processedMessages} 条消息`);
```

---

## 🎨 渲染效果展示

### System 初始化消息（增强版）

```
═══════════ 🚀 SESSION INITIALIZED ═══════════

╭───────────────── 📋 Session Info ─────────────────╮
│ Session ID: 628c0fcf                              │
│ Model: claude-sonnet-4                            │
│ Working Dir: /Users/username/project              │
│ Permission: [ℹ DEFAULT]                          │
╰───────────────────────────────────────────────────╯

[✓ SUCCESS] 15 TOOLS AVAILABLE
  🔧 Bash  🔧 Read  🔧 Edit  🔧 Write  ...
```

### Assistant 文本消息

```
我来帮您分析一下当前目录的文件结构。首先让我查看一下主要文件...

tokens: 289
```

### 工具调用（增强版）

```
[ℹ INFO] 🔧 Bash

┌───────────────────────────────────────────────┐
│ {                                             │
│   "command": "ls -la",                        │
│   "description": "列出当前目录的详细文件信息"    │
│ }                                             │
└───────────────────────────────────────────────┘
```

### 工具结果（增强版）

```
[✓ SUCCESS] RESULT: SUCCESS (1.2s)

┌───────────────────────────────────────────────┐
│ total 560                                     │
│ drwxr-xr-x  20 user  staff   640 Oct 13 ...  │
│ drwx------  119 user  staff  3808 Oct 13 ... │
│ ...                                           │
└───────────────────────────────────────────────┘
```

### 最终结果（增强版）

```
═════════ ✅ EXECUTION COMPLETE ══════════

[✓ SUCCESS] FINAL RESULT

分析完成!当前目录包含以下主要文件和目录:
...

[ℹ INFO] EXECUTION STATS

┌──────────────────┬────────────────────────┐
│ Metric           │                  Value │
├──────────────────┼────────────────────────┤
│ Status           │             ✅ Success │
│ Duration         │                  22.2s │
│ Turns            │                     22 │
│ Total Cost       │               $0.0827  │
└──────────────────┴────────────────────────┘

[ℹ TOKEN USAGE]

┌──────────────────┬────────────────────────┐
│ Type             │                  Count │
├──────────────────┼────────────────────────┤
│ Input Tokens     │                  8,117 │
│ Output Tokens    │                    984 │
│ Cache Read       │                112,928 │
└──────────────────┴────────────────────────┘

```

---

## 📚 完整示例

### 示例 1: 基础使用

见 `examples/agent-integration/streaming-simple.ts`:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from '../src/index.js';

async function simpleDemo() {
  // 🎉 超级简洁!一行代码搞定
  await renderQuery(query({
    prompt: '请帮我分析一下当前目录的文件结构',
    options: {
      maxTurns: 10,
      allowedTools: ['Read', 'Grep', 'Glob'],
    },
  }));
}

simpleDemo();
```

运行示例:

```bash
# UI 框架演示（推荐）
npm run demo:ui

# UI 流式渲染演示
npm run demo:ui:streaming

# 基础组件演示
npm run demo:basic

# 完整会话演示
npm run demo:full

# 主题演示
npm run demo:theme:claude
npm run demo:theme:droid
```

### 示例 2: 自定义主题

```typescript
import { createRenderer, createTheme } from 'claude-agent-sdk-ui';

// 创建自定义主题
const oceanTheme = createTheme({
  name: 'ocean',
  colors: {
    primary: '#0077BE',
    secondary: '#00A8CC',
    success: '#26C281',
    error: '#EE5A6F',
    warning: '#F8B500',
    info: '#3498DB',
    text: '#2C3E50',
    dim: '#95A5A6',
  },
  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '⏳',
    spinner: ['🌊', '🌊', '🌊'],
    bullet: '•',
    arrow: '→',
  },
});

// 使用自定义主题
const renderer = createRenderer({ theme: oceanTheme });
```

---

## ⚙️ 配置选项

### RendererOptions

```typescript
interface RendererOptions {
  // 主题配置
  theme?: 'dark' | 'light' | Theme;

  // 显示选项
  showTimestamps?: boolean;      // 显示时间戳 (默认: false)
  showTokenUsage?: boolean;      // 显示 Token 使用量 (默认: false)
  showThinking?: boolean;        // 显示思考过程 (默认: false)
  showToolDetails?: boolean;     // 显示工具详情 (默认: true)
  showToolContent?: boolean;     // 显示 content 字段 (默认: false)

  // 格式选项
  compact?: boolean;             // 紧凑模式 (默认: false)
  maxOutputLines?: number;       // 工具结果最大行数 (默认: 100)
  maxWidth?: number;             // 最大宽度 (默认: 120)

  // 高级选项
  codeHighlight?: boolean;       // 代码高亮 (默认: true)
  streaming?: boolean;           // 流式渲染 (默认: false)
  typingEffect?: boolean;        // 打字机效果 (默认: false)
  typingSpeed?: number;          // 打字速度 (默认: 20ms)
}
```

---

## 🎭 主题系统

### 内置主题

```typescript
import { darkTheme, lightTheme } from 'claude-agent-sdk-ui';

// 使用暗色主题 (默认)
const renderer = new Renderer({ theme: 'dark' });
// 或
const renderer = new Renderer({ theme: darkTheme });

// 使用亮色主题
const renderer = new Renderer({ theme: 'light' });
// 或
const renderer = new Renderer({ theme: lightTheme });
```

### 自定义主题

```typescript
import { createTheme } from 'claude-agent-sdk-ui';

const myTheme = createTheme({
  name: 'my-theme',
  colors: {
    primary: '#FF6B6B',    // 主色
    success: '#51CF66',    // 成功色
    error: '#FF6B6B',      // 错误色
    warning: '#FFD93D',    // 警告色
    info: '#4DABF7',       // 信息色
    text: '#F8F9FA',       // 文本色
    dim: '#868E96',        // 暗淡色
  },
  // 可选: 自定义其他配置
  symbols: {
    success: '✅',
    error: '❌',
    // ...
  },
});
```

### 主题配置详解

```typescript
interface Theme {
  name: string;

  colors: {
    primary: string;      // 主色 - 标题、重要信息
    secondary: string;    // 次要色 - 副标题
    success: string;      // 成功色 - 成功消息
    error: string;        // 错误色 - 错误消息
    warning: string;      // 警告色 - 警告消息
    info: string;         // 信息色 - 信息消息
    text: string;         // 文本色 - 常规文本
    dim: string;          // 暗淡色 - 次要文本
    background?: string;  // 背景色 (可选)
    highlight?: string;   // 高亮色 (可选)
  };

  symbols: {
    success: string;      // ✓
    error: string;        // ✗
    warning: string;      // ⚠
    info: string;         // ℹ
    pending: string;      // ○
    spinner: string[];    // 加载动画
    bullet: string;       // •
    arrow: string;        // →
    thinking?: string;    // 💭
    tool?: string;        // 🔧
  };

  borders: {
    style: 'single' | 'double' | 'round' | 'bold' | 'none';
    color: string;
  };

  layout: {
    indent: number;           // 缩进空格数
    lineSpacing: number;      // 行间距
    componentSpacing?: number; // 组件间距
  };

  toolIcons?: {
    [toolName: string]: string;  // 工具图标映射
  };
}
```

---

## 📖 API 文档

### 主要导出

```typescript
// 函数
export function renderQuery(queryGenerator: AsyncGenerator<SDKMessage>, options?: RendererOptions): Promise<void>;
export function render(message: SDKMessage, options?: RendererOptions): Promise<void>;
export function createRenderer(options?: RendererOptions): Renderer;
export function createTheme(options: ThemeOptions): Theme;
export function getTheme(input?: ThemeInput): Theme;

// 类
export class Renderer {
  constructor(options?: RendererOptions);
  render(message: SDKMessage): Promise<void>;
  getState(): RendererState;
  reset(): void;
}

// 主题
export { darkTheme, lightTheme };

// 类型
export type { SDKMessage, RendererOptions, Theme, ... };
```

### Renderer 类方法

#### `render(message: SDKMessage): Promise<void>`

渲染单条 SDK 消息。

```typescript
await renderer.render(message);
```

#### `getState(): RendererState`

获取当前渲染器状态。

```typescript
const state = renderer.getState();
console.log(`已处理 ${state.processedMessages} 条消息`);
console.log(`总成本: $${state.totalCost.toFixed(4)}`);
```

#### `reset(): void`

重置渲染器状态。

```typescript
renderer.reset();
```

---

## 🛠️ 工具函数

### 字符串处理

```typescript
import {
  truncate,
  indent,
  alignLeft,
  alignRight,
  alignCenter,
  formatBytes,
  pluralize,
} from 'claude-agent-sdk-ui/utils';

truncate('很长的文本...', 10);           // "很长的文..."
indent('文本', 2);                      // "  文本"
formatBytes(1234567);                 // "1.18 MB"
pluralize(3, 'file');                 // "3 files"
```

### 时间格式化

```typescript
import {
  formatDuration,
  formatTimestamp,
  formatTimeRange,
} from 'claude-agent-sdk-ui/utils';

formatDuration(22200);                // "22.2s"
formatTimestamp(Date.now());          // "2025-10-13 11:08:45"
formatTimeRange(start, end);          // "11:08:45 → 11:09:07 (22s)"
```

### 终端控制

```typescript
import {
  clearTerminal,
  getTerminalWidth,
  applyColor,
  bold,
  italic,
  underline,
} from 'claude-agent-sdk-ui/utils';

clearTerminal();                      // 清空终端
const width = getTerminalWidth();     // 获取终端宽度
const colored = applyColor('text', '#FF0000');
const text = bold('加粗文本');
```

---

## 🎯 支持的消息类型

本库完整支持 Claude Agent SDK 的所有消息类型:

- ✅ **System 消息** - 初始化、压缩边界
- ✅ **Assistant 消息** - 文本、思考、工具使用
- ✅ **User 消息** - 工具结果
- ✅ **Result 消息** - 成功、错误
- ✅ **部分消息** - 流式输出 (开发中)

### 消息内容类型

- ✅ **Text** - 文本内容(支持 Markdown)
- ✅ **Thinking** - 思考过程
- ✅ **Tool Use** - 工具调用
- ✅ **Tool Result** - 工具结果

---

## 🏗️ 项目结构

```
claude-agent-sdk-demo/
├── src/
│   ├── types/              # TypeScript 类型定义
│   │   ├── messages.ts     # SDK 消息类型
│   │   ├── theme.ts        # 主题类型
│   │   └── renderer.ts     # 渲染器类型
│   ├── themes/             # 主题系统
│   │   ├── dark.ts         # 深色主题
│   │   ├── light.ts        # 浅色主题
│   │   └── index.ts        # 主题导出
│   ├── utils/              # 工具函数
│   │   ├── string.ts       # 字符串处理
│   │   ├── time.ts         # 时间格式化
│   │   └── terminal.ts     # 终端控制
│   ├── renderer.ts         # 核心渲染器
│   └── index.ts            # 主入口
├── examples/               # 示例代码
│   ├── agent-integration/ # AgentSDK 集成示例
│   │   ├── streaming-demo.ts
│   │   ├── streaming-simple.ts
│   │   └── query-demo.ts
│   ├── components/        # 组件使用示例
│   │   ├── ui-components-demo.ts
│   │   └── typing-effect-demo.ts
│   └── README.md          # 示例说明
├── docs/                   # 用户文档
│   ├── getting-started.md # 快速开始
│   ├── streaming.md       # 流式渲染
│   ├── typing-effect.md   # 打字机效果
│   └── ui-components.md   # UI 组件
├── dev/                    # 开发文档
│   ├── DEVELOPMENT.md     # 开发指南
│   ├── TODO.md            # 待办清单
│   └── TESTING.md         # 测试指南
├── test/                   # 测试文件
│   ├── components/        # 组件测试
│   ├── formatters/        # 格式化器测试
│   ├── utils/             # 工具测试
│   └── README.md          # 测试说明
└── package.json
```

---

## 🧪 开发与测试

### 开发

```bash
# 安装依赖
npm install

# 开发模式(监听文件变化)
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

# 运行 UI 演示
npm run demo:ui
npm run demo:ui:streaming
npm run demo:basic

# 运行表格测试
npm run test:table
```

---

## 📋 待办事项

- [ ] 完善格式化工具
  - [ ] 高级 Markdown 渲染(marked-terminal)
  - [ ] 代码语法高亮(cli-highlight)
  - [ ] 表格渲染(cli-table3)
- [ ] 实现 UI 组件
  - [ ] Box 组件(边框盒子)
  - [ ] Spinner 组件(加载动画)
  - [ ] Progress 组件(进度条)
- [ ] 实现消息处理器
  - [ ] 独立的 Handler 类
  - [ ] 插件化架构
- [ ] 流式渲染支持
- [ ] 打字机效果
- [ ] 交互模式
- [ ] 完善测试覆盖
- [ ] 性能优化

---

## 📚 文档

### 用户文档

- 🚀 [UI 快速开始](./docs/UI_QUICK_START.md) - 5分钟上手 UI 框架（推荐）
- 📖 [快速开始](./docs/getting-started.md) - 基础使用指南
- ✨ [UI 增强功能](./docs/ui-enhancements.md) - 详细了解新的视觉体验
- 🎬 [流式渲染](./docs/streaming.md) - 实时显示 Claude 的响应
- ⌨️ [打字机效果](./docs/typing-effect.md) - 优雅的逐字符输出
- 🎨 [UI 组件](./docs/ui-components.md) - 5 个开箱即用的终端组件
- 🔧 [UI 渲染器指南](./docs/UI_RENDERER.md) - 完整的 UI 渲染器文档
- 📋 [UI 迁移指南](./docs/UI_MIGRATION_GUIDE.md) - 从旧版迁移到 UI

### 开发文档

- 🔧 [开发指南](./dev/DEVELOPMENT.md) - 技术实现和架构设计
- 📋 [待办清单](./dev/TODO.md) - 项目进度和计划
- 🧪 [测试指南](./dev/TESTING.md) - 测试说明和故障排除

---

## 🤝 贡献

欢迎贡献!请查看以下资源:

- 📖 [开发指南](./dev/DEVELOPMENT.md) - 详细的技术设计和架构说明
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
- 💬 [问题反馈](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 📦 [npm 包](https://www.npmjs.com/package/claude-agent-sdk-ui)

---

<div align="center">

**让每个开发者都能轻松构建美观、专业的 AI Agent CLI 应用!** 🚀

Made with ❤️ for the Claude Agent SDK Community

[⭐ Star 支持我们](https://github.com/yangyang0507/claude-agent-sdk-ui) | [📖 快速开始](./docs/quick-start-enhanced.md) | [🐛 报告问题](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)

</div>
