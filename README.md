# Claude Agent SDK UI

<div align="center">

**Professional CLI UI for Claude Agent SDK - Beautiful Terminal Experience in One Line of Code**

Out-of-the-box, beautiful CLI UI rendering for Claude Agent SDK

[![npm version](https://img.shields.io/npm/v/claude-agent-sdk-ui.svg)](https://www.npmjs.com/package/claude-agent-sdk-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## ✨ Features

- 🎨 **Zero Config** - Beautiful terminal UI out of the box
- 🚀 **Minimal API** - Render messages with a single line of code
- 🎭 **Theme System** - Built-in dark/light themes with full customization
- 📊 **Rich Display** - Tool calls, code highlighting, Markdown, statistics, and more
- 🎁 **UI Components** - Professional components: Badge, Box, Divider, Table, Spinner
- ⚡ **High Performance** - Optimized rendering engine for handling large message volumes
- 🌊 **Streaming** - Real-time updates with typing effect support
- 💪 **Type Safe** - Complete TypeScript type definitions
- 🔧 **Flexible Config** - Rich configuration options for various needs

---

## 📦 Installation

```bash
npm install claude-agent-sdk-ui @anthropic-ai/claude-agent-sdk
```

**Requirements:**
- Node.js >= 18.0.0
- @anthropic-ai/claude-agent-sdk >= 0.1.0

---

## 🚀 Quick Start

### Simplest Usage - One Line

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

// 🎉 Super simple! One line does it all
await renderQuery(query({ prompt: 'Hello, Claude!' }));
```

### Message-by-Message Rendering (Optional)

```typescript
import { render } from 'claude-agent-sdk-ui';

// If you need to process each message
for await (const message of query({ prompt: 'Hello!' })) {
  // Add custom logic here
  await render(message);
}
```

### Advanced Usage - Custom Configuration

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from 'claude-agent-sdk-ui';

await renderQuery(
  query({
    prompt: 'Analyze the file structure of current directory',
    options: {
      maxTurns: 10,
      allowedTools: ['Read', 'Grep', 'Glob'],
    }
  }),
  {
    theme: 'dark',               // Theme selection
    showTimestamps: true,        // Show timestamps
    showTokenUsage: true,        // Show token statistics (disabled by default)
    showThinking: true,          // Show thinking process
    showToolDetails: true,       // Show tool details
    showToolContent: true,       // Reveal raw tool content fields (hidden by default)
    maxOutputLines: 50,          // Max output lines
  }
);
```

---

## 🎨 Enhanced UI Preview

### Session Initialization (Enhanced)

```
═══════════ 🚀 SESSION INITIALIZED ═══════════

╭───────────────── 📋 Session Info ─────────────────╮
│ Session ID: 628c0fcf                              │
│ Model: claude-sonnet-4                            │
│ Working Dir: /Users/username/project              │
│ Permission: [ℹ DEFAULT]                          │
╰───────────────────────────────────────────────────╯

[✓ SUCCESS] 15 TOOLS AVAILABLE
  🔧 Bash  🔧 Read  🔧 Edit  🔧 Write  ...
```

### Tool Execution (Enhanced)

```
[ℹ INFO] 🔧 Read

┌───────────────────────────────────────────────┐
│ {                                             │
│   "path": "package.json"                      │
│ }                                             │
└───────────────────────────────────────────────┘

⠋ Executing Read...  ← Dynamic spinner (TTY)

[✓ SUCCESS] RESULT: SUCCESS (0.5s)

┌───────────────────────────────────────────────┐
│ {                                             │
│   "name": "my-project",                       │
│   "version": "1.0.0",                         │
│   ...                                         │
│ }                                             │
└───────────────────────────────────────────────┘
```

### Execution Complete (Enhanced)

```
═════════ ✅ EXECUTION COMPLETE ══════════

[ℹ INFO] EXECUTION STATS

┌──────────────────┬────────────────────────┐
│ Metric           │                  Value │
├──────────────────┼────────────────────────┤
│ Status           │             ✅ Success │
│ Duration         │                  22.2s │
│ Turns            │                     22 │
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

---

## 📚 Documentation

### User Documentation

- 🚀 [UI Quick Start](./docs/UI_QUICK_START.md) - 5-minute guide to UI framework (Recommended)
- 📖 [Getting Started](./docs/getting-started.md) - Basic usage guide
- ✨ [UI Enhancements](./docs/ui-enhancements.md) - Learn about the new visual experience
- 🎬 [Streaming](./docs/streaming.md) - Real-time Claude responses
- ⌨️ [Typing Effect](./docs/typing-effect.md) - Elegant character-by-character output
- 🎨 [UI Components](./docs/ui-components.md) - 5 ready-to-use terminal components
- 🔧 [UI Renderer Guide](./docs/UI_RENDERER.md) - Complete UI renderer documentation
- 📋 [UI Migration Guide](./docs/UI_MIGRATION_GUIDE.md) - Migrate from legacy to UI

### Developer Documentation

- 🔧 [Development Guide](./dev/DEVELOPMENT.md) - Technical implementation and architecture
- 📋 [TODO](./dev/TODO.md) - Project progress and plans
- 🧪 [Testing Guide](./dev/TESTING.md) - Testing instructions and troubleshooting

---

## 🎯 Examples

```bash
# UI framework demo (Recommended)
npm run demo:ui

# UI streaming demo
npm run demo:ui:streaming

# Basic components demo
npm run demo:basic

# Full session demo
npm run demo:full

# Theme demos
npm run demo:theme:claude
npm run demo:theme:droid
```

---

## ⚙️ Configuration Options

### RendererOptions

```typescript
interface RendererOptions {
  // Theme configuration
  theme?: 'dark' | 'light' | Theme;

  // Display options
  showTimestamps?: boolean;      // Show timestamps (default: false)
  showTokenUsage?: boolean;      // Show token usage (default: false)
  showThinking?: boolean;        // Show thinking process (default: false)
  showToolDetails?: boolean;     // Show tool details (default: true)
  showToolContent?: boolean;     // Show raw content fields in tool params (default: false)

  // Format options
  compact?: boolean;             // Compact mode (default: false)
  maxOutputLines?: number;       // Max output lines (default: 100)
  maxWidth?: number;             // Max width (default: 120)

  // Advanced options
  codeHighlight?: boolean;       // Code highlighting (default: true)
  streaming?: boolean;           // Streaming rendering (default: false)
  typingEffect?: boolean;        // Typing effect (default: false)
  typingSpeed?: number;          // Typing speed (default: 20ms)
}
```

---

## 🎭 Theme System

### Built-in Themes

```typescript
import { darkTheme, lightTheme } from 'claude-agent-sdk-ui';

// Use dark theme (default)
const renderer = new Renderer({ theme: 'dark' });

// Use light theme
const renderer = new Renderer({ theme: 'light' });
```

### Custom Theme

```typescript
import { createTheme } from 'claude-agent-sdk-ui';

const myTheme = createTheme({
  name: 'my-theme',
  colors: {
    primary: '#FF6B6B',
    success: '#51CF66',
    error: '#FF6B6B',
    warning: '#FFD93D',
    info: '#4DABF7',
    text: '#F8F9FA',
    dim: '#868E96',
  },
});
```

---

## 📖 API Documentation

### Main Exports

```typescript
// Functions
export function renderQuery(queryGenerator, options?): Promise<void>;
export function render(message, options?): Promise<void>;
export function createRenderer(options?): Renderer;
export function createTheme(options): Theme;
export function getTheme(input?): Theme;

// Classes
export class Renderer {
  constructor(options?);
  render(message): Promise<void>;
  getState(): RendererState;
  reset(): void;
}

// Themes
export { darkTheme, lightTheme };

// UI Components
export { Box, Badge, Divider, Spinner, Progress };
export { createTableFormatter } from './formatters/table.js';

// Types
export type { SDKMessage, RendererOptions, Theme, ... };
```

---

## 💡 UI Components

Use the built-in UI components directly:

```typescript
import { Box, Badge, Divider, createTableFormatter } from 'claude-agent-sdk-ui';

// Badge
console.log(Badge.success('COMPLETED'));
console.log(Badge.error('FAILED'));
console.log(Badge.info('PROCESSING'));

// Box
const box = new Box({ borderStyle: 'round', padding: 1 });
console.log(box.render('Important message'));

// Divider
const divider = new Divider({ style: 'double', text: 'SECTION' });
console.log(divider.render());

// Table
const table = createTableFormatter({
  columns: [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Value', key: 'value', width: 30 },
  ],
});
console.log(table.render(data, theme));
```

---

## 🧪 Development

### Setup

```bash
# Install dependencies
npm install

# Development mode (watch files)
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

### Testing

```bash
# Run tests
npm test

# Run test UI
npm run test:ui

# Run UI demos
npm run demo:ui
npm run demo:ui:streaming
npm run demo:basic

# Run table formatter test
npm run test:table
```

---

## 🤝 Contributing

Contributions are welcome! Please check out:

- 📖 [Development Guide](./dev/DEVELOPMENT.md) - Detailed technical design and architecture
- 🐛 [Issue Tracker](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 💡 [Feature Requests](https://github.com/yangyang0507/claude-agent-sdk-ui/issues/new)

### Contributing Steps

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2025

---

## 🔗 Links

- 📚 [Claude Agent SDK - TypeScript](https://docs.anthropic.com/en/api/agent-sdk/typescript)
- 📘 [Claude Agent SDK - Python](https://docs.anthropic.com/en/api/agent-sdk/python)
- 🌐 [Claude API Documentation](https://docs.anthropic.com/)
- 💬 [GitHub Issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 📦 [npm Package](https://www.npmjs.com/package/claude-agent-sdk-ui)

---

<div align="center">

**Make every developer easily build beautiful, professional AI Agent CLI applications!** 🚀

Made with ❤️ for the Claude Agent SDK Community

[⭐ Star us](https://github.com/yangyang0507/claude-agent-sdk-ui) | [📖 Documentation](./docs/UI_QUICK_START.md) | [🐛 Report Issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)

</div>
