# Claude Agent SDK UI

<div align="center">

**一行代码实现 Claude Code 级别的 CLI UI 渲染体验**

为 Claude Agent SDK 提供开箱即用的美观 CLI UI 渲染

</div>

---

## ✨ 特性

- 🎨 **开箱即用** - 零配置即可获得美观的终端 UI
- 🚀 **极简 API** - 一行代码实现消息渲染
- 🎭 **主题系统** - 内置暗色/亮色主题,支持完全自定义
- 📊 **丰富组件** - 工具调用、代码高亮、Markdown 渲染、表格等
- ⚡ **高性能** - 优化的渲染引擎,流畅处理大量消息
- 🔧 **可扩展** - 支持自定义工具渲染器和回调
- 💪 **类型安全** - 完整的 TypeScript 类型定义

---

## 📦 安装

```bash
npm install claude-agent-sdk-ui
```

**要求:**
- Node.js >= 18.0.0
- TypeScript >= 5.0.0

---

## 🚀 快速开始

### 基础用法

```typescript
import { renderAgent } from 'claude-agent-sdk-ui';

// 简单消息渲染
await renderAgent({
  role: 'assistant',
  content: '你好!我是 Claude,很高兴为你服务。',
  timestamp: Date.now()
});
```

### 使用 AgentRenderer

```typescript
import { AgentRenderer } from 'claude-agent-sdk-ui';

const renderer = new AgentRenderer({
  theme: 'dark',
  showTimestamps: true,
  showTokenUsage: true,
  codeHighlight: true
});

// 渲染标题
renderer.renderHeader('🤖 Claude Agent');

// 渲染消息
await renderer.render({
  role: 'user',
  content: '帮我分析这个项目',
  timestamp: Date.now()
});

// 渲染分隔线
renderer.renderDivider();

// 渲染统计信息
renderer.renderFooter({
  duration: 2300,
  tokens: 1234
});
```

---

## 📚 完整示例

### 示例 1: 工具调用展示

```typescript
import { AgentRenderer } from 'claude-agent-sdk-ui';

const renderer = new AgentRenderer();

// 工具调用消息
await renderer.render({
  role: 'assistant',
  content: [
    {
      type: 'tool_use',
      id: 'tool_1',
      name: 'Read',
      input: {
        file_path: './package.json'
      }
    }
  ],
  timestamp: Date.now()
});

// 工具结果
await renderer.render({
  role: 'assistant',
  content: [
    {
      type: 'tool_result',
      tool_use_id: 'tool_1',
      output: '{ "name": "my-project", "version": "1.0.0" }'
    }
  ],
  timestamp: Date.now()
});
```

**输出效果:**
```
┌─ 🔧 工具调用: Read
│  file_path: "./package.json"
│  ⏱️  执行中...
└─ ✓ 完成 (245ms)
   ├─ 读取 5 行
   └─ 文件大小: 234 B
```

### 示例 2: Markdown 渲染

```typescript
await renderer.render({
  role: 'assistant',
  content: `
## 分析结果

这是一个 **TypeScript** 项目:

\`\`\`typescript
export function hello() {
  return "world";
}
\`\`\`

**主要特点:**
- ✅ 类型安全
- ✅ 代码清晰
- ✅ 结构良好
  `,
  timestamp: Date.now()
});
```

### 示例 3: 自定义主题

```typescript
const customTheme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#95E1D3',
    warning: '#FFE66D',
    error: '#FF6B6B',
    info: '#48B5FF',
    text: '#F7FFF7',
    dim: '#AAA'
  },
  symbols: {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    pending: '○',
    spinner: ['◐', '◓', '◑', '◒']
  },
  borders: {
    style: 'round',
    color: '#FF6B6B'
  }
};

const renderer = new AgentRenderer({ theme: customTheme });
```

### 示例 4: 自定义工具渲染器

```typescript
const renderer = new AgentRenderer({
  customRenderers: {
    // 自定义 Read 工具的显示
    'Read': (data) => {
      return `📖 读取文件: ${data.input.file_path}`;
    },

    // 自定义 Bash 命令的显示
    'Bash': (data) => {
      return `💻 执行命令: ${data.input.command}`;
    }
  },

  // 回调函数
  onToolStart: (tool) => {
    console.log(`[开始] ${tool}`);
  },

  onToolEnd: (tool, result) => {
    console.log(`[完成] ${tool}`);
  }
});
```

---

## 🎨 主题系统

### 内置主题

```typescript
import { darkTheme, lightTheme, defaultTheme } from 'claude-agent-sdk-ui';

// 使用暗色主题
const renderer = new AgentRenderer({ theme: darkTheme });

// 使用亮色主题
const renderer = new AgentRenderer({ theme: lightTheme });

