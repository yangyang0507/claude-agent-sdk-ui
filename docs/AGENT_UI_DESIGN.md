# Claude Agent SDK CLI UI 工具包 - 设计文档

> 为 Claude Agent SDK 提供开箱即用的美观 CLI UI 渲染体验

## 📋 项目概述

### 项目定位

**项目名称**: `@anthropic-ai/agent-ui` 或 `claude-agent-ui`

**核心价值**:
- 一行代码实现 Claude Code 级别的 CLI UI 渲染体验
- 开箱即用的美观、交互式消息流展示
- 与 Claude Agent SDK 无缝集成

### 使用示例

```typescript
// 极简 API - 一行代码搞定
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderAgent } from '@anthropic-ai/agent-ui';

for await (const message of query({
  prompt: "帮我分析这个代码",
  options: {
    maxTurns: 10,
    allowedTools: ["Read", "Grep"]
  }
})) {
  await renderAgent(message);
}
```

---

## 🏗️ 架构设计

### 项目结构

```
claude-agent-ui/
├── src/
│   ├── core/                        # 核心模块
│   │   ├── renderer.ts              # 核心渲染引擎
│   │   ├── state-manager.ts         # UI 状态管理
│   │   └── message-parser.ts        # 消息解析器
│   │
│   ├── components/                  # UI 组件
│   │   ├── message/                 # 消息组件
│   │   │   ├── text-message.ts      # 文本消息组件
│   │   │   ├── tool-use.ts          # 工具调用展示
│   │   │   ├── tool-result.ts       # 工具结果展示
│   │   │   └── thinking-block.ts    # 思考过程展示
│   │   │
│   │   ├── progress/                # 进度组件
│   │   │   ├── spinner.ts           # 加载动画
│   │   │   ├── progress-bar.ts      # 进度条
│   │   │   └── todo-list.ts         # TODO 列表展示
│   │   │
│   │   ├── code/                    # 代码相关
│   │   │   ├── code-block.ts        # 代码块高亮
│   │   │   ├── diff-viewer.ts       # 代码差异对比
│   │   │   └── file-tree.ts         # 文件树展示
│   │   │
│   │   └── interactive/             # 交互组件
│   │       ├── confirm-prompt.ts    # 确认提示
│   │       ├── select-prompt.ts     # 选择菜单
│   │       └── input-prompt.ts      # 用户输入
│   │
│   ├── formatters/                  # 格式化工具
│   │   ├── markdown.ts              # Markdown 渲染
│   │   ├── syntax-highlight.ts      # 语法高亮
│   │   └── table.ts                 # 表格格式化
│   │
│   ├── themes/                      # 主题系统
│   │   ├── default.ts               # 默认主题
│   │   ├── dark.ts                  # 暗色主题
│   │   └── light.ts                 # 亮色主题
│   │
│   ├── utils/                       # 工具函数
│   │   ├── terminal.ts              # 终端工具函数
│   │   ├── stream-handler.ts        # 流式处理
│   │   └── error-handler.ts         # 错误处理
│   │
│   └── index.ts                     # 主入口
│
├── examples/                        # 示例代码
│   ├── basic.ts                     # 基础使用
│   ├── advanced.ts                  # 高级配置
│   └── react-mode.ts                # React 组件模式
│
├── tests/                           # 测试文件
│   ├── unit/                        # 单元测试
│   └── integration/                 # 集成测试
│
├── docs/                            # 文档
│   ├── api.md                       # API 文档
│   ├── themes.md                    # 主题定制指南
│   └── examples.md                  # 使用示例
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ 技术栈

### 核心依赖

```json
{
  "dependencies": {
    // === UI 渲染框架 ===
    "@inkjs/ui": "^2.0.0",              // React for CLI 组件库
    "ink": "^5.0.1",                     // React renderer for CLI
    "react": "^18.3.1",

    // === 样式和颜色 ===
    "chalk": "^5.3.0",                   // 终端颜色输出
    "chalk-animation": "^2.0.3",        // 文字动画效果
    "gradient-string": "^2.0.2",        // 渐变色文字

    // === 交互组件 ===
    "ora": "^8.0.1",                     // 优雅的加载动画
    "cli-spinners": "^3.0.0",           // 各种 spinner 样式
    "cli-progress": "^3.12.0",          // 进度条
    "boxen": "^7.1.1",                   // 创建漂亮的边框盒子
    "figures": "^6.1.0",                 // Unicode 符号集合

    // === Markdown 和代码高亮 ===
    "marked": "^12.0.0",                 // Markdown 解析器
    "marked-terminal": "^7.0.0",        // 终端 Markdown 渲染
    "highlight.js": "^11.9.0",          // 语法高亮
    "cli-highlight": "^2.1.11",         // 终端代码高亮

    // === 表格和布局 ===
    "cli-table3": "^0.6.3",             // 美观的表格
    "terminal-link": "^3.0.0",          // 终端超链接
    "string-width": "^7.1.0",           // 准确计算字符串宽度
    "wrap-ansi": "^9.0.0",              // ANSI 字符串换行

    // === 交互式输入 ===
    "prompts": "^2.4.2",                // 交互式命令行提示
    "enquirer": "^2.4.1",               // 强大的交互式提示库

    // === 任务和日志 ===
    "log-symbols": "^6.0.0",            // 彩色符号 (✔ ✖ ⚠ ℹ)
    "listr2": "^8.0.0",                 // 任务列表渲染

    // === 工具库 ===
    "nanoid": "^5.0.5",                 // 生成唯一 ID
    "dayjs": "^1.11.10",                // 时间格式化
    "strip-ansi": "^7.1.0"              // 移除 ANSI 代码
  }
}
```

### 开发依赖

```json
{
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",                   // TypeScript 打包工具
    "vitest": "^1.2.0",                 // 测试框架
    "@vitest/ui": "^1.2.0",
    "prettier": "^3.2.4",
    "eslint": "^8.56.0"
  }
}
```

---

## 🎯 核心功能特性

### 1. 流式消息渲染

实时流式输出,支持打字机效果:

```typescript
renderAgent(message, {
  streaming: true,
  typingEffect: true,
  speed: 50  // 打字速度 (ms)
});
```

### 2. 工具调用可视化

```
┌─ 🔧 Tool: Read
│  file_path: /src/app.ts
│  ⏱️  执行中...
└─ ✅ 完成 (245ms)
   ├─ 读取 1,234 行
   └─ 文件大小: 45.2 KB
