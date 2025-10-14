# UI 框架快速开始

> **5 分钟快速上手 Claude Agent SDK UI**

---

## 🚀 基础安装和配置

### 1. 安装依赖

```bash
npm install claude-agent-sdk-ui @anthropic-ai/claude-agent-sdk
```

### 2. 配置环境变量

创建 `.env` 文件:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 编写你的第一个应用

**最简单的方式 - 一行代码:**

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

// 🎉 就这么简单!
await renderQuery(query({ prompt: '你好,Claude!' }));
```

**带配置的方式:**

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
    theme: 'dark',              // 主题: 'dark' | 'light'
    showTokenUsage: true,       // 显示 Token 统计（默认关闭）
    showToolDetails: true,      // 显示工具调用详情
    showToolContent: true,      // 需要时显示 content 字段（默认隐藏）
    maxOutputLines: 50,         // 工具输出最大行数
  }
);
```

---

## 🎨 快速预览

运行代码后，你将看到：

```
═══════════ 🚀 SESSION INITIALIZED ═══════════

╭───────────────── 📋 Session Info ─────────────────╮
│ Session ID: 628c0fcf                              │
│ Model: claude-sonnet-4                            │
│ Working Dir: /Users/username/project              │
│ Permission: [ℹ DEFAULT]                          │
╰───────────────────────────────────────────────────╯

[ℹ INFO] 🔧 Read

┌───────────────────────────────────────────────┐
│ {                                             │
│   "path": "package.json"                      │
│ }                                             │
└───────────────────────────────────────────────┘

[✓ SUCCESS] ✓ Read completed (0.5s)

═════════ ✅ EXECUTION COMPLETE ══════════
```

---

## 📚 更多示例和文档

