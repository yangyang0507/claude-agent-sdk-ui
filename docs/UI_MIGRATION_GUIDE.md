# UI 渲染器迁移指南

本指南帮助你从旧版渲染器迁移到新的 UI 渲染器。

## 📋 目录

- [为什么迁移到 UI 框架？](#为什么迁移到-ui-框架)
- [快速开始](#快速开始)
- [API 对比](#api-对比)
- [迁移步骤](#迁移步骤)
- [常见问题](#常见问题)

## 🎯 为什么迁移到 Ink？

新的 Ink 渲染器带来了显著的改进：

### ✅ 优势

| 特性 | 旧版渲染器 | UI 渲染器 |
|------|-----------|-----------|
| **架构** | 命令式，~3000 行 | 声明式 React，~1500 行 |
| **代码量** | 更多 | **减少 50%** |
| **布局** | 手动计算 | Flexbox 自动布局 |
| **组件化** | 函数式 | React 组件 |
| **打字机效果** | ❌ | ✅ 内置支持 |
| **流式渲染** | 基础 | ✅ 高级流式 |
| **维护性** | 较复杂 | **更简单** |
| **扩展性** | 有限 | **高度可扩展** |

### 🎨 新特性

1. **打字机效果** - 逐字符显示文本，提升用户体验
2. **React 组件** - 更好的组件化和复用
3. **Flexbox 布局** - 自动处理复杂布局
4. **更好的主题** - 更灵活的主题系统

---

## 🚀 快速开始

### 安装

Ink 渲染器已内置在主包中，无需额外安装：

```bash
npm install claude-agent-sdk-ui
```

### 最简单的迁移

**只需改变一个导入！**

```typescript
// ❌ 旧版
import { renderQuery } from 'claude-agent-sdk-ui';

// ✅ 新版（UI框架）
import { renderQuery } from 'claude-agent-sdk-ui';

// 使用方式完全相同！
await renderQuery(query({ prompt: '你好' }));
```

---

## 📖 API 对比

### 1. 简单渲染

#### 旧版 API

```typescript
import { render } from 'claude-agent-sdk-ui';

for await (const message of query({ prompt: '...' })) {
  await render(message);
}
```

#### 新版 API（UI框架）

```typescript
import { createRenderer } from 'claude-agent-sdk-ui';

const renderer = createRenderer({
  theme: 'dark',
  showTokenUsage: true,
});

for await (const message of query({ prompt: '...' })) {
  await renderer.render(message);
}

renderer.cleanup(); // ⚠️ 记得清理
```

---

### 2. 完整会话渲染

#### 旧版 API

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';

await renderQuery(query({ prompt: '你好' }), {
  theme: 'dark',
  showTokenUsage: true,
});
```

#### 新版 API（UI框架）- 推荐 ⭐

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';

await renderQueryWithInk(query({ prompt: '你好' }), {
  theme: 'dark',
  showTokenUsage: true,
});
```

---

### 3. 流式渲染（新功能！）

#### 旧版 API

```typescript
import { StreamRenderer } from 'claude-agent-sdk-ui';

const renderer = new StreamRenderer({ theme: 'dark' });
await renderer.render(query({ prompt: '...' }));
```

#### 新版 API（UI框架）- 带打字机效果 🎉

```typescript
import { renderQueryStreaming } from 'claude-agent-sdk-ui';

await renderQueryStreaming(query({ prompt: '你好' }), {
  theme: 'dark',
  streaming: true,
  typingEffect: true,    // ⭐ 打字机效果！
  typingSpeed: 20,       // 字符延迟（毫秒）
  showTokenUsage: true,
});
```

---

## 🔄 迁移步骤

### 步骤 1: 识别使用场景

确定你当前的使用方式：

- [ ] 使用 `render()` 单次渲染
- [ ] 使用 `renderQuery()` 完整会话
- [ ] 使用 `StreamRenderer` 流式渲染
- [ ] 使用自定义渲染器实例

### 步骤 2: 选择对应的 UI API

| 旧版 API | 新版 UI API | 说明 |
|---------|-------------|------|
| `render()` | `createRenderer()` + `.render()` | 手动渲染 |
| `renderQuery()` | `renderQuery()` | 完整会话（推荐） |
| `StreamRenderer` | `renderQueryStreaming()` | 流式 + 打字机效果 |
| `createRenderer()` | `createRenderer()` | 自定义实例 |

### 步骤 3: 更新代码

#### 示例 1: 基础迁移

```typescript
// ❌ 旧版
import { renderQuery } from 'claude-agent-sdk-ui';
await renderQuery(query({ prompt: '...' }));

// ✅ 新版
import { renderQuery } from 'claude-agent-sdk-ui';
await renderQuery(query({ prompt: '...' }));
```

#### 示例 2: 添加打字机效果

```typescript
// ❌ 旧版 - 无打字机效果
import { renderQuery } from 'claude-agent-sdk-ui';
await renderQuery(query({ prompt: '...' }));

// ✅ 新版 - 带打字机效果
import { renderQueryStreaming } from 'claude-agent-sdk-ui';
await renderQueryStreaming(query({ prompt: '...' }), {
  typingEffect: true,
  typingSpeed: 20,
});
```

#### 示例 3: 自定义渲染器

```typescript
// ❌ 旧版
import { createRenderer } from 'claude-agent-sdk-ui';
const renderer = createRenderer({ theme: 'dark' });
await renderer.render(message);

// ✅ 新版
import { createRenderer } from 'claude-agent-sdk-ui';
const renderer = createRenderer({ theme: 'dark' });
await renderer.render(message);
renderer.cleanup(); // ⚠️ 记得清理！
```

### 步骤 4: 测试验证

运行你的代码，验证：
- ✅ 消息正确渲染
- ✅ 主题应用正确
- ✅ 打字机效果（如果启用）
- ✅ Token 统计显示（如果启用）

---

## ❓ 常见问题

### Q1: 必须迁移到 Ink 吗？

**A:** 不是必须的。旧版 API 仍然可用，但**强烈推荐**迁移：
- 更好的性能
- 更多功能（打字机效果）
- 更好的维护性
- 未来更新将专注于 Ink 版本

### Q2: 迁移会破坏现有代码吗？

**A:** 不会！旧版 API 完全兼容。你可以：
1. 先在新项目中使用 Ink
2. 逐步迁移现有代码
3. 新旧 API 可以共存

### Q3: 如何同时使用新旧渲染器？

**A:** 可以！导入不同的函数即可：

```typescript
import {
  renderQuery,           // 旧版
  renderQueryWithInk,    // 新版
  renderQueryStreaming   // 新版流式
} from 'claude-agent-sdk-ui';
```

### Q4: Ink 渲染器性能如何？

**A:** 更好！
- 代码量减少 50%
- React 虚拟 DOM 优化
- 更高效的增量渲染

### Q5: 打字机效果会很慢吗？

**A:** 不会！你可以控制速度：

```typescript
await renderQueryStreaming(query({ prompt: '...' }), {
  typingEffect: true,
  typingSpeed: 10,  // 更快：10ms/字符
  // typingSpeed: 50,  // 更慢：50ms/字符
});
```

或者完全禁用：

```typescript
await renderQueryWithInk(query({ prompt: '...' }), {
  typingEffect: false,  // 禁用打字机效果
});
```

### Q6: 如何在 Ink 渲染器中使用自定义组件？

**A:** Ink 渲染器完全支持 React 组件：

```typescript
import { Box, Text } from 'claude-agent-sdk-ui';
import { render } from 'ink';

const MyComponent = () => (
  <Box flexDirection="column">
    <Text color="cyan">Hello from Ink!</Text>
  </Box>
);

render(<MyComponent />);
```

### Q7: 遇到问题怎么办？

**A:**
1. 查看 [示例代码](../examples/integration/ink-renderer-demo.ts)
2. 查看 [完整文档](./INK_REFACTOR_GUIDE.md)
3. 提交 Issue 到 GitHub

---

## 📚 更多资源

- [Ink 完整重构指南](./INK_REFACTOR_GUIDE.md)
- [Ink 快速入门](./INK_QUICK_START.md)
- [示例代码](../examples/)
- [Ink 官方文档](https://github.com/vadimdemedes/ink)

---

## 🎉 迁移完成！

恭喜！你已经成功迁移到 Ink 渲染器。

**下一步**：
- 尝试启用打字机效果
- 自定义主题
- 探索 React 组件
- 贡献代码

**需要帮助？** 随时提 Issue！