```

### 3. 思考过程展示

```
💭 思考中...
├─ 分析代码结构
├─ 查找潜在问题
└─ 生成修复方案
```

### 4. TODO 列表集成

```
📋 任务进度
├─ ✅ 分析项目结构
├─ 🔄 修复 TypeScript 错误 (3/10)
├─ ⏳ 运行测试
└─ ⏸️  生成文档
```

### 5. 代码高亮和 Diff

```typescript
// 支持多种语言语法高亮
// 支持 diff 对比显示
- const oldCode = 'old';
+ const newCode = 'new';
```

### 6. 主题定制

```typescript
renderAgent(message, {
  theme: 'dark',  // 'dark' | 'light' | 'custom'
  colors: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
});
```

### 7. 交互式确认

```
⚠️  即将删除 3 个文件:
  - old-file-1.ts
  - old-file-2.ts
  - old-file-3.ts

❯ 确定要继续吗? (y/N)
```

---

## 📦 API 设计

### 基础 API

```typescript
// 1. 简单模式 - 一键渲染
import { renderAgent } from '@anthropic-ai/agent-ui';

for await (const msg of query(...)) {
  await renderAgent(msg);
}

// 2. 高级模式 - 完全控制
import { AgentRenderer } from '@anthropic-ai/agent-ui';

const renderer = new AgentRenderer({
  theme: 'dark',
  showTimestamps: true,
  showTokenUsage: true,
  compactMode: false
});

for await (const msg of query(...)) {
  await renderer.render(msg);
}

