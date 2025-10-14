# UI 组件库使用指南

> 5 个精美的终端 UI 组件,让你的 CLI 应用更专业

## 概述

Claude Agent SDK UI 提供了 5 个开箱即用的终端 UI 组件:

- **Box** - 边框容器,用于突出显示内容
- **Divider** - 分隔线,用于分隔不同区域
- **Badge** - 状态徽章,用于显示状态标签
- **Spinner** - 加载动画,用于显示加载状态
- **Progress** - 进度条,用于显示进度

所有组件都支持:
- ✅ 完整的 TypeScript 类型
- ✅ 主题颜色自适应
- ✅ 链式 API 和函数式 API
- ✅ ASCII 安全模式 (部分组件)

## 📦 安装

```bash
npm install claude-agent-sdk-ui
```

## 快速开始

```typescript
import { Box, Badge, Divider } from 'claude-agent-sdk-ui';

// 创建带边框的盒子
const box = new Box({
  borderStyle: 'double',
  padding: 1,
  title: '欢迎',
});
console.log(box.render('Hello, World!'));

// 显示状态徽章
const badge = new Badge({ type: 'success' });
console.log(badge.render('完成'));

// 显示分隔线
const divider = new Divider({ style: 'heavy' });
console.log(divider.render());
```

---

## 📦 Box 组件

边框容器,用于突出显示重要内容。

### 特性

- 5 种边框样式
- 支持标题
- 可配置内边距
- 文本自动换行
- 多种对齐方式
- 最小/最大宽度控制

### 基本用法

```typescript
import { Box, createBox, renderBox } from 'claude-agent-sdk-ui';

// 方式 1: 类 API
const box = new Box({ borderStyle: 'single' });
console.log(box.render('内容'));

// 方式 2: 工厂函数
const box2 = createBox({ borderStyle: 'double' });
console.log(box2.render('内容'));

// 方式 3: 一行代码
console.log(renderBox('内容', { borderStyle: 'round' }));
```

### 配置选项

```typescript
interface BoxOptions {
  /** 边框样式 */
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'none';
  
  /** 边框颜色 */
  borderColor?: string;
  
  /** 标题 */
  title?: string;
  
  /** 标题颜色 */
  titleColor?: string;
  
  /** 标题对齐 */
  titleAlign?: 'left' | 'center' | 'right';
  
  /** 内边距 */
  padding?: number;
  
  /** 内容对齐 */
  align?: 'left' | 'center' | 'right';
  
  /** 最小宽度 */
  minWidth?: number;
  
  /** 最大宽度 */
  maxWidth?: number;
  
  /** 文本颜色 */
  textColor?: string;
}
```

### 边框样式示例

```typescript
import { renderBox } from 'claude-agent-sdk-ui';

// Single border
console.log(renderBox('Single Border', { borderStyle: 'single' }));
// ┌─────────────┐
// │ Single      │
// └─────────────┘

// Double border
console.log(renderBox('Double Border', { borderStyle: 'double' }));
// ╔═════════════╗
// ║ Double      ║
// ╚═════════════╝

// Round border
console.log(renderBox('Round Border', { borderStyle: 'round' }));
// ╭─────────────╮
// │ Round       │
// ╰─────────────╯

// Bold border
console.log(renderBox('Bold Border', { borderStyle: 'bold' }));
// ┏━━━━━━━━━━━━━┓
// ┃ Bold        ┃
// ┗━━━━━━━━━━━━━┛
```

### 带标题的盒子

```typescript
console.log(renderBox('这是一个重要通知', {
  borderStyle: 'double',
  title: '📢 通知',
  titleAlign: 'center',
  padding: 1,
}));
// ╔════ 📢 通知 ════╗
// ║                 ║
// ║ 这是一个重要通知 ║
// ║                 ║
// ╚═════════════════╝
```

### 多行内容

```typescript
const content = `Line 1
Line 2
Line 3`;

console.log(renderBox(content, {
  borderStyle: 'single',
  padding: 1,
  align: 'center',
}));
```

---

## ➖ Divider 组件

分隔线,用于在终端中分隔不同的内容区域。

### 特性

- 6 种分隔线样式
- 支持文本分隔线
- 可自定义颜色
- 可配置宽度

### 基本用法

```typescript
import { Divider, createDivider, renderDivider } from 'claude-agent-sdk-ui';

// 方式 1: 类 API
const divider = new Divider({ style: 'heavy' });
console.log(divider.render());

// 方式 2: 工厂函数
const divider2 = createDivider({ style: 'double' });
console.log(divider2.render());

// 方式 3: 一行代码
console.log(renderDivider({ style: 'dashed' }));
```

