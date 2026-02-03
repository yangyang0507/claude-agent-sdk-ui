# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-02-03

### ✨ New Features

#### 📊 Replay Enhancements
- **Log Statistics**: Added comprehensive log statistics tracking
  - Session duration, message counts, token usage analysis
  - Tool execution statistics with success/failure rates
  - Performance metrics and timing information
- **Replay Summary**: Added summary output for replay sessions
  - `--summary` flag for human-readable summary
  - `--summary-json` flag for JSON output
  - Detailed session metrics and execution breakdown
- **Stats Utilities**: New `utils/stats.ts` for statistics calculation

#### 🎨 Theme System Enhancements
- **Theme Preview**: Added interactive theme preview tool (`examples/theme-preview.tsx`)
  - Live theme switching with keyboard controls
  - Toggle display options in real-time
  - Preview themes before integration
- **Theme Templates**: Added ready-to-use theme templates
  - `minimal-theme.ts`: Simple colors & symbols template
  - `card-theme.tsx`: Card-style layout template
  - Easy starting points for custom themes
- **Custom Layout Documentation**: Added comprehensive guide (`docs/custom-layout-theme.md`)

#### ⌨️ Command Mode
- **Command Overlay**: New `CommandOverlay` component for keyboard shortcuts
  - Visual command palette display
  - Keyboard shortcuts reference
  - Help and navigation hints
- **useCommandMode Hook**: React hook for command mode state management
  - Keyboard event handling
  - Command registry
  - State persistence

#### 🌊 Streaming Improvements
- **Stream Assembler**: New `StreamAssembler` class for managing streaming content
  - Efficient content buffering and assembly
  - Partial message handling
  - State tracking and synchronization
- **Stats Tracker**: Real-time statistics tracking during streaming
  - Live token usage updates
  - Tool execution monitoring
  - Performance metrics collection

#### 🧩 UI Components
- **TimestampLine Component**: Display timestamps with consistent formatting
  - Configurable format options
  - Theme-aware styling
  - Compact mode support

### ✅ Testing & Quality

#### 🧪 Test Coverage Expansion
- **+1570 lines** of new test coverage across the codebase
- **Components Testing**:
  - `Spinner` component tests (42 new tests)
  - `StatusLine` component tests (59 new tests)
- **Hooks Testing**:
  - `useTheme` hook tests (50 new tests)
  - `useWaitingState` hook tests (67 new tests)
- **Renderer Testing**:
  - Standard renderer tests (210 new tests)
  - Streaming renderer tests (112 new tests)
- **Utilities Testing**:
  - Logger utilities (152 new tests)
  - Replay system (386 new tests)
  - String utilities (123 new tests)
  - Terminal utilities (250 new tests)
  - Tool utilities (59 new tests)
- **Theme Testing**:
  - Theme system integration tests (21 new tests)
- **Type Testing**:
  - Message type validation tests (13 new tests)

#### 📈 Coverage Improvements
- Significantly improved edge case coverage
- Enhanced error handling tests
- Better integration test scenarios
- Comprehensive unit test suite

### 🔧 API Changes

#### New Exports
```typescript
// Statistics utilities
export { calculateLogStats } from './utils/stats';

// New components
export { CommandOverlay } from './components/ui/command-overlay';
export { TimestampLine } from './components/ui/timestamp-line';

// New hooks
export { useCommandMode } from './hooks/use-command-mode';

// Streaming utilities
export { StreamAssembler } from './renderer/stream-assembler';
export { StatsTracker } from './renderer/stats-tracker';
```

#### Replay CLI Enhancements
```bash
# New summary options
npm run replay -- logs/session.jsonl --summary
npm run replay -- logs/session.jsonl --summary-json

# Enhanced with statistics output
```

### 📚 Documentation

- Added Custom Layout Theme Guide (`docs/custom-layout-theme.md`)
- Updated README with theme preview instructions
- Added theme template examples documentation
- Enhanced replay command documentation
- Added command mode usage guide

### 🛠️ Internal Improvements

- Refactored streaming renderer for better performance
- Improved options handling in renderer
- Enhanced message routing logic
- Better error handling in replay system
- Optimized stats calculation algorithms

### 🎯 Developer Experience

