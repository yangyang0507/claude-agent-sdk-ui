# UI Enhancements - 全新视觉体验

> 最后更新: 2025-10-13

## 🎨 概述

我们对 Claude Agent SDK UI 进行了全面升级，集成了丰富的 UI 组件库，显著提升了终端交互的视觉体验和专业性。

## ✨ 新增功能

### 1. **Badge 组件** - 状态标识
用于标记工具状态、执行结果等关键信息。

**使用场景：**
- 工具调用状态：`EXECUTING`、`COMPLETED`、`FAILED`
- 会话状态：`SESSION INITIALIZED`、`TOOLS AVAILABLE`
- 最终结果：`FINAL RESULT`、`EXECUTION STATS`

**效果展示：**
```
[ℹ INFO] 🔧 Read
[✓ SUCCESS] ✓ Read completed (1.2s)
[✗ ERROR] ✗ Bash failed
```

### 2. **Box 组件** - 内容包装
用边框和内边距包装重要内容，突出显示。

**使用场景：**
- 会话信息展示
- 工具参数包装
- 工具结果包装

**效果展示：**
```
╭─────────────────────────────────────╮
│ Session ID: 628c0fcf                │
│ Model: claude-sonnet-4              │
│ Working Dir: /Users/...             │
│ Permission: [ℹ DEFAULT]            │
╰─────────────────────────────────────╯
```

### 3. **Divider 组件** - 视觉分隔
在不同消息块之间添加分隔线，提升可读性。

**使用场景：**
- 会话初始化分隔
- 最终结果分隔
- 流式渲染开始/结束

**效果展示：**
```
═══════════ 🚀 SESSION INITIALIZED ═══════════

─────────────────────────────────────────────

═════════ ✅ EXECUTION COMPLETE ══════════
```

### 4. **Table 组件** - 结构化数据
以专业的表格形式展示统计信息。

**使用场景：**
- 执行统计信息
- Token 使用统计
- 成本分析

**效果展示：**
```
┌──────────────────┬────────────────────────┐
│ Metric           │                  Value │
├──────────────────┼────────────────────────┤
│ Status           │             ✅ Success │
│ Duration         │                  22.2s │
│ Turns            │                     15 │
│ Total Cost       │               $0.0827  │
└──────────────────┴────────────────────────┘

┌──────────────────┬────────────────────────┐
│ Type             │                  Count │
├──────────────────┼────────────────────────┤
│ Input Tokens     │                  8,117 │
│ Output Tokens    │                    984 │
│ Cache Read       │                112,928 │
└──────────────────┴────────────────────────┘
```

### 5. **Spinner 组件** - 加载动画
在工具执行过程中显示实时进度动画（TTY 环境）。

**使用场景：**
- 工具执行进度显示
- 长时间操作的视觉反馈

**效果展示：**
```
⠋ Executing Read...
✓ Read completed
```

## 📊 增强效果对比

### 之前（旧版）
```
ℹ 会话初始化

  会话ID: 628c0fcf
  模型: claude-sonnet-4
  工作目录: /Users/...
  权限模式: default

⚡ Bash

  {
    "command": "ls -la"
  }

✓ 结果

  total 560
  drwxr-xr-x  20 user  staff   640
  ...

📊 执行统计

  ✓ 状态: 成功
  ⏱️  执行时间: 22.2s
  💰 总成本: $0.0827
```

### 现在（新版）
```
═══════════ 🚀 SESSION INITIALIZED ═══════════

╭───────────────── 📋 Session Info ─────────────────╮
│ Session ID: 628c0fcf                              │
│ Model: claude-sonnet-4                            │
│ Working Dir: /Users/...                           │
│ Permission: [ℹ DEFAULT]                          │
╰───────────────────────────────────────────────────╯

[✓ SUCCESS] 15 TOOLS AVAILABLE
  🔧 Bash  🔧 Read  🔧 Edit  ...

──────────────────────────────────────────────────

[ℹ INFO] 🔧 Bash

┌───────────────────────────────────────────────┐
│ {                                             │
│   "command": "ls -la"                         │
│ }                                             │
└───────────────────────────────────────────────┘

[✓ SUCCESS] RESULT: SUCCESS (1.2s)

┌───────────────────────────────────────────────┐
│ total 560                                     │
│ drwxr-xr-x  20 user  staff   640             │
│ ...                                           │
└───────────────────────────────────────────────┘

═════════ ✅ EXECUTION COMPLETE ══════════

[ℹ INFO] EXECUTION STATS

┌──────────────────┬────────────────────────┐
│ Metric           │                  Value │
├──────────────────┼────────────────────────┤
│ Status           │             ✅ Success │
│ Duration         │                  22.2s │
│ Turns            │                     15 │
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

## 🚀 使用方式

### 自动使用（推荐）
所有增强功能已自动集成到 `render()` 和 `renderQuery()` API 中：

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

// 自动享受所有 UI 增强效果
await renderQuery(query({ prompt: '你的问题' }));
```

### 自定义使用
你也可以直接使用这些 UI 组件：

```typescript
import { Box, Badge, Divider, createTableFormatter } from 'claude-agent-sdk-ui';

// 使用 Badge
const badge = Badge.success('COMPLETED', { style: 'filled' });
console.log(badge);

// 使用 Box
const box = new Box({ borderStyle: 'round', padding: 1 });
console.log(box.render('Important content'));

// 使用 Divider
const divider = new Divider({ style: 'double', text: 'SECTION' });
console.log(divider.render());

// 使用 Table
const table = createTableFormatter({
  columns: [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Value', key: 'value', width: 30 },
  ],
});
console.log(table.render(data, theme));
```

## 🎯 运行示例

体验全新的 UI 增强效果：

```bash
# 运行增强 UI 演示
npm run demo:enhanced

# 运行流式渲染演示
npm run demo:streaming

# 运行 UI 组件演示
npm run demo:components
```

## 📈 改进总结

| 方面 | 之前 | 现在 |
|------|------|------|
| **视觉层次** | 扁平化，难以区分 | 清晰的层次结构 |
| **状态标识** | 简单符号 | 彩色 Badge 标签 |
| **内容包装** | 缩进文本 | 边框盒子 |
| **数据展示** | 文本列表 | 专业表格 |
| **视觉分隔** | 简单横线 | 样式化分隔线 |
| **加载反馈** | 静态文本 | 动态 Spinner |
| **整体感觉** | 功能性 | 专业、美观 |

## 🎨 配置选项

所有原有配置选项仍然有效：

```typescript
await renderQuery(query, {
  theme: 'dark',              // 主题：dark/light
  showTokenUsage: true,       // 显示 Token 统计（默认关闭）
  showToolDetails: true,      // 显示工具详情
  showToolContent: true,      // 需要时显示 content 字段（默认隐藏）
  showThinking: false,        // 显示思考过程
  streaming: true,            // 启用流式渲染
  typingEffect: false,        // 启用打字机效果
  maxOutputLines: 100,        // 最大输出行数
  maxWidth: 120,              // 最大宽度
});
```

## 🔮 未来计划

- [ ] 添加进度条支持（多步骤任务）
- [ ] 支持自定义组件样式
- [ ] 添加更多表格样式
- [ ] 支持图表渲染
- [ ] 交互式组件（选择器、输入框等）

## 🤝 反馈

如果你有任何建议或发现问题，请在 [GitHub Issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues) 提交反馈。

---

**享受全新的终端 UI 体验！** 🎉
