# Claude Agent SDK UI - 开发文档

> 最后更新: 2025-10-13

本文档汇总了项目的技术实现细节、开发历程和架构设计,面向贡献者和维护者。

---

## 📊 项目概览

Claude Agent SDK UI 是一个为 [@anthropic-ai/claude-agent-sdk](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) 提供精美 CLI UI 渲染的组件库。

### 核心特性

- 🎨 **完整的消息渲染** - 支持所有 SDK 消息类型
- 🚀 **流式渲染** - 实时显示 Claude 的响应
- ⌨️  **打字机效果** - 优雅的逐字符输出
- 🎁 **UI 组件库** - 5 个开箱即用的终端组件
- 📝 **Markdown 支持** - 代码高亮、表格、列表等
- 🎭 **主题系统** - 深色/浅色主题 + 完全自定义
- 📦 **零配置** - 一行代码即可使用

### 项目统计

- **总代码量**: ~5,000 行 TypeScript
- **核心文件**: 20+ 个模块
- **组件数量**: 5 个 UI 组件
- **测试覆盖**: 开发中
- **文档行数**: 3,000+ 行

---

## 🏗️ 架构设计

### 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户代码                              │
│  import { renderQuery } from 'claude-agent-sdk-ui'           │
│  await renderQuery(query({ prompt: '...' }))                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Renderer (核心)                          │
│  - 消息类型分发                                               │
│  - 状态管理                                                   │
│  - 主题应用                                                   │
└─────┬───────┬───────┬──────────┬──────────┬────────────────┘
      │       │       │          │          │
      ▼       ▼       ▼          ▼          ▼
   ┌────┐ ┌─────┐ ┌──────┐ ┌────────┐ ┌─────────┐
   │Msg │ │Theme│ │Format│ │Stream  │ │Component│
   │Type│ │     │ │      │ │Renderer│ │         │
   └────┘ └─────┘ └──────┘ └────────┘ └─────────┘
```

### 模块划分

```
src/
├── types/                    # 类型定义层
│   ├── messages.ts           # SDK 消息类型 & 类型守卫
│   ├── theme.ts              # 主题系统类型
│   ├── renderer.ts           # 渲染器配置类型
│   └── index.ts              # 类型总出口
│
├── themes/                   # 主题系统层
│   ├── dark.ts               # 深色主题
│   ├── light.ts              # 浅色主题
│   └── index.ts              # 主题工厂
│
├── utils/                    # 工具函数层
│   ├── string.ts             # 字符串处理
│   ├── time.ts               # 时间格式化
│   ├── terminal.ts           # 终端控制
│   ├── cursor.ts             # 光标控制
│   └── typing-effect.ts      # 打字机效果
│
├── formatters/               # 格式化器层
│   ├── markdown.ts           # Markdown 渲染
│   ├── json.ts               # JSON 美化
│   ├── table.ts              # 表格渲染
│   └── index.ts              # 格式化器出口
│
├── components/               # UI 组件层
│   ├── box.ts                # Box 组件
│   ├── divider.ts            # Divider 组件
│   ├── badge.ts              # Badge 组件
│   ├── spinner.ts            # Spinner 组件
│   └── progress.ts           # Progress 组件
│
├── renderer.ts               # 核心渲染器
├── stream-renderer.ts        # 流式渲染器
└── index.ts                  # 主入口
```

---

## ✅ 已完成功能

### 1. 核心渲染系统 (100%)

#### 消息类型支持

- ✅ **System 消息** - 初始化信息展示
- ✅ **Assistant 消息** - 文本、思考、工具调用
- ✅ **User 消息** - 工具结果
- ✅ **Result 消息** - 最终统计
- ✅ **Partial 消息** - 流式事件

#### 渲染器特性

- ✅ 状态管理 (session, turns, tokens, cost)
- ✅ 主题系统集成
- ✅ 配置选项完整
- ✅ 错误处理
- ✅ 性能优化

**核心代码**: `src/renderer.ts` (362 行)

### 2. 流式渲染 (100%)

#### StreamRenderer 类

**文件**: `src/stream-renderer.ts` (328 行)

**功能**:
- ✅ 处理 `SDKPartialAssistantMessage` 事件
- ✅ 支持所有流式事件类型
- ✅ 实时内容累积和渲染
- ✅ 60fps 更新频率 (16ms 节流)
- ✅ TTY/非TTY 环境自动适配
- ✅ 工具调用实时可视化
- ✅ 思考过程实时显示

**技术细节**:

```typescript
// 状态管理
interface StreamState {
  text: string;              // 累积文本
  thinking: string;          // 累积思考
  currentToolUse: {...};     // 当前工具
  completedToolUses: [...];  // 完成的工具
  stopReason: string | null;
  displayedLines: number;    // 屏幕行数管理
  isStreaming: boolean;
}

