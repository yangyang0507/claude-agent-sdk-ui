# 自定义布局主题指南

本指南介绍如何创建支持自定义布局的主题，实现完全不同的渲染结构。

## 概述

从 v1.1.0 开始，主题系统不仅支持样式自定义（颜色、符号、边框等），还支持**组件级别的自定义**，允许你完全控制消息的渲染结构和布局。

## 主题组件系统

### 可自定义的组件

主题可以覆盖以下组件：

1. **消息组件**
   - `assistantMessage` - Assistant 消息渲染
   - `streamingAssistantMessage` - 流式 Assistant 消息渲染
   - `toolResultMessage` - 工具结果消息渲染
   - `systemMessage` - 系统消息渲染
   - `finalResult` - 最终结果渲染

2. **布局组件**
   - `messageContainer` - 单个消息的容器（暂未实现）
   - `appLayout` - 整体应用布局

### 组件属性接口

所有组件属性接口都在 `src/types/theme.ts` 中定义：

```typescript
import type { 
  AssistantMessageProps,
  StreamingAssistantMessageProps,
  ToolResultMessageProps,
  SystemMessageProps,
  FinalResultProps,
  AppLayoutProps,
} from './types/theme';
```

## 创建自定义布局主题

### 示例 1: 紧凑布局

创建一个高信息密度的紧凑布局：

```typescript
// src/themes/compact/assistant-message.tsx
import React from 'react';
import { Box, Text } from 'ink';
import type { AssistantMessageProps } from '../../types/theme';
import { useTheme } from '../../hooks/use-theme';

export const CompactAssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  showThinking,
  showToolDetails,
  toolStates,
}) => {
  const theme = useTheme();
  
  // 实现紧凑的横向布局
  return (
    <Box flexDirection="row" marginBottom={0}>
      <Text color={theme.colors.primary}>{theme.symbols.aiPrefix}</Text>
      <Box marginLeft={1}>
        {/* 渲染消息内容 */}
      </Box>
    </Box>
  );
};
```

```typescript
// src/themes/compact/layout.tsx
import React from 'react';
import { Box } from 'ink';
import type { AppLayoutProps } from '../../types/theme';

export const CompactLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box flexDirection="column" gap={0} paddingY={0}>
      {children}
    </Box>
  );
};
```

```typescript
// src/themes/compact.ts
import type { Theme } from '../types/theme';
import { CompactAssistantMessage } from './compact/assistant-message';
import { CompactLayout } from './compact/layout';

export const compactTheme: Theme = {
  name: 'compact',
  colors: { /* ... */ },
  symbols: { /* ... */ },
  borders: { /* ... */ },
  layout: { /* ... */ },
  
  // 关键：组件配置
  components: {
    assistantMessage: CompactAssistantMessage,
    appLayout: CompactLayout,
  },
};
```

### 示例 2: 卡片式布局

创建一个具有清晰视觉边界的卡片式布局：

```typescript
// src/themes/card/assistant-message.tsx
import React from 'react';
import { Box, Text } from 'ink';
import type { AssistantMessageProps } from '../../types/theme';
import { useTheme } from '../../hooks/use-theme';
import { BoxComponent } from '../../components/ui/box';

export const CardAssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  showThinking,
  showToolDetails,
  toolStates,
}) => {
  const theme = useTheme();
  
  return (
    <BoxComponent
      title={`${theme.symbols.aiPrefix} Assistant`}
      borderColor={theme.colors.primary}
      marginBottom={1}
    >
      <Box flexDirection="column" paddingX={1}>
        {/* 分区域渲染：思考、内容、工具 */}
      </Box>
    </BoxComponent>
  );
};
```

## 使用自定义布局主题

### 方法 1: 直接使用

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';
import { compactTheme } from './themes/compact';

const renderer = createRenderer({
  theme: compactTheme, // 使用自定义主题
});
```

### 方法 2: 扩展现有主题

```typescript
import { claudeCodeTheme } from 'claude-agent-sdk-ui/themes';
import { CompactAssistantMessage } from './components/compact-assistant-message';

const myTheme = {
  ...claudeCodeTheme,
  components: {
    assistantMessage: CompactAssistantMessage,
    // 只覆盖需要的组件，其他使用默认
  },
};

const renderer = createRenderer({
  theme: myTheme,
});
```

### 方法 3: 条件启用自定义布局

```typescript
import { claudeCodeTheme } from 'claude-agent-sdk-ui/themes';
import { CompactLayout } from './layouts/compact';

const useCompactMode = process.env.COMPACT_MODE === 'true';

const theme = {
  ...claudeCodeTheme,
  components: useCompactMode ? {
    appLayout: CompactLayout,
  } : undefined,
};
```

## 内置示例

SDK 提供了两个主题的自定义布局示例：

### Claude Code 紧凑布局

```typescript
import { claudeCodeTheme } from 'claude-agent-sdk-ui/themes';
import { ClaudeCodeCompactAssistantMessage } from 'claude-agent-sdk-ui/themes/claude-code/compact-assistant-message';
import { ClaudeCodeCompactLayout } from 'claude-agent-sdk-ui/themes/claude-code/compact-layout';