- **Better Examples**: Added `theme-preview.tsx` for interactive exploration
- **Template Starting Points**: Theme templates reduce custom theme development time
- **Comprehensive Tests**: High test coverage ensures reliability
- **Better Documentation**: Step-by-step guides for advanced features

---

## [1.0.0] - 2025-01-16

### 🎉 Initial Release

The first public release of Claude Agent SDK UI - a beautiful, declarative terminal UI framework built on React + Ink for Claude Agent SDK.

---

### ✨ Core Features

#### 🏗️ Architecture
- **React + Ink Framework**: Built on modern React components for terminal UI
- **Declarative Components**: Write terminal UI like web UI with JSX
- **Type-Safe**: Complete TypeScript support with full type definitions
- **Zero Config**: Beautiful UI out of the box with sensible defaults
- **Modular Design**: Reusable components that work independently

#### 🎨 Rendering Capabilities
- **Standard Rendering**: Traditional message-by-message rendering
- **Streaming Rendering**: Real-time streaming with typewriter effects
- **Partial Message Support**: Progressive rendering as messages arrive
- **Smart Message Router**: Automatic message type detection and routing
- **Theme System**: Built-in themes with easy customization

#### 🖥️ UI Component Library
- **Badge**: Status indicators (SUCCESS, ERROR, INFO, WARNING, etc.)
- **Box**: Bordered containers with customizable styles
- **Divider**: Visual separators (solid, dashed, heavy, double)
- **Spinner**: Loading animations with multiple styles
- **StatusLine**: Contextual status display
- **Markdown**: Terminal-optimized markdown rendering
- **StreamingText**: Typewriter effect with configurable speed
- **Table**: Formatted data tables with alignment

#### 🎭 Theme System
- **claude-code Theme**: Claude Code inspired color scheme
- **droid Theme**: Android-inspired design
- **Custom Themes**: Easy theme creation with Theme API
- **Theme Context**: React Context for theme-aware components
- **Dynamic Theme Switching**: Change themes at runtime

#### 📦 API Design

**Functional API (Recommended)**:
```typescript
// Simple rendering
await renderQuery(queryGenerator, options);

// Streaming with typing effect
await renderQueryStreaming(queryGenerator, options);

// Single message
await render(message, options);
```

**Class-based API (Advanced)**:
```typescript
// Create renderer instance
const renderer = createRenderer(options);
const streamingRenderer = createStreamingRenderer(options);

// Manual control
await renderer.render(message);
await renderer.cleanup();
```

#### 🔧 Configuration Options
- `theme`: Theme selection ('claude-code', 'droid', or custom)
- `showTimestamps`: Display message timestamps
- `showSessionInfo`: Show session initialization info
- `showFinalResult`: Display final execution result
- `showExecutionStats`: Show execution statistics
- `showTokenUsage`: Display token consumption
- `showThinking`: Show Claude's thinking process
- `showToolDetails`: Display tool invocation details
- `showToolContent`: Show full content in tool parameters
- `compact`: Enable compact display mode
- `maxOutputLines`: Limit output length (default: 100)
- `maxWidth`: Terminal width limit (default: 120)
- `codeHighlight`: Enable syntax highlighting
- `streaming`: Enable streaming mode
- `typingEffect`: Enable typewriter effect
- `typingSpeed`: Typing speed in milliseconds (default: 20ms)
- `logging`: Log configuration for session replay

#### 📼 Logging & Replay System
- **Session Logging**: Record complete sessions to JSONL format
- **Replay CLI**: Replay recorded sessions with `npm run replay`
- **Realtime Replay**: Replay at original speed or custom speed
- **Theme Override**: Replay with different themes
- **Streaming Replay**: Replay with streaming effects
- **Configurable Format**: Customize log file naming and location

#### 💻 Message Type Support
- **System Messages**: Session initialization, compression boundaries
- **Assistant Messages**: Text content, thinking blocks, tool usage
- **User Messages**: Tool result display
- **Result Messages**: Success and error states
- **Partial Messages**: Streaming message updates
- **Tool Invocations**: Tool calls with parameters
- **Tool Results**: Tool execution results with timing

#### 🎨 Visual Enhancements
- **Session Info Box**: Rounded bordered box with session details
- **Tool Execution Badges**: Color-coded status indicators
- **Execution Time**: Display time taken for each operation
- **Statistics Tables**: Professional data table layouts
- **Loading Spinners**: Animated feedback during execution
- **Visual Hierarchy**: Clear separation with dividers and spacing
- **Theme-Aware Colors**: All components adapt to current theme