// 3. React 组件模式 (基于 Ink)
import { render } from 'ink';
import { AgentUI } from '@anthropic-ai/agent-ui';

render(<AgentUI stream={query(...)} />);
```

### 配置选项

```typescript
interface RenderOptions {
  // === 显示选项 ===
  theme?: 'dark' | 'light' | ThemeConfig;
  showTimestamps?: boolean;
  showTokenUsage?: boolean;
  showToolDetails?: boolean;
  compactMode?: boolean;

  // === 流式选项 ===
  streaming?: boolean;
  typingEffect?: boolean;
  typingSpeed?: number;

  // === 交互选项 ===
  interactive?: boolean;
  confirmActions?: boolean;

  // === 格式化 ===
  codeHighlight?: boolean;
  markdownRendering?: boolean;
  maxWidth?: number;

  // === 自定义渲染器 ===
  customRenderers?: {
    [toolName: string]: (data: any) => string;
  };

  // === 回调函数 ===
  onToolStart?: (tool: string) => void;
  onToolEnd?: (tool: string, result: any) => void;
  onError?: (error: Error) => void;
}
```

### 主题配置

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: string;
    dim: string;
  };

  symbols: {
    success: string;
    error: string;
    warning: string;
    info: string;
    pending: string;
    spinner: string[];
  };

  borders: {
    style: 'single' | 'double' | 'round' | 'bold';
    color: string;
  };
}
```

---

## 🚀 实施路线图

### Phase 1: MVP 核心功能 (2-3 周)

#### Week 1: 项目基础
- [ ] 初始化项目结构
  - [ ] TypeScript + tsup 配置
  - [ ] 测试环境搭建 (Vitest)
  - [ ] CI/CD 配置 (GitHub Actions)
  - [ ] ESLint + Prettier 配置

- [ ] 核心渲染引擎
  - [ ] 消息解析器实现
  - [ ] 流式渲染处理逻辑
  - [ ] 状态管理系统
  - [ ] 错误处理机制

#### Week 2-3: 基础组件
- [ ] 文本消息渲染
  - [ ] 用户消息显示
  - [ ] Claude 回复显示
  - [ ] 系统提示显示

- [ ] 工具调用展示
  - [ ] 工具名称和参数显示
  - [ ] 执行状态动画 (Ora)
  - [ ] 执行结果展示
  - [ ] 耗时统计

- [ ] 代码块高亮
  - [ ] 多语言语法高亮 (highlight.js)
  - [ ] 行号显示
  - [ ] 代码复制提示

---

### Phase 2: 进阶功能 (2-3 周)

#### Week 4-5: 高级组件
- [ ] TODO 列表集成
  - [ ] 任务状态图标
  - [ ] 进度条显示
  - [ ] 实时更新

- [ ] Diff 对比查看器
  - [ ] 并排对比模式
  - [ ] 统一对比模式
  - [ ] 颜色高亮

- [ ] 表格渲染
  - [ ] 自适应宽度
  - [ ] 多种边框样式
  - [ ] 数据对齐

- [ ] 文件树展示
  - [ ] 递归目录结构
  - [ ] 文件图标
  - [ ] 折叠/展开

#### Week 6: 主题和交互
- [ ] 主题系统
  - [ ] 默认主题实现
  - [ ] 暗色主题
  - [ ] 亮色主题
  - [ ] 自定义主题加载

- [ ] 交互功能
  - [ ] 确认提示 (prompts)
  - [ ] 选择菜单 (enquirer)
  - [ ] 文本输入框
  - [ ] 多选框

---

### Phase 3: 优化和完善 (1-2 周)

#### Week 7: 性能优化
- [ ] 大量消息渲染优化
  - [ ] 虚拟滚动
  - [ ] 增量渲染
  - [ ] 渲染节流

- [ ] 内存管理
  - [ ] 消息历史限制
  - [ ] 自动清理机制
  - [ ] 内存泄漏检测