const compactClaudeCodeTheme = {
  ...claudeCodeTheme,
  components: {
    assistantMessage: ClaudeCodeCompactAssistantMessage,
    appLayout: ClaudeCodeCompactLayout,
  },
};
```

### Droid 卡片式布局

```typescript
import { droidTheme } from 'claude-agent-sdk-ui/themes';
import { DroidCardAssistantMessage } from 'claude-agent-sdk-ui/themes/droid/card-assistant-message';
import { DroidSpaciousLayout } from 'claude-agent-sdk-ui/themes/droid/spacious-layout';

const cardDroidTheme = {
  ...droidTheme,
  components: {
    assistantMessage: DroidCardAssistantMessage,
    appLayout: DroidSpaciousLayout,
  },
};
```

## 最佳实践

### 1. 保持一致性

确保自定义组件与主题的视觉风格保持一致：

```typescript
export const MyAssistantMessage: React.FC<AssistantMessageProps> = (props) => {
  const theme = useTheme(); // 始终使用主题配置
  
  return (
    <Text color={theme.colors.primary}> {/* 使用主题颜色 */}
      {theme.symbols.aiPrefix} {/* 使用主题符号 */}
    </Text>
  );
};
```

### 2. 渐进增强

只覆盖需要自定义的组件，其他组件使用默认实现：

```typescript
const myTheme: Theme = {
  // ... 基础配置
  components: {
    // 只自定义 Assistant 消息，其他组件使用默认
    assistantMessage: MyCustomAssistantMessage,
  },
};
```

### 3. 响应配置选项

尊重渲染器的配置选项：

```typescript
export const MyAssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  showThinking, // 尊重这个配置
  showToolDetails, // 尊重这个配置
  toolStates,
}) => {
  return (
    <Box>
      {/* 只在 showThinking 为 true 时显示思考内容 */}
      {showThinking && <ThinkingContent />}
      
      {/* 只在 showToolDetails 为 true 时显示工具详情 */}
      {showToolDetails && <ToolDetails />}
    </Box>
  );
};
```

### 4. 类型安全

利用 TypeScript 确保组件接口正确：

```typescript
import type { AssistantMessageProps } from 'claude-agent-sdk-ui/types/theme';

// TypeScript 会确保你的组件实现了正确的接口
export const MyAssistantMessage: React.FC<AssistantMessageProps> = (props) => {
  // ...
};
```

## 调试技巧

### 1. 验证组件加载

```typescript
const theme = {
  ...baseTheme,
  components: {
    assistantMessage: (props) => {
      console.log('Custom assistant message rendered');
      return <MyAssistantMessage {...props} />;
    },
  },
};
```

### 2. 对比默认组件

在开发时保留切换到默认组件的能力：

```typescript
import { AssistantMessage as DefaultAssistantMessage } from 'claude-agent-sdk-ui/components/message/assistant-message';

const USE_CUSTOM = true;

const theme = {
  ...baseTheme,
  components: {
    assistantMessage: USE_CUSTOM ? MyCustomAssistantMessage : DefaultAssistantMessage,
  },
};
```

## 常见问题

### Q: 如何访问默认组件？

A: 默认组件从 `src/components/message/` 导出：

```typescript
import { AssistantMessage } from '../components/message/assistant-message';
```

### Q: 可以混合使用不同主题的组件吗？

A: 可以，但要注意视觉一致性：

```typescript
import { ClaudeCodeCompactLayout } from './themes/claude-code/compact-layout';
import { DroidCardAssistantMessage } from './themes/droid/card-assistant-message';

const mixedTheme = {
  ...baseTheme,
  components: {
    assistantMessage: DroidCardAssistantMessage,
    appLayout: ClaudeCodeCompactLayout,
  },
};
```

### Q: 自定义组件会影响性能吗？

A: 不会。组件代理层的开销极小，只是一次函数调用和组件选择。

### Q: 如何为流式渲染自定义组件？

A: 实现 `StreamingAssistantMessageProps` 接口：

```typescript
export const MyStreamingAssistantMessage: React.FC<StreamingAssistantMessageProps> = ({
  message,
  typingSpeed,
  streamingEnabled,
  onStreamComplete,
  // ... 其他属性
}) => {
  // 实现打字机效果和流式渲染逻辑
};
```

## 总结

通过组件级主题系统，你可以：

- ✅ 完全控制消息的渲染结构
- ✅ 实现不同的布局风格（紧凑、卡片、表格等）
- ✅ 保持类型安全和代码提示
- ✅ 渐进增强，只覆盖需要的部分
- ✅ 向下兼容，现有主题无需改动

这使得主题系统不仅能控制"样式"，还能控制"结构"，实现真正的自定义体验。
