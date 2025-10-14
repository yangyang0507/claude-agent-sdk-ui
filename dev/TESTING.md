# Progress Bar Testing Guide

## 问题说明

Progress Bar 组件使用 `cli-progress` 库，该库需要在 TTY（终端）环境中运行才能正确显示动画进度条。

## 已修复的问题

- ✅ **右括号缺失** - 进度条现在正确显示 `[████████████░░░░░░░░]`
- ✅ **格式化函数** - 修复了 `barCompleteString` 和 `barIncompleteString` 的错误使用
- ✅ **字符重复** - 使用 `repeat()` 方法正确构建进度条

## 如何测试

### 方法 1：使用 npm script（推荐）

```bash
npm run test:progress
```

### 方法 2：直接运行测试文件

```bash
npx tsx examples/quick-progress-test.ts
```

### 方法 3：运行完整的组件演示

```bash
npm run demo:components
```

## 预期输出

在正确的 TTY 环境中，你应该看到：

```
Quick Progress Bar Test

Running a simple progress bar...

[████████████████████████████████████████] 100% | 10/10 | Step 10 of 10

✅ Test Complete!
```

## 故障排除

### 看不到进度条？

**可能的原因：**

1. **非 TTY 环境**
   - VS Code 输出面板
   - 通过管道或重定向运行
   - CI/CD 环境

   **解决方案：** 在真实的终端窗口中运行

2. **终端不支持**
   - 某些旧终端不支持光标控制

   **解决方案：** 使用现代终端（iTerm2、Windows Terminal、macOS Terminal.app）

3. **输出被缓冲**
   - 输出被重定向或捕获

   **解决方案：** 直接在终端中运行，不要重定向输出

### 验证环境

检查你的环境是否支持 TTY：

```bash
node -e "console.log('Is TTY:', process.stdout.isTTY)"
```

应该输出：`Is TTY: true`

## 技术细节

### Progress 组件的工作原理

1. **TTY 检测**
   - 组件会检测 `process.stdout.isTTY`
   - 在非 TTY 环境中自动降级为文本输出

2. **格式化**
   - 使用自定义格式化函数生成进度条字符串
   - 支持多种样式：default、rect、shade、classic、minimal

3. **字符处理**
   - `barCompleteChar`: 已完成部分的字符（默认 `█`）
   - `barIncompleteChar`: 未完成部分的字符（默认 `░`）
   - 确保总长度等于 `barsize`

### 格式化函数示例

```typescript
const bar = completeChar.repeat(completeChars) + 
            incompleteChar.repeat(incompleteChars);
const formatted = `[${bar}] ${percentage}% | ${value}/${total}`;
```

## 相关文件

- `src/components/progress.ts` - Progress 组件实现
- `examples/quick-progress-test.ts` - 快速测试
- `examples/test-progress.ts` - 完整测试（包含所有样式）
- `examples/ui-components-demo.ts` - 组件演示（包含进度条）

## 已知限制

1. **需要 TTY 环境** - 这是 cli-progress 库的限制
2. **终端宽度** - 进度条宽度不应超过终端宽度
3. **更新频率** - 过于频繁的更新可能导致闪烁

## 最佳实践

1. **添加延迟** - 在更新之间添加适当的延迟（至少 50-100ms）
2. **合理的总数** - 使用合理的总数（10-1000）
3. **清理** - 完成后调用 `stop()` 方法
4. **错误处理** - 在 try-finally 块中使用以确保清理

```typescript
const bar = progressBars.default(100);
try {
  for (let i = 0; i <= 100; i++) {
    await setTimeout(100);
    bar.update(i);
  }
} finally {
  bar.stop();
}
```