- [ ] 流式渲染优化
  - [ ] Buffer 管理
  - [ ] 批量更新
  - [ ] 防抖处理

#### Week 8: 文档和测试
- [ ] 文档编写
  - [ ] API 文档
  - [ ] 快速开始指南
  - [ ] 使用示例集
  - [ ] 最佳实践
  - [ ] FAQ

- [ ] 测试覆盖
  - [ ] 单元测试 (组件)
  - [ ] 集成测试 (流程)
  - [ ] 快照测试 (UI)
  - [ ] 性能测试

- [ ] 发布准备
  - [ ] npm 包配置
  - [ ] 版本管理
  - [ ] Changelog 生成
  - [ ] 发布到 npm

---

## 🎨 视觉效果示例

### 完整交互流程

```
╭─────────────────────────────────────────────╮
│  🤖 Claude Agent                            │
╰─────────────────────────────────────────────╯

💬 用户: 帮我分析这个 TypeScript 项目

🧠 Claude: 好的,我来帮你分析这个项目。让我先查看项目结构。

┌─ 🔧 工具调用: Glob
│  pattern: **/*.ts
│  ⏱️  执行中... ━━━━━━━━━━━━━━━━━━━━ 100%
└─ ✅ 完成 (182ms)

📂 找到 23 个 TypeScript 文件:
  src/
  ├─ index.ts
  ├─ app.ts
  └─ utils/
     ├─ helper.ts
     └─ formatter.ts

💭 正在分析代码结构...

┌─ 🔧 工具调用: Read
│  file_path: src/index.ts
└─ ✅ 完成 (45ms)

```typescript
// src/index.ts
export * from './app';
export * from './utils';
```

📊 分析结果:
┌──────────────────────┬─────────┐
│ 指标                 │ 数值    │
├──────────────────────┼─────────┤
│ 总文件数             │ 23      │
│ 总代码行数           │ 1,234   │
│ TypeScript 版本      │ 5.3.3   │
│ 类型覆盖率           │ 92%     │
└──────────────────────┴─────────┘

✅ 项目结构清晰,类型定义完善!

⏱️  总耗时: 2.3s | 💰 Token: 1,234
```

---

## 💡 技术亮点

### 1. 基于 Ink 的组件化架构
- React 开发体验,组件可复用
- 声明式 UI,易于理解和维护
- 完善的生态系统和社区支持

### 2. 智能流式渲染
- 实时显示 Agent 输出,无需等待
- 自动处理 ANSI 转义码和颜色
- 优雅的加载动画和过渡效果

### 3. 丰富的可视化组件
- 20+ 开箱即用的 UI 组件
- 完全可定制的主题系统
- 响应式布局自动适配终端宽度

### 4. 极简 API 设计
- 一行代码即可实现基础渲染
- 渐进式配置选项,简单到复杂
- TypeScript 类型安全,智能提示

### 5. 高性能设计
- 增量渲染优化,只更新变化部分
- 虚拟化长列表,处理大量消息
- 内存占用优化,防止内存泄漏

### 6. 跨平台兼容
- 支持 macOS、Linux、Windows
- 自动检测终端能力
- 降级方案确保基础功能

---

## 📚 使用示例

### 示例 1: 基础使用

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderAgent } from '@anthropic-ai/agent-ui';

async function main() {
  for await (const message of query({
    prompt: "分析当前项目结构",
    options: {
      maxTurns: 10,
      allowedTools: ["Read", "Glob", "Grep"]
    }
  })) {
    await renderAgent(message);
  }
}

main();
```

### 示例 2: 自定义配置

```typescript
import { AgentRenderer } from '@anthropic-ai/agent-ui';

const renderer = new AgentRenderer({
  theme: 'dark',
  showTimestamps: true,
  showTokenUsage: true,
  codeHighlight: true,
  interactive: true,
  maxWidth: 120
});

async function main() {
  for await (const message of query({
    prompt: "修复代码中的 TypeScript 错误"
  })) {
    await renderer.render(message);
  }
}