### 配置选项

```typescript
interface DividerOptions {
  /** 分隔线样式 */
  style?: 'light' | 'heavy' | 'double' | 'dashed' | 'dotted' | 'unicode';
  
  /** 宽度 */
  width?: number;
  
  /** 颜色 */
  color?: string;
  
  /** 文本 (居中显示) */
  text?: string;
  
  /** 文本颜色 */
  textColor?: string;
  
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
}
```

### 样式示例

```typescript
import { dividers } from 'claude-agent-sdk-ui';

// Light (细线)
console.log(dividers.light());
// ─────────────────────

// Heavy (粗线)
console.log(dividers.heavy());
// ━━━━━━━━━━━━━━━━━━━━━

// Double (双线)
console.log(dividers.double());
// ═════════════════════

// Dashed (虚线)
console.log(dividers.dashed());
// ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

// Dotted (点线)
console.log(dividers.dotted());
// ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

// Unicode (波浪线)
console.log(dividers.unicode());
// ～～～～～～～～～～～
```

### 文本分隔线

```typescript
console.log(renderDivider({
  style: 'heavy',
  text: 'Section 1',
  textColor: 'cyan',
}));
// ━━━━━━━ Section 1 ━━━━━━━

console.log(renderDivider({
  style: 'double',
  text: '⚡ Important',
  align: 'center',
}));
// ════════ ⚡ Important ════════
```

---

## 🏷️ Badge 组件

状态徽章,用于显示状态、标签等信息。

### 特性

- 5 种状态类型
- 3 种显示样式
- 支持自定义颜色
- **ASCII 安全模式** (解决 Unicode 渲染问题)
- 自动图标

### 基本用法

```typescript
import { Badge, createBadge, renderBadge } from 'claude-agent-sdk-ui';

// 方式 1: 类 API
const badge = new Badge({ type: 'success' });
console.log(badge.render('完成'));

// 方式 2: 工厂函数
const badge2 = createBadge({ type: 'error' });
console.log(badge2.render('失败'));

// 方式 3: 一行代码
console.log(renderBadge('警告', { type: 'warning' }));
```

### 配置选项

```typescript
interface BadgeOptions {
  /** 类型 */
  type?: 'success' | 'error' | 'warning' | 'info' | 'custom';
  
  /** 样式 */
  style?: 'filled' | 'outlined' | 'minimal';
  
  /** 自定义颜色 (type='custom' 时) */
  color?: string;
  
  /** 自定义图标 */
  icon?: string;
  
  /** ASCII 安全模式 */
  asciiMode?: boolean;
}
```

### 类型示例

```typescript
import { badges } from 'claude-agent-sdk-ui';

// Success (成功)
console.log(badges.success('完成'));
// ✔ 完成  (绿色)

// Error (错误)
console.log(badges.error('失败'));
// ✘ 失败  (红色)

// Warning (警告)
console.log(badges.warning('注意'));
// ⚠ 注意  (黄色)

// Info (信息)
console.log(badges.info('提示'));
// ℹ 提示  (蓝色)

// Custom (自定义)
console.log(badges.custom('自定义', { color: 'magenta', icon: '★' }));
// ★ 自定义  (紫色)
```

### 样式示例

```typescript
const badge = new Badge({ type: 'success' });

// Filled (填充,默认)
console.log(badge.render('完成', { style: 'filled' }));
// ✔ 完成  (背景色填充)

// Outlined (轮廓)
console.log(badge.render('完成', { style: 'outlined' }));
// ✔ 完成  (边框)

// Minimal (最小)
console.log(badge.render('完成', { style: 'minimal' }));
// ✔ 完成  (纯文本)
```

### ASCII 安全模式

某些终端可能无法正确渲染 Unicode 图标,可以使用 ASCII 模式:

```typescript
// Unicode 模式 (默认)
console.log(renderBadge('完成', { type: 'success' }));
// ✔ 完成

// ASCII 模式
console.log(renderBadge('完成', { type: 'success', asciiMode: true }));
// [OK] 完成

// 其他 ASCII 图标映射:
// ✔ → [OK]
// ✘ → [X]
// ⚠ → [!]
// ℹ → [i]
```

---

## ⏳ Spinner 组件

加载动画,用于显示正在处理的状态。

### 特性