// 使用默认主题
const renderer = new AgentRenderer({ theme: defaultTheme });
```

### 主题配置

```typescript
interface ThemeConfig {
  colors: {
    primary: string;      // 主色调
    secondary: string;    // 次要色
    success: string;      // 成功色
    warning: string;      // 警告色
    error: string;        // 错误色
    info: string;         // 信息色
    text: string;         // 文本色
    dim: string;          // 暗淡色
  };
  symbols: {
    success: string;      // 成功符号
    error: string;        // 错误符号
    warning: string;      // 警告符号
    info: string;         // 信息符号
    pending: string;      // 等待符号
    spinner: string[];    // 加载动画帧
  };
  borders: {
    style: 'single' | 'double' | 'round' | 'bold' | 'none';
    color: string;
  };
}
```

---

## ⚙️ 配置选项

### RenderOptions

```typescript
interface RenderOptions {
  // 显示选项
  theme?: 'dark' | 'light' | ThemeConfig;
  showTimestamps?: boolean;      // 显示时间戳
  showTokenUsage?: boolean;      // 显示 Token 使用量
  showToolDetails?: boolean;     // 显示工具详情
  compactMode?: boolean;         // 紧凑模式

  // 流式选项
  streaming?: boolean;           // 流式渲染
  typingEffect?: boolean;        // 打字机效果
  typingSpeed?: number;          // 打字速度 (ms)

  // 交互选项
  interactive?: boolean;         // 交互模式
  confirmActions?: boolean;      // 确认操作

  // 格式化
  codeHighlight?: boolean;       // 代码高亮
  markdownRendering?: boolean;   // Markdown 渲染
  maxWidth?: number;             // 最大宽度

  // 自定义渲染器
  customRenderers?: {
    [toolName: string]: (data: any) => string;
  };

  // 回调函数
  onToolStart?: (tool: string) => void;
  onToolEnd?: (tool: string, result: any) => void;
  onError?: (error: Error) => void;
}
```

---

## 📖 API 文档

### `renderAgent(message, options?)`

简单的消息渲染函数,适合快速使用。

```typescript
await renderAgent(message, {
  theme: 'dark',
  showTimestamps: true
});
```

### `AgentRenderer`

完整的渲染器类,提供更多控制和功能。

#### 方法

- **`render(message)`** - 渲染一条消息
- **`renderHeader(text)`** - 渲染标题
- **`renderDivider()`** - 渲染分隔线
- **`renderFooter(stats)`** - 渲染页脚统计信息

```typescript
const renderer = new AgentRenderer(options);

await renderer.render(message);
renderer.renderHeader('标题');
renderer.renderDivider();
renderer.renderFooter({ duration: 1000, tokens: 500 });
```

---

## 🛠️ 工具函数

### 格式化工具

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
  highlightCode,
  renderMarkdown
} from 'claude-agent-sdk-ui';

// 格式化字节
formatBytes(1234567); // "1.18 MB"

// 格式化时长
formatDuration(123456); // "2.1m"

// 格式化数字
formatNumber(1234567); // "1,234,567"

// 代码高亮
const highlighted = highlightCode(code, 'typescript');

// Markdown 渲染
const rendered = renderMarkdown('**Hello** _World_');
```

---

## 🎯 支持的消息类型

### 文本消息

```typescript
{
  role: 'user' | 'assistant' | 'system',
  content: string,
  timestamp?: number
}
```

### 复合消息

```typescript
{
  role: 'assistant',
  content: [
    { type: 'text', text: '...' },
    { type: 'tool_use', id: '...', name: '...', input: {...} },
    { type: 'tool_result', tool_use_id: '...', output: '...' },
    { type: 'thinking', text: '...' }
  ],
  timestamp?: number
}
```

---

## 📝 运行示例

项目包含 3 个完整示例:

```bash
# 基础示例
npm run example:basic

# 高级示例
npm run example:advanced

# 主题示例
npm run example:themes
```

在 `package.json` 中添加脚本:

```json
{
  "scripts": {
    "example:basic": "tsx examples/basic.ts",
    "example:advanced": "tsx examples/advanced.ts",
    "example:themes": "tsx examples/themes.ts"
  }
}
```

---

## 🏗️ 项目结构

```
claude-agent-ui/
├── src/
│   ├── core/              # 核心渲染引擎
│   ├── components/        # UI 组件
│   ├── formatters/        # 格式化工具
│   ├── themes/            # 主题系统
│   ├── utils/             # 工具函数
│   └── types.ts           # TypeScript 类型
├── examples/              # 示例代码
├── tests/                 # 测试文件
└── docs/                  # 文档
```

---

## 🧪 测试

```bash
# 运行测试
npm test

# 运行测试 UI
npm run test:ui

# 类型检查
npm run typecheck
```

---

## 🤝 贡献

欢迎贡献! 请查看 [AGENT_UI_DESIGN.md](./AGENT_UI_DESIGN.md) 了解项目设计和实施计划。

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

## 🔗 相关链接

- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Claude Code 文档](https://docs.anthropic.com/claude-code)
- [问题反馈](https://github.com/your-repo/issues)

---

<div align="center">

**让每个开发者都能轻松构建美观、专业的 AI Agent CLI 应用!** 🚀

Made with ❤️ by the Claude Agent SDK Community

</div>