// 更新流程
message_start → content_block_delta → message_stop
                      ↓
                  累积状态 (16ms 节流)
                      ↓
                   渲染更新
```

#### CursorController 类

**文件**: `src/utils/cursor.ts` (197 行)

**功能**:
- ✅ ANSI 转义码封装
- ✅ 光标显示/隐藏
- ✅ 光标移动 (上/下/左/右)
- ✅ 行/屏幕清除
- ✅ 位置保存/恢复
- ✅ TTY 检测

**使用场景**:
- 流式渲染的原地更新
- 进度条动画
- 交互式 UI

### 3. 打字机效果 (100%)

#### TypingEffect 类

**文件**: `src/utils/typing-effect.ts` (336 行)

**功能**:
- ✅ 逐字符输出
- ✅ 速度控制 (可配置延迟)
- ✅ 随机速度变化 (模拟真人)
- ✅ 标点符号延迟 (自然停顿)
- ✅ 暂停/继续/取消/跳过
- ✅ 回调函数 (onChar, onComplete)
- ✅ 立即模式 (跳过动画)

**技术实现**:

```typescript
// 状态机
enum TypingState {
  IDLE = 'idle',
  TYPING = 'typing',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// 延迟计算
private calculateDelay(char: string): number {
  let delay = this.options.speed;
  
  // 标点延迟
  if (this.isPunctuation(char)) {
    delay += this.options.punctuationDelay;
  }
  
  // 随机变化
  if (this.options.randomize) {
    const randomFactor = 1 + (Math.random() * 2 - 1) * variation;
    delay *= randomFactor;
  }
  
  return delay;
}
```

### 4. UI 组件库 (100%)

#### Box 组件

**文件**: `src/components/box.ts` (389 行)

- ✅ 5 种边框样式 (single, double, round, bold, none)
- ✅ 标题支持 (可配置对齐)
- ✅ 内边距配置
- ✅ 文本对齐 (left, center, right)
- ✅ 文本自动换行
- ✅ 最小/最大宽度

#### Divider 组件

**文件**: `src/components/divider.ts` (193 行)

- ✅ 6 种样式 (light, heavy, double, dashed, dotted, unicode)
- ✅ 文本分隔线
- ✅ 对齐控制
- ✅ 自定义字符和颜色

#### Badge 组件

**文件**: `src/components/badge.ts` (236 行)

- ✅ 5 种类型 (success, error, warning, info, custom)
- ✅ 3 种样式 (filled, outlined, minimal)
- ✅ ASCII 安全模式
- ✅ 自动图标

**解决的问题**: Unicode 字符在某些终端渲染宽度不一致

#### Spinner 组件

**文件**: `src/components/spinner.ts` (247 行)

- ✅ 基于 ora 库
- ✅ 多种动画样式
- ✅ 成功/失败/警告/信息状态
- ✅ Promise 包装器

#### Progress 组件

**文件**: `src/components/progress.ts` (376 行)

- ✅ 基于 cli-progress 库
- ✅ 5 种样式 (default, simple, modern, minimal, detailed)
- ✅ 百分比和 ETA 显示
- ✅ TTY 环境检测
- ✅ 多进度条支持

**解决的问题**: 
- 进度条右括号缺失 (修复格式化函数)
- 非 TTY 环境降级

### 5. 格式化器 (100%)

#### Markdown 格式化器

**文件**: `src/formatters/markdown.ts` (180 行)

- ✅ 基于 marked + marked-terminal
- ✅ 代码高亮 (highlight.js via cli-highlight)
- ✅ 表格、列表、引用块
- ✅ 标题、链接、分隔线
- ✅ 行号支持
- ✅ 空行压缩

#### JSON 格式化器

**文件**: `src/formatters/json.ts` (110 行)

- ✅ 语法高亮
- ✅ 深度限制
- ✅ 键排序
- ✅ 行号显示

#### Table 格式化器

**文件**: `src/formatters/table.ts` (507 行)

- ✅ 基于 cli-table3
- ✅ 5 种边框样式
- ✅ 数组和对象数据
- ✅ 列宽自动计算
- ✅ 列对齐配置
- ✅ 文本自动换行

---

## 🔧 技术实现细节

### 1. 类型系统

#### 类型守卫

```typescript
// 消息类型守卫
export function isSystemInitMessage(message: SDKMessage): message is SDKSystemMessage {
  return message.type === 'system' && 'subtype' in message && message.subtype === 'init';
}

export function isPartialAssistantMessage(
  message: SDKMessage
): message is SDKPartialAssistantMessage {
  return message.type === 'stream_event';
}

// 内容类型守卫
export function isTextContent(content: MessageContent): content is TextContent {
  return content.type === 'text';
}
```

#### 类型导出

```typescript
// 重新导出 SDK 类型
export type {
  SDKMessage,
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
  SDKPartialAssistantMessage,
};

// 自定义类型
export type MessageContent = ...;
export type RendererOptions = ...;
export type Theme = ...;
```

### 2. 主题系统

#### 主题结构

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;     // 颜色配置
  symbols: ThemeSymbols;   // 符号配置
  borders: ThemeBorders;   // 边框配置
  layout: ThemeLayout;     // 布局配置
  toolIcons?: ToolIcons;   // 工具图标
}
```

#### 颜色应用

```typescript
export function applyThemeColor(
  text: string,
  colorType: keyof Theme['colors'],
  theme: Theme
): string {
  const color = theme.colors[colorType];
  return applyColor(text, color);
}
```

### 3. 流式渲染优化

#### 更新节流

```typescript
private updateThrottleMs = 16; // ~60fps

async processEvent(message: SDKPartialAssistantMessage): Promise<void> {
  const now = Date.now();
  
  // 节流检查
  if (now - this.lastUpdateTime < this.updateThrottleMs) {
    this.updateState(event); // 更新状态
    return; // 跳过渲染
  }
  
  this.updateState(event);
  this.render(); // 执行渲染
  this.lastUpdateTime = now;
}
```

#### 智能清除

```typescript
// 只清除之前显示的行
if (this.state.displayedLines > 1) {
  this.cursor.up(this.state.displayedLines - 1);
  for (let i = 0; i < this.state.displayedLines - 1; i++) {
    this.cursor.clearLine();
    this.cursor.down(1);
  }
  this.cursor.up(this.state.displayedLines - 1);
}
```

### 4. 性能优化

#### 字符串宽度计算

```typescript
import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';

// 计算可见宽度 (排除 ANSI 转义码)
const width = stringWidth(stripAnsi(text));
```

#### 文本截断

```typescript
export function truncateOutput(
  text: string,
  maxLines: number
): string {
  const lines = text.split('\n');
  if (lines.length <= maxLines) {
    return text;
  }
  
  const truncated = lines.slice(0, maxLines);
  const remaining = lines.length - maxLines;
  truncated.push(`... (${remaining} more lines)`);
  return truncated.join('\n');
}
```

---

## 🐛 已解决的问题

### 1. Table 表头错位

**问题**: test-table-alignment.ts 中 object data 测试的表头 "ID" 显示为 "I" 和 "D" 分两行

**原因**: 
- `styleHeaders()` 方法使用 chalk 给表头添加颜色
- ANSI 转义码使字符串长度从 2 增加到 12
- cli-table3 计算列宽时误判

**解决方案**:
- 移除手动的 `styleHeaders()` 方法
- 使用 cli-table3 的内置 `style.head` 选项
- 实现 `getHeadStyle()` 转换颜色格式

### 2. Box 组件边框错位

**问题**: Unicode 字符 (✔, ✘, ⚠, ℹ, •) 在某些终端的渲染宽度与 `stringWidth` 计算不一致

**解决方案**:
- Badge 组件添加 `asciiMode` 选项
- 创建 ASCII_ICONS 映射: ✔→[OK], ✘→[X], ⚠→[!], ℹ→[i]
- 主演示支持 `--ascii` 参数

### 3. Progress 右括号缺失

**问题**: 使用不存在的 `barCompleteString` 和 `barIncompleteString` 属性

**解决方案**:
- 改用 `barCompleteChar` 和 `barIncompleteChar`
- 使用 `repeat()` 方法构建进度条字符串
- 确保 completeChars + incompleteChars = barsize

### 4. 流式渲染 TypeScript 类型错误

**问题**: TypeScript 的类型收窄导致状态判断出错

**解决方案**:
- 使用 `getState()` 方法避免类型收窄
- 在循环中使用字符串比较而不是枚举值
- 使用 `const enum` 内联枚举值

---

## 📦 依赖管理

### 生产依赖

```json
{
  "chalk": "^5.3.0",              // 终端颜色
  "chalk-animation": "^2.0.3",    // 动画效果 (未使用)
  "cli-highlight": "^2.1.11",     // 代码高亮
  "cli-progress": "^3.12.0",      // 进度条
  "cli-spinners": "^3.0.0",       // Spinner 动画
  "cli-table3": "^0.6.5",         // 表格
  "dayjs": "^1.11.10",            // 时间处理
  "figures": "^6.1.0",            // Unicode 符号
  "gradient-string": "^2.0.2",    // 渐变文本 (未使用)
  "highlight.js": "^11.9.0",      // 语法高亮
  "log-symbols": "^6.0.0",        // 日志符号 (未使用)
  "marked": "^12.0.0",            // Markdown 解析
  "marked-terminal": "^7.0.0",    // Markdown 终端渲染
  "nanoid": "^5.0.5",             // ID 生成 (未使用)
  "ora": "^8.0.1",                // Spinner
  "strip-ansi": "^7.1.0",         // 移除 ANSI 码
  "string-width": "^7.1.0",       // 字符串宽度
  "terminal-link": "^3.0.0",      // 终端链接 (未使用)
  "wrap-ansi": "^9.0.0"           // 文本换行
}
```

### 开发依赖

```json
{
  "@types/node": "^20.11.5",
  "@typescript-eslint/eslint-plugin": "^6.19.0",
  "@typescript-eslint/parser": "^6.19.0",
  "@vitest/ui": "^1.2.0",
  "eslint": "^8.56.0",
  "prettier": "^3.2.4",
  "tsup": "^8.0.1",
  "tsx": "^4.7.0",
  "typescript": "^5.3.3",
  "vitest": "^1.2.0"
}
```

---

## 🚀 构建和发布

### 构建配置

**tsup.config.ts**:
```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
```

### npm scripts

```json
{
  "dev": "tsup --watch",
  "build": "tsup",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext .ts,.tsx",
  "format": "prettier --write \"src/**/*.{ts,tsx}\"",
  "test": "vitest",
  "prepublishOnly": "npm run build"
}
```

---

## 📈 未来计划

### 短期 (v0.2.0)

- [ ] 单元测试覆盖 > 80%
- [ ] 性能基准测试
- [ ] 更多代码高亮主题
- [ ] API 文档生成 (typedoc)

### 中期 (v0.3.0)

- [ ] 插件系统
- [ ] 自定义工具渲染器
- [ ] 更多 UI 组件 (Button, Select, etc.)
- [ ] 交互式模式

### 长期 (v1.0.0)

- [ ] 完整的测试套件
- [ ] 性能优化到极致
- [ ] 国际化支持
- [ ] 主题市场

---

## 🤝 贡献指南

### 开发环境设置

```bash
# 克隆仓库
git clone <repo-url>
cd claude-agent-sdk-demo

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 运行类型检查
npm run typecheck

# 运行演示
npm run demo
```

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 添加 TSDoc 注释
- 编写单元测试

### Git 提交规范

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式化
refactor: 重构代码
test: 添加测试
chore: 构建/工具相关
```

---

## 📝 更新日志

### 2025-10-13 - Phase 3 完成

- ✅ 实现流式渲染功能
- ✅ 实现打字机效果
- ✅ 完善 UI 组件库
- ✅ 修复所有已知问题
- ✅ 完善文档系统

### 2025-10-12 - Phase 2 完成

- ✅ 实现 Markdown 增强
- ✅ 实现代码语法高亮
- ✅ 实现 JSON 格式化
- ✅ 实现 Table 格式化
- ✅ 修复 Table 表头错位问题

### 2025-10-11 - Phase 1 完成

- ✅ 核心架构搭建
- ✅ 消息类型支持
- ✅ 主题系统
- ✅ 基础渲染功能

---

## 📚 相关资源

- [用户文档](../docs/)
- [待办清单](./TODO.md)
- [测试指南](./TESTING.md)
- [API 参考](../README.md)

---

**最后更新**: 2025-10-13  
**维护者**: 开发团队  
**状态**: 🟢 活跃开发中