- 基于 ora 库
- 多种动画样式
- 支持成功/失败状态
- Promise 包装器
- 可自定义文本和颜色

### 基本用法

```typescript
import { Spinner, createSpinner, spin } from 'claude-agent-sdk-ui';

// 方式 1: 类 API
const spinner = new Spinner({ text: '加载中...' });
spinner.start();
// ... 做一些异步操作
spinner.stop();

// 方式 2: 工厂函数
const spinner2 = createSpinner('处理中...');
spinner2.start();
await someTask();
spinner2.success('完成!');

// 方式 3: Promise 包装器
await spin(asyncTask(), { text: '正在处理...' });
```

### 配置选项

```typescript
interface SpinnerOptions {
  /** 显示文本 */
  text?: string;
  
  /** 动画样式 */
  spinner?: string; // 'dots', 'line', 'star' 等 (ora 支持的样式)
  
  /** 颜色 */
  color?: string;
  
  /** 是否隐藏光标 */
  hideCursor?: boolean;
}
```

### 基本操作

```typescript
const spinner = createSpinner('正在加载...');

// 开始
spinner.start();

// 更新文本
spinner.text = '正在处理...';

// 成功
spinner.success('完成!');

// 失败
spinner.fail('失败!');

// 警告
spinner.warn('警告');

// 信息
spinner.info('提示');

// 停止
spinner.stop();
```

### Promise 包装器

```typescript
import { spin } from 'claude-agent-sdk-ui';

// 自动管理 spinner 生命周期
const result = await spin(
  fetch('https://api.example.com/data'),
  { text: '正在获取数据...' }
);

// Promise 成功 → spinner 显示成功
// Promise 失败 → spinner 显示失败
```

### 多种动画样式

```typescript
import { spinners } from 'claude-agent-sdk-ui';

// Dots (点)
await spinners.dots('加载中...');

// Line (线)
await spinners.line('处理中...');

// Star (星)
await spinners.star('同步中...');
```

---

## 📊 Progress 组件

进度条,用于显示任务进度。

### 特性

- 基于 cli-progress 库
- 5 种进度条样式
- 百分比显示
- ETA (预计剩余时间)
- TTY 环境检测
- 多进度条支持

### 基本用法

```typescript
import { Progress, createProgress, progress } from 'claude-agent-sdk-ui';

// 方式 1: 类 API
const bar = new Progress({ style: 'default' });
bar.start(100);
for (let i = 0; i <= 100; i++) {
  bar.update(i);
  await sleep(50);
}
bar.stop();

// 方式 2: 工厂函数
const bar2 = createProgress({ style: 'modern' });
bar2.start(100);
// ...

// 方式 3: 简化 API
const bar3 = progress.create();
```

### 配置选项

```typescript
interface ProgressOptions {
  /** 进度条样式 */
  style?: 'default' | 'simple' | 'modern' | 'minimal' | 'detailed';
  
  /** 进度条宽度 */
  barsize?: number;
  
  /** 自定义格式 */
  format?: string;
  
  /** 是否显示 ETA */
  showETA?: boolean;
  
  /** 是否显示百分比 */
  showPercentage?: boolean;
  
  /** 前缀文本 */
  prefix?: string;
}
```

### 样式示例

```typescript
import { progressBars } from 'claude-agent-sdk-ui';

// Default (默认)
const bar1 = progressBars.default();
// [████████████░░░░░░░░] 60% | ETA: 5s

// Simple (简洁)
const bar2 = progressBars.simple();
// ████████████░░░░░░░░ 60%

// Modern (现代)
const bar3 = progressBars.modern();
// ▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱ 60% | 处理中...

// Minimal (最小)
const bar4 = progressBars.minimal();
// ████████████ 60%

// Detailed (详细)
const bar5 = progressBars.detailed();
// [████████████░░░░░░░░] 60/100 | 60% | ETA: 5s | 速度: 12/s
```

### 基本操作

```typescript
const bar = createProgress();

// 开始 (设置总数)
bar.start(100);

// 更新进度
bar.update(50);

// 增加进度
bar.increment(10); // 现在是 60

// 更新带文本
bar.update(70, { status: '正在处理...' });

// 停止
bar.stop();
```

### 多进度条

```typescript
import { createProgress } from 'claude-agent-sdk-ui';

const bar1 = createProgress({ prefix: '任务 1' });
const bar2 = createProgress({ prefix: '任务 2' });

bar1.start(100);
bar2.start(100);

// 同时更新多个进度条
for (let i = 0; i <= 100; i++) {
  bar1.update(i);
  bar2.update(i * 0.8); // 任务 2 较慢
  await sleep(50);
}

bar1.stop();
bar2.stop();
```

