# 打字机效果使用指南

> 逐字符输出文本,创造优雅的视觉效果

## 概述

打字机效果 (Typing Effect) 提供了逐字符输出文本的功能,类似于老式打字机的效果。这个特性可以为你的 CLI 应用增添动态和吸引力。

## 特性

- ✅ **逐字符输出** - 字符一个个显示
- ✅ **速度控制** - 自定义打字速度
- ✅ **随机变化** - 模拟真实打字的速度变化
- ✅ **标点延迟** - 标点符号后自动停顿
- ✅ **暂停/继续** - 完整的播放控制
- ✅ **取消/跳过** - 可以中途停止或跳到结束
- ✅ **多行支持** - 逐行打字效果
- ✅ **回调函数** - 监听打字进度
- ✅ **立即模式** - 可以跳过动画直接显示

## 快速开始

### 最简单的用法

```typescript
import { typeText } from 'claude-agent-sdk-ui';

// 🎬 一行代码创建打字效果
await typeText('Hello, World!', {
  speed: 50, // 50ms 每个字符
});
```

### 多行文本

```typescript
import { typeLines } from 'claude-agent-sdk-ui';

await typeLines(
  [
    '第一行文本',
    '第二行文本',
    '第三行文本',
  ],
  {
    speed: 40,
    lineDelay: 500, // 行间延迟
  }
);
```

### 高级控制

```typescript
import { createTypingEffect } from 'claude-agent-sdk-ui';

const effect = createTypingEffect('这是一段文本', {
  speed: 50,
  randomize: true,
  punctuationDelay: 200,
});

// 启动
const promise = effect.start();

// 控制
effect.pause();   // 暂停
effect.resume();  // 继续
effect.cancel();  // 取消
effect.skipToEnd(); // 跳到结束

await promise;
```

## 配置选项

### TypingEffectOptions

```typescript
interface TypingEffectOptions {
  /** 打字速度 (毫秒/字符), 默认: 30 */
  speed?: number;

  /** 是否在完成后输出换行, 默认: true */
  newline?: boolean;

  /** 标点符号后的额外延迟 (毫秒), 默认: 150 */
  punctuationDelay?: number;

  /** 是否启用随机速度变化, 默认: false */
  randomize?: boolean;

  /** 随机速度变化范围 (百分比), 默认: 0.3 (30%) */
  randomVariation?: number;

  /** 是否立即显示 (跳过动画), 默认: false */
  instant?: boolean;

  /** 回调: 每个字符输出后调用 */
  onChar?: (char: string, index: number) => void;

  /** 回调: 完成时调用 */
  onComplete?: () => void;
}
```

## 使用示例

### 示例 1: 基础打字效果

```typescript
import { typeText } from 'claude-agent-sdk-ui';

await typeText('Hello, World! 这是一个打字机效果演示。', {
  speed: 50,
  newline: true,
});
```

### 示例 2: 不同速度

```typescript
// 慢速
await typeText('这是慢速打字...', {
  speed: 100,
});

// 快速
await typeText('这是快速打字!!!', {
  speed: 20,
});
```

### 示例 3: 标点符号延迟

```typescript
await typeText(
  '这是一个句子。看,句号后停顿了一下!是不是很自然?',
  {
    speed: 30,
    punctuationDelay: 300, // 标点后延迟 300ms
  }
);
```

### 示例 4: 随机速度变化

```typescript
// 模拟真人打字的不均匀速度
await typeText(
  '启用随机速度后,每个字符的速度会略有不同',
  {
    speed: 40,
    randomize: true,
    randomVariation: 0.5, // 50% 变化范围
  }
);
```

### 示例 5: 多行文本

```typescript
import { typeLines } from 'claude-agent-sdk-ui';
import chalk from 'chalk';

await typeLines(
  [
    chalk.green('✓ 初始化项目...'),
    chalk.green('✓ 安装依赖...'),
    chalk.green('✓ 配置环境...'),
    chalk.bold.green('🎉 完成!'),
  ],
  {
    speed: 30,
    lineDelay: 300, // 每行之间延迟 300ms
  }
);
```

### 示例 6: 立即模式

```typescript
// 在某些情况下,可能需要跳过动画
await typeText('这段文本会立即显示', {
  instant: true,
});
```

### 示例 7: 回调函数

```typescript
let charCount = 0;

await typeText('演示回调函数的使用', {
  speed: 50,
  onChar: (char, index) => {
    charCount++;
    // 可以在这里做进度追踪等
  },
  onComplete: () => {
    console.log(`共输出了 ${charCount} 个字符`);
  },
});
```

### 示例 8: 暂停和继续

```typescript
import { createTypingEffect } from 'claude-agent-sdk-ui';

const effect = createTypingEffect(
  '这段文本会在中途暂停...',
  { speed: 40 }
);

// 启动
const promise = effect.start();

// 1秒后暂停
setTimeout(() => {
  effect.pause();
  console.log('⏸️ 暂停');
}, 1000);

// 3秒后继续
setTimeout(() => {
  console.log('▶️ 继续');
  effect.resume();
}, 3000);

await promise;
```

### 示例 9: 取消输出

```typescript
const effect = createTypingEffect(
  '这是一段很长的文本...',
  { speed: 30 }
);

const promise = effect.start();

// 1秒后取消
setTimeout(() => {
  effect.cancel();
  console.log('❌ 已取消');
}, 1000);

await promise;
```

### 示例 10: 跳到结束

```typescript
const effect = createTypingEffect(
  '这段文本会在中途直接跳到结束',
  { speed: 40 }
);

const promise = effect.start();

// 1秒后跳到结束
setTimeout(() => {
  effect.skipToEnd();
}, 1000);

await promise;
```

