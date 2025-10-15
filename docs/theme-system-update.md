# 主题系统更新 - 支持自定义布局

## 新功能概述

主题系统现在支持**组件级自定义**，不仅可以修改样式（颜色、符号），还可以完全控制渲染结构和布局。

## 架构说明

### Claude Code 作为默认实现（`src/components/message`）

这些组件是 **Claude Code 主题的实现**，同时也是系统的默认实现：
- 通过 `useTheme()` hook 获取当前主题配置
- 自动使用主题的颜色、符号、边框等样式
- 布局结构：垂直堆叠、简洁缩进、紧凑间距（Claude Code 风格）
- 当主题未指定自定义组件时，使用这些组件

### 组件代理层（`src/components/proxy`）

允许主题提供**完全不同的布局结构**：
- 如果主题提供了自定义组件 → 使用主题的自定义组件
- 如果主题未提供 → 使用 Claude Code 实现（默认）
- 实现了**完全的布局自由**（不仅仅是样式替换）

## 核心改进

### 1. 扩展的主题配置

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;
  symbols: ThemeSymbols;
  borders: ThemeBorders;
  layout: ThemeLayout;
  
  // 新增：组件配置
  components?: ThemeComponents;
}
```

### 2. 可自定义的组件

- `assistantMessage` - 自定义 AI 消息渲染
- `streamingAssistantMessage` - 自定义流式消息渲染
- `toolResultMessage` - 自定义工具结果渲染
- `systemMessage` - 自定义系统消息渲染
- `finalResult` - 自定义最终结果渲染
- `appLayout` - 自定义整体布局结构

### 3. 组件代理层

所有渲染器现在使用代理组件，自动根据主题选择组件实现：

```typescript
// 内部实现
export const AssistantMessageProxy = (props) => {
  const theme = useTheme();
  // 优先使用主题自定义组件，否则使用 Claude Code 实现
  const Component = theme.components?.assistantMessage ?? ClaudeCodeAssistantMessage;
  return <Component {...props} />;
};
```

## 使用示例

### 基础用法 - 使用内置主题

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';

// 使用 Claude Code 主题（默认，使用 src/components/message 实现）
const renderer1 = createRenderer({
  theme: 'claude-code',
});

// 使用 Droid 主题样式，但布局仍是 Claude Code 实现
const renderer2 = createRenderer({
  theme: 'droid', // 只改变颜色、符号等样式，布局结构不变
});
```

### 高级用法 - 为 Droid 主题自定义布局

```typescript
import React from 'react';
import { Box, Text } from 'ink';
import { droidTheme } from 'claude-agent-sdk-ui/themes';

// 为 Droid 创建自定义布局组件（比如卡片式）
const DroidCardAssistantMessage = ({ message }) => {
  return (
    <Box borderStyle="round" borderColor="#00D9FF" padding={1}>
      <Text>⛬ Assistant</Text>
      <Box marginTop={1}>{/* 渲染内容 */}</Box>
    </Box>
  );
};

// Droid 主题 + 自定义布局
const droidWithCardLayout = {
  ...droidTheme,
  components: {
    assistantMessage: DroidCardAssistantMessage, // 覆盖默认的 Claude Code 布局
  },
};

// 使用：Droid 样式 + 卡片式布局
const renderer = createRenderer({
  theme: droidWithCardLayout,
});
```

## 内置布局实现

### Claude Code 布局（默认）

位于 `src/components/message`，特点：
- **垂直堆叠布局**
- 简洁的缩进和间距
- 紧凑的信息密度
- 所有主题默认使用此布局

### 可选的示例布局

SDK 提供了额外的布局示例供参考：

1. **Claude Code 横向紧凑布局** (`src/themes/claude-code/`)
   - 内联显示，减少垂直空间
   - 更高的信息密度

2. **Droid 卡片式布局** (`src/themes/droid/`)
   - 带边框的卡片设计
   - 分区域展示内容
   - 更多视觉呼吸空间

这些是**可选的参考实现**，可以：
- 直接查看源码学习
- 复制到自己的项目中使用
- 作为创建自定义布局的起点

## 架构优势

1. **Claude Code 作为默认** - 简洁高效的默认实现
2. **样式与布局分离** - 主题配置控制样式，components 控制布局
3. **渐进增强** - 可选择性覆盖部分组件
4. **完全灵活** - 可实现完全不同的布局结构
5. **类型安全** - TypeScript 确保接口一致
6. **性能优化** - 代理层开销极小

## 详细文档

- [自定义布局主题指南](./custom-layout-theme.md) - 完整的使用指南和最佳实践
- [示例代码](../examples/custom-layout-example.ts) - 多种使用场景示例

## 技术实现

### 文件结构

```
src/
├── types/
│   └── theme.ts          # 扩展的类型定义
├── components/
│   ├── proxy/            # 新增：组件代理层
│   │   ├── assistant-message-proxy.tsx
│   │   ├── streaming-assistant-message-proxy.tsx
│   │   ├── tool-result-message-proxy.tsx
│   │   ├── system-message-proxy.tsx
│   │   ├── final-result-proxy.tsx
│   │   ├── app-layout-proxy.tsx
│   │   └── index.ts
│   └── message/          # 默认组件实现
├── themes/
│   ├── claude-code/      # 新增：主题特定组件
│   │   ├── compact-assistant-message.tsx
│   │   └── compact-layout.tsx
│   └── droid/            # 新增：主题特定组件
│       ├── card-assistant-message.tsx
│       └── spacious-layout.tsx
└── renderer/
    ├── renderer.tsx      # 更新：使用代理组件
    └── streaming-renderer.tsx  # 更新：使用代理组件
```

### 核心原理

1. **类型系统扩展** - 在 `Theme` 接口中添加 `components` 字段
2. **代理模式** - 创建代理组件，根据主题动态选择实现
3. **默认回退** - 如果主题未提供自定义组件，使用默认实现
4. **Context 传递** - 通过 `ThemeProvider` 传递主题配置

## 迁移指南

现有代码无需任何修改即可工作。如果想使用自定义布局：

1. 创建自定义组件（实现对应的 Props 接口）
2. 在主题配置中添加 `components` 字段
3. 传入自定义主题到渲染器

就这么简单！