### TTY 环境检测

Progress 组件会自动检测 TTY 环境:
- **TTY 环境**: 显示动画进度条
- **非 TTY 环境**: 降级为简单文本输出

---

## 🎨 完整示例

### 示例 1: 状态报告

```typescript
import { Box, Badge, Divider } from 'claude-agent-sdk-ui';

console.log(renderBox('系统状态报告', {
  borderStyle: 'double',
  title: '📊 Status Report',
  titleAlign: 'center',
  padding: 1,
}));

console.log(badges.success('服务运行中'));
console.log(badges.info('CPU: 45%'));
console.log(badges.warning('内存: 85%'));

console.log(dividers.heavy());
```

### 示例 2: 加载流程

```typescript
import { createSpinner, createProgress } from 'claude-agent-sdk-ui';

const spinner = createSpinner('正在初始化...');
spinner.start();
await sleep(2000);
spinner.success('初始化完成');

const bar = createProgress({ style: 'modern' });
bar.start(100);
for (let i = 0; i <= 100; i++) {
  bar.update(i);
  await sleep(50);
}
bar.stop();

console.log(badges.success('所有任务完成!'));
```

### 示例 3: 分组内容

```typescript
import { renderBox, renderDivider } from 'claude-agent-sdk-ui';

console.log(renderBox('Group 1', {
  borderStyle: 'single',
  title: 'Section A',
}));

console.log(renderDivider({ style: 'dashed', text: 'OR' }));

console.log(renderBox('Group 2', {
  borderStyle: 'single',
  title: 'Section B',
}));
```

---

## 🔧 高级用法

### 主题颜色

所有组件都支持自定义颜色:

```typescript
// 使用预定义颜色
renderBox('内容', { borderColor: 'cyan', textColor: 'white' });

// 使用 chalk 颜色
import chalk from 'chalk';
renderBox(chalk.bold('粗体文本'), { borderColor: 'green' });
```

### 链式调用

```typescript
const box = new Box({ borderStyle: 'double' });
console.log(
  box
    .setBorderColor('cyan')
    .setTextColor('white')
    .setPadding(2)
    .render('内容')
);
```

### 组合使用

```typescript
const header = renderBox('Header', {
  borderStyle: 'double',
  titleAlign: 'center',
});

const divider = renderDivider({ style: 'heavy' });

const content = [
  badges.info('信息 1'),
  badges.success('信息 2'),
  badges.warning('信息 3'),
].join('\n');

const footer = renderBox(content, {
  borderStyle: 'single',
  padding: 1,
});

console.log([header, divider, footer].join('\n'));
```

---

## 📚 相关文档

- [快速开始](./getting-started.md)
- [流式渲染](./streaming.md)
- [打字机效果](./typing-effect.md)

---

## 🚀 运行演示

```bash
# UI 组件演示
npm run demo:components

# ASCII 安全模式演示
npm run demo:components:ascii

# 进度条测试
npm run test:progress
```

---

## ⚠️ 故障排除

### Unicode 字符显示问题

如果你的终端无法正确显示 Unicode 字符,使用 ASCII 模式:

```typescript
// Badge 组件
renderBadge('完成', { type: 'success', asciiMode: true });

// 或者运行 ASCII 演示
npm run demo:components:ascii
```

### Progress 不显示

Progress 组件需要 TTY 环境。如果在非 TTY 环境中运行:

```typescript
// 会自动降级为简单文本输出
const bar = createProgress();
bar.start(100);
bar.update(50); // 输出: Progress: 50/100
```

### 颜色不显示

确保环境变量 `FORCE_COLOR` 设置正确:

```bash
FORCE_COLOR=1 node your-script.js
```

---

## 📝 总结

Claude Agent SDK UI 的 5 个组件提供了构建专业 CLI 应用所需的所有基本 UI 元素:

- **Box** - 突出显示重要内容
- **Divider** - 分隔不同区域
- **Badge** - 显示状态标签
- **Spinner** - 显示加载状态
- **Progress** - 显示任务进度

所有组件都经过精心设计,支持多种样式和配置选项,并提供了灵活的 API。

开始使用:
```bash
npm install claude-agent-sdk-ui
```

愉快地构建你的 CLI 应用吧! 🎉