### 示例 11: 代码输出效果

```typescript
const code = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}`;

console.log('```javascript');
await typeText(code, {
  speed: 20,
  randomize: true,
  randomVariation: 0.3,
});
console.log('```');
```

### 示例 12: 诗歌朗诵效果

```typescript
import { typeLines } from 'claude-agent-sdk-ui';

await typeLines(
  [
    '床前明月光,',
    '疑是地上霜。',
    '举头望明月,',
    '低头思故乡。',
  ],
  {
    speed: 60,
    lineDelay: 800,
    punctuationDelay: 400,
  }
);
```

## API 参考

### TypingEffect 类

```typescript
class TypingEffect {
  /** 开始打字动画 */
  start(): Promise<void>;

  /** 暂停打字 */
  pause(): void;

  /** 继续打字 */
  resume(): void;

  /** 取消打字 */
  cancel(): void;

  /** 跳到结束 (立即完成) */
  skipToEnd(): void;

  /** 获取当前状态 */
  getState(): string; // 'idle' | 'typing' | 'paused' | 'completed' | 'cancelled'

  /** 是否正在打字 */
  isTyping(): boolean;

  /** 是否已暂停 */
  isPaused(): boolean;

  /** 是否已完成 */
  isCompleted(): boolean;
}
```

### 便捷函数

```typescript
/** 简单的打字机效果函数 */
async function typeText(
  text: string,
  options?: TypingEffectOptions
): Promise<void>;

/** 多行文本打字效果 */
async function typeLines(
  lines: string[],
  options?: TypingEffectOptions & { lineDelay?: number }
): Promise<void>;

/** 创建打字机效果实例 */
function createTypingEffect(
  text: string,
  options?: TypingEffectOptions
): TypingEffect;
```

## 在流式渲染中使用

打字机效果可以与流式渲染结合使用:

```typescript
import { renderQuery } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

await renderQuery(
  query({
    prompt: '你的问题',
    options: { includePartialMessages: true },
  }),
  {
    streaming: true,
    typingEffect: true,    // 启用打字机效果
    typingSpeed: 20,       // 打字速度
  }
);
```

**注意**: 打字机效果主要在非 TTY 环境下有效,在 TTY 环境下流式渲染已经提供了流畅的实时更新。

## 性能考虑

### 速度建议

- **快速** (10-30ms): 适合长文本或需要快速显示的场景
- **适中** (30-60ms): 最佳视觉效果,推荐使用
- **慢速** (60-100ms): 强调效果,适合短文本

### 内存使用

- 打字机效果不会增加显著的内存开销
- 单个实例的内存占用 < 1KB
- 文本内容本身是主要的内存占用

### CPU 使用

- 每个字符的计算开销极小
- 使用 setTimeout 实现延迟,不会阻塞事件循环
- CPU 使用率 < 1%

## 运行演示

```bash
# 完整演示 (12 个示例)
npm run demo:typing

# 简单示例
npm run demo:typing:simple
```

## 最佳实践

1. **合理设置速度**
   ```typescript
   // 长文本用快速
   speed: 20
   
   // 短文本用慢速
   speed: 60
   ```

2. **使用随机变化增加真实感**
   ```typescript
   randomize: true,
   randomVariation: 0.3
   ```

3. **标点符号延迟让输出更自然**
   ```typescript
   punctuationDelay: 200
   ```

4. **提供跳过选项**
   ```typescript
   const effect = createTypingEffect(text, options);
   
   // 监听用户输入,允许跳过
   process.stdin.on('keypress', (_, key) => {
     if (key.name === 'space') {
       effect.skipToEnd();
     }
   });
   ```

5. **在 CI/CD 中使用立即模式**
   ```typescript
   instant: !process.stdout.isTTY
   ```

## 故障排除

### 问题: 输出没有打字效果

**原因**: 可能设置了 `instant: true` 或速度为 0

**解决**:
```typescript
typeText(text, {
  speed: 50, // 确保速度 > 0
  instant: false,
});
```

### 问题: 暂停后无法继续

**原因**: 需要确保在正确的状态下调用 resume

**解决**:
```typescript
if (effect.isPaused()) {
  effect.resume();
}
```

### 问题: 取消后文本仍然显示

**说明**: 这是预期行为,cancel() 会停止后续输出,但已输出的内容不会消失

**解决**: 如果需要清除,可以使用光标控制:
```typescript
import { createCursor } from 'claude-agent-sdk-ui';

const cursor = createCursor();
effect.cancel();
cursor.clearLine();
```

## 限制

- ⚠️ 打字机效果会增加总输出时间
- ⚠️ 不适合大量数据的输出
- ⚠️ 在管道输出中可能不理想

## 与其他功能的集成

### 与 Spinner 结合

```typescript
import { createSpinner, typeText } from 'claude-agent-sdk-ui';

const spinner = createSpinner('处理中...');
spinner.start();

// 处理任务...
await processTask();

spinner.stop();
await typeText('✅ 处理完成!', { speed: 30 });
```

### 与 Progress 结合

```typescript
import { createProgress, typeText } from 'claude-agent-sdk-ui';

const bar = createProgress();
bar.start(100);

for (let i = 0; i <= 100; i++) {
  bar.update(i);
  await sleep(50);
}

bar.stop();
await typeText('✅ 下载完成!', { speed: 40 });
```

## 下一步

- 探索 [流式渲染](./STREAMING.md)
- 查看 [UI 组件库](../UI_COMPONENTS_SUMMARY.md)
- 了解 [完整 API 文档](../README.md)

---

**提示**: 打字机效果是一个可选但强大的视觉增强功能,合理使用可以让你的 CLI 应用更加生动!