main();
```

### 示例 3: React 组件模式

```typescript
import { render } from 'ink';
import { AgentUI } from '@anthropic-ai/agent-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

const stream = query({
  prompt: "重构这个项目的架构"
});

render(
  <AgentUI
    stream={stream}
    theme="dark"
    showProgress={true}
  />
);
```

### 示例 4: 自定义工具渲染器

```typescript
import { AgentRenderer } from '@anthropic-ai/agent-ui';

const renderer = new AgentRenderer({
  customRenderers: {
    // 自定义 Read 工具的显示方式
    'Read': (data) => {
      return `📖 读取文件: ${data.file_path}\n` +
             `   行数: ${data.lines}\n` +
             `   大小: ${data.size}`;
    },

    // 自定义 Bash 命令的显示方式
    'Bash': (data) => {
      return `💻 执行命令: ${data.command}\n` +
             `   退出码: ${data.exitCode}`;
    }
  }
});
```

### 示例 5: 主题定制

```typescript
import { AgentRenderer } from '@anthropic-ai/agent-ui';

const customTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    text: '#F3F4F6',
    dim: '#6B7280'
  },
  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '○',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  },
  borders: {
    style: 'round',
    color: '#3B82F6'
  }
};

const renderer = new AgentRenderer({
  theme: customTheme
});
```

---

## 🎯 关键差异化优势

### 1. 官方级别体验
- 完全模仿 Claude Code 官方 CLI 的 UI/UX
- 经过实战检验的设计模式
- 专业、美观、易用

### 2. 开箱即用
- 零配置即可获得美观的输出
- 合理的默认值,开箱即用
- 降低使用门槛

### 3. 高度可定制
- 主题、颜色、布局完全可配置
- 支持自定义组件渲染器
- 灵活适配各种使用场景

### 4. 类型安全
- 完整的 TypeScript 类型定义
- 智能代码补全和提示
- 编译时错误检查

### 5. 轻量级
- 核心包 < 50KB (gzip)
- 按需加载,tree-shaking 友好
- 最小化依赖数量

### 6. 性能优异
- 处理大量消息也流畅
- 增量渲染优化
- 内存占用低

### 7. 跨平台支持
- 支持 macOS、Linux、Windows
- 自适应终端能力
- 完善的兼容性测试

---

## 📊 项目指标

### 质量目标
- 代码测试覆盖率: ≥ 85%
- TypeScript 类型覆盖率: 100%
- 文档完整度: ≥ 90%
- 性能基准: 1000 条消息 < 1s

### 包大小目标
- 核心包 (gzip): < 50KB
- 完整包 (gzip): < 200KB
- 依赖数量: < 20 个

### 兼容性目标
- Node.js: ≥ 18.0.0
- TypeScript: ≥ 5.0.0
- 终端: iTerm2, Terminal.app, Windows Terminal, etc.

---

## 🔗 相关资源

- [Claude Agent SDK 文档](https://docs.anthropic.com/agent-sdk)
- [Ink 文档](https://github.com/vadimdemedes/ink)
- [Chalk 文档](https://github.com/chalk/chalk)
- [Ora 文档](https://github.com/sindresorhus/ora)

---

## 📝 待办事项

### 立即开始
- [ ] 创建 GitHub 仓库
- [ ] 初始化项目结构
- [ ] 设置开发环境
- [ ] 编写第一个 Demo

### 近期计划
- [ ] 实现核心渲染引擎
- [ ] 开发基础组件
- [ ] 编写单元测试
- [ ] 发布 Alpha 版本

### 长期规划
- [ ] 社区反馈收集
- [ ] 性能优化迭代
- [ ] 功能扩展
- [ ] 稳定版本发布

---

## 🤝 贡献指南

欢迎社区贡献! 计划支持以下贡献方式:
- Bug 报告和修复
- 新功能建议和实现
- 文档改进
- 示例代码
- 性能优化

---

## 📄 许可证

MIT License

---

**让每个开发者都能轻松构建美观、专业的 AI Agent CLI 应用!** 🚀