- 🎨 [自定义主题](./UI_RENDERER.md#自定义主题)
- 📖 [完整 API 文档](./UI_RENDERER.md)
- 🔄 [从旧版迁移](./UI_MIGRATION_GUIDE.md)

---

## 🏗️ 架构说明

> **技术实现细节：基于 React for CLIs 的 UI 框架**

---

## ✅ 当前进度（已完成 40%）

### 已完成的工作

#### 1️⃣ 基础设施（100% ✅）
- ✅ 所有依赖已安装（ink, react, 及生态组件）
- ✅ TypeScript 配置完成（支持 JSX/TSX）
- ✅ 项目目录结构创建完毕

#### 2️⃣ 基础 UI 组件（100% ✅）
所有组件都可以直接使用！

```tsx
import { Box, Badge, Divider, Spinner } from './src/ink-components/ui/index.js';
import { ThemeProvider, useTheme } from './src/hooks/useTheme.js';
```

**组件列表**:
- ✅ `<Box>` - 边框盒子（390 行 → 120 行，减少 69%）
- ✅ `<Badge>` - 徽章（SUCCESS/ERROR/WARNING/INFO）
- ✅ `<Divider>` - 分割线
- ✅ `<Spinner>` - 加载动画
- ✅ `<ThemeProvider>` - 主题提供者
- ✅ `useTheme()` Hook

**测试验证**: ✅ 所有组件渲染正常
```bash
npx tsx examples/ink-test/basic-components.tsx
```

---

## 📋 剩余工作（还需 60%）

### 核心任务清单

| 任务 | 预计时间 | 优先级 | 状态 |
|------|----------|--------|------|
| 创建消息路由器 | 2-3h | 🔴 高 | ⏳ 待办 |
| SystemMessage 组件 | 1-2h | 🔴 高 | ⏳ 待办 |
| AssistantMessage 组件 | 2-3h | 🔴 高 | ⏳ 待办 |
| ToolUseMessage 组件 | 1-2h | 🔴 高 | ⏳ 待办 |
| ToolResultMessage 组件 | 1-2h | 🔴 高 | ⏳ 待办 |
| FinalResult 组件 | 2-3h | 🔴 高 | ⏳ 待办 |
| InkRenderer 主渲染器 | 3-4h | 🔴 高 | ⏳ 待办 |
| StreamRenderer 流式渲染 | 3-4h | 🟡 中 | ⏳ 待办 |
| API 兼容层 | 2-3h | 🔴 高 | ⏳ 待办 |
| 测试和优化 | 4-5h | 🟡 中 | ⏳ 待办 |

**总计剩余工作量**: 约 20-30 小时

---

## 🚀 如何继续

### 方案 A：自己动手（推荐）

按照 `INK_REFACTOR_GUIDE.md` 详细指南逐步实施：

1. **阅读指南** - 花 30 分钟通读一遍
2. **从简单开始** - 先实现 SystemMessage 组件（最简单）
3. **逐步推进** - 每完成一个组件就测试一次
4. **保持节奏** - 每天 2-3 小时，一周内完成核心功能

### 方案 B：请我帮忙（快速）

你可以在后续会话中请求：
```
请帮我实现 SystemMessage 组件
```

或者：
```
继续完成 Ink 重构的第 3 阶段
```

### 方案 C：混合模式（灵活）

- 自己实现简单组件（SystemMessage, Badge 等）
- 复杂部分请我帮忙（StreamRenderer, 主渲染器）

---

## 📖 文档导航

### 主要文档
- **`INK_REFACTOR_GUIDE.md`** - 完整实施指南（必读！）
  - 详细的步骤说明
  - 完整的代码示例
  - 常见问题解答
  - 最佳实践

### 代码位置

#### 已完成的代码
```
src/
├── ink-components/ui/     ✅ 基础 UI 组件
│   ├── Box.tsx           ✅ 已完成
│   ├── Badge.tsx         ✅ 已完成
│   ├── Divider.tsx       ✅ 已完成
│   ├── Spinner.tsx       ✅ 已完成
│   └── index.tsx         ✅ 导出文件
├── hooks/
│   └── useTheme.tsx      ✅ 主题 Hook
└── examples/ink-test/
    └── basic-components.tsx  ✅ 测试示例
```

#### 待创建的文件
```
src/
├── ink-components/
│   ├── message/          ⏳ 消息组件（待创建）
│   │   ├── SystemMessage.tsx
│   │   ├── AssistantMessage.tsx
│   │   ├── ToolUseMessage.tsx
│   │   ├── ToolResultMessage.tsx
│   │   └── FinalResult.tsx
│   └── layout/           ⏳ 布局组件（可选）
└── ink-renderer/         ⏳ 渲染器（待创建）
    ├── MessageRouter.tsx
    ├── InkRenderer.tsx
    └── StreamRenderer.tsx
```

---

## 🎯 建议的实施顺序

### 第一阶段：核心消息渲染（1-2 天）
1. 创建 `MessageRouter.tsx`（30 分钟）
2. 实现 `SystemMessage.tsx`（1 小时）
3. 实现 `AssistantMessage.tsx`（2 小时）
4. 测试基本渲染（30 分钟）

### 第二阶段：工具调用支持（1 天）
1. 实现 `ToolUseMessage.tsx`（1 小时）
2. 实现 `ToolResultMessage.tsx`（1 小时）
3. 实现 `FinalResult.tsx`（2 小时）
4. 集成测试（1 小时）

### 第三阶段：主渲染器（1 天）
1. 创建 `InkRenderer.tsx`（3 小时）
2. 更新 `src/index.ts` API（1 小时）
3. 完整会话测试（1 小时）

### 第四阶段：高级特性（1-2 天）
1. 实现 `StreamRenderer.tsx`（3 小时）
2. 性能优化（2 小时）
3. 边缘案例处理（2 小时）

---

## 💡 快速提示

### 遇到问题？

1. **类型错误** → 检查 `tsconfig.json` 的 `moduleResolution` 设置
2. **组件不渲染** → 确保使用了 `<ThemeProvider>` 包裹
3. **样式不生效** → Ink 使用 Flexbox，检查 `flexDirection` 属性
4. **找不到模块** → 运行 `npm install` 确保依赖安装完整

### 调试技巧

```tsx
// 在组件中打印调试信息
useEffect(() => {
  console.log('Component mounted', props);
}, []);
```

### 查看组件效果

```bash
# 运行测试示例
npx tsx examples/ink-test/basic-components.tsx

# 创建你自己的测试文件
cp examples/ink-test/basic-components.tsx examples/ink-test/my-test.tsx
npx tsx examples/ink-test/my-test.tsx
```

---

## 📞 获取帮助

### 在代码中
- 查看 `INK_REFACTOR_GUIDE.md` 中的详细示例
- 参考已完成的组件代码（`src/ink-components/ui/`）
- 运行测试示例了解用法

### 在对话中
随时可以问我：
- "XXX 组件应该如何实现？"
- "遇到 YYY 错误怎么办？"
- "这段代码有什么问题？"
- "继续完成下一个组件"

---

## 🎉 预期成果

完成重构后，你将获得：

✨ **更简洁的代码**
- 从 3000 行 → 1500 行（减少 50%）

✨ **更好的开发体验**
- React 组件化开发
- 声明式 UI 编程
- TypeScript 完整支持

✨ **更强的功能**
- Flexbox 布局
- 组件复用
- 易于扩展

✨ **更易维护**
- 清晰的组件结构
- 单一职责原则
- 完整的测试覆盖

---

## 📊 进度追踪

你可以使用这个清单追踪进度：

```markdown
## Ink 重构进度

### 阶段 1-2：基础设施和 UI 组件
- [x] 依赖安装
- [x] 配置更新
- [x] Box 组件
- [x] Badge 组件
- [x] Divider 组件
- [x] Spinner 组件
- [x] useTheme Hook

### 阶段 3：核心渲染器
- [ ] MessageRouter
- [ ] SystemMessage
- [ ] AssistantMessage
- [ ] ToolUseMessage (可选，合并到 AssistantMessage)
- [ ] ToolResultMessage
- [ ] FinalResult
- [ ] InkRenderer

### 阶段 4：高级特性
- [ ] StreamRenderer
- [ ] API 兼容层
- [ ] 性能优化

### 阶段 5：测试和文档
- [ ] 单元测试
- [ ] 集成测试
- [ ] 示例更新
- [ ] 文档完善
```

---

**准备好了吗？开始你的 Ink 重构之旅！** 🚀

有任何问题随时问我！