---

### 📚 Documentation

#### Core Documentation
- `README.md` - Project overview and quick start
- `README_CN.md` - Chinese documentation
- `CHANGELOG.md` - Version history and changes

#### Component Documentation
- Complete API reference for all UI components
- Usage examples for each component
- Theme customization guide
- Configuration options reference

#### Examples
- `examples/agent-integration/hello-streaming-demo.ts` - Basic streaming example
- `examples/agent-integration/sample-demo.ts` - Sample integration
- Multiple demo scripts in `demos/` directory

---

### 🛠️ Technical Details

#### Dependencies
- **ink** ^6.3.1 - Terminal UI framework
- **react** ^19.2.0 - Component framework
- **chalk** ^5.3.0 - Terminal colors
- **cli-table3** ^0.6.5 - Table formatting
- **marked** ^12.0.0 - Markdown parsing
- **marked-terminal** ^7.0.0 - Terminal markdown rendering
- **dayjs** ^1.11.10 - Date/time formatting

#### Development Tools
- **TypeScript** 5.3.3 - Type safety
- **tsup** - Fast bundler
- **vitest** - Testing framework
- **eslint** - Code linting
- **prettier** - Code formatting

#### Build Output
- ESM module (`dist/index.js`)
- CommonJS module (`dist/index.cjs`)
- TypeScript definitions (`dist/index.d.ts`)

#### Requirements
- Node.js >= 18.0.0
- @anthropic-ai/claude-agent-sdk ^0.1.14

---

### 🎯 Key Highlights

#### 🚀 Performance
- 50% code reduction through React components
- Efficient rendering with Ink's virtual terminal
- Optimized for large message volumes
- Minimal memory footprint

#### 🎨 User Experience
- Beautiful UI out of the box
- Smooth streaming animations
- Clear visual feedback
- Professional appearance

#### 🔧 Developer Experience
- Simple one-line API
- Full TypeScript support
- Comprehensive documentation
- Rich example collection
- Easy theme customization
- Modular component system

#### 🌟 Unique Features
- Typewriter effect for immersive experience
- Session replay system for debugging
- Complete message logging
- Theme-aware components
- Flexible configuration
- React component architecture

---

### 📦 Distribution

#### Package Information
- **Package Name**: `claude-agent-sdk-ui`
- **Version**: 0.1.0
- **License**: MIT
- **Author**: D.Yang
- **Repository**: GitHub

#### Installation
```bash
npm install claude-agent-sdk-ui @anthropic-ai/claude-agent-sdk
```

#### Quick Start
```typescript
import { renderQuery } from 'claude-agent-sdk-ui';
import { query } from '@anthropic-ai/claude-agent-sdk';

await renderQuery(query({ prompt: 'Hello, Claude!' }));
```

---

### 🔮 Future Plans

#### Planned Features
- More built-in themes
- Additional UI components
- Enhanced markdown rendering
- Progress bars and charts
- Interactive components
- Plugin system
- More animation effects

#### Community
- Bug reports and feature requests welcome
- Contributions encouraged
- Active maintenance and updates

---

## Legend

- 🎉 **Major Release**: Significant milestones
- ✨ **Features**: New functionality
- 🎨 **UI/UX**: Visual and user experience improvements
- 🔧 **API**: API changes and improvements
- 📚 **Documentation**: Documentation updates
- 🛠️ **Technical**: Technical improvements
- 🐛 **Fixed**: Bug fixes
- 🔒 **Security**: Security improvements
- ⚠️ **Deprecated**: Features to be removed
- 💥 **Breaking**: Breaking changes

---

## Version Links

[1.1.0]: https://github.com/yangyang0507/claude-agent-sdk-ui/releases/tag/v1.1.0
[1.0.0]: https://github.com/yangyang0507/claude-agent-sdk-ui/releases/tag/v1.0.0

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## Support

- 📦 [npm Package](https://www.npmjs.com/package/claude-agent-sdk-ui)
- 📚 [Documentation](https://github.com/yangyang0507/claude-agent-sdk-ui)
- 🐛 [Issue Tracker](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- 💬 [Discussions](https://github.com/yangyang0507/claude-agent-sdk-ui/discussions)

---

Made with ❤️ for the Claude Agent SDK Community
