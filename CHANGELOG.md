# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-14

### 🚀 Major Architecture Update - Migration to Ink Framework

#### Core Framework Migration
- **Complete Architecture Rewrite**: Migrated to React Ink framework for terminal UI
- **React Components**: All UI components rewritten as React components for better maintainability
- **StreamingText Component**: New typewriter effect component with configurable speed
- **StreamingAssistantMessage Component**: Enhanced message rendering with streaming support
- **StreamingRenderer Class**: Advanced streaming renderer with typewriter effects

#### 🎨 New Features
- **Typewriter Effect**: Character-by-character text rendering for immersive experience
- **Flexbox Layout**: Automatic layout management using Ink's Flexbox system
- **React Context Theme System**: Enhanced theme management with React Context
- **Message Routing**: Smart message routing and rendering system
- **50% Code Reduction**: Streamlined architecture reduces codebase by 50%

#### 🔧 API Improvements
- **renderQueryWithInk()**: New convenient API for Ink rendering
- **renderQueryStreaming()**: Streaming API with typewriter effects
- **createStreamingRenderer()**: Manual control over streaming rendering
- **Backward Compatibility**: All legacy APIs remain fully functional

#### 🎨 UI Enhancement Features
- **Enhanced StreamRenderer**: Integrated Spinner, Badge, and Divider components for professional streaming experience
- **Session Initialization**: Beautiful Box-wrapped session info with Divider separators
- **Tool Execution**: Badge-labeled tool calls with Box-wrapped parameters
- **Tool Results**: Status badges with colored Box borders and execution time display
- **Final Results**: Professional Table layout for statistics and Token usage
- **Loading Feedback**: Automatic Spinner animations during tool execution (TTY environment)

#### 📦 Component Library
- Badge components for status indicators (EXECUTING, COMPLETED, FAILED, etc.)
- Box components for content wrapping (session info, tool params, results)
- Divider components for visual separation (session start/end, execution complete)
- Table components for structured data (execution stats, Token usage)
- Spinner components for loading animations (tool execution progress)

#### 📚 Documentation & Examples
- **UI_QUICK_START.md**: 5-minute getting started guide
- **UI_RENDERER.md**: Complete UI renderer documentation  
- **UI_MIGRATION_GUIDE.md**: Migration guide for legacy users
- **streaming.md**: Streaming functionality documentation
- **typing-effect.md**: Typewriter effect guide
- **ui-components.md**: Complete UI component reference
- Updated all examples to use new Ink framework
- Added agent integration demos with streaming support

#### 🎨 Visual Improvements
- Session info displayed in rounded boxes with colored borders
- Tool calls marked with colored info badges
- Tool results show success/error badges with execution time
- Statistics displayed in professional tables with proper alignment
- Clear visual hierarchy with dividers and spacing
- All components auto-adapt to current theme colors

#### 🔧 Technical Improvements
- **Backward Compatible**: All existing APIs remain unchanged
- **TypeScript Types**: Complete type definitions for all new features
- **Zero Breaking Changes**: Seamless upgrade path for existing users
- **Theme Integration**: Automatic theme-aware component colors
- **Performance Optimized**: Efficient rendering with React Ink

### Features
- Zero-config beautiful terminal UI
- Minimal API (`render`, `renderQuery`, `renderQueryWithInk`)
- Complete TypeScript type definitions
- Flexible configuration options
- High performance rendering with React
- Multiple built-in themes (light, dark, droid, claude-code)
- Comprehensive UI component library
- Streaming support with typewriter effects

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes

---

[0.1.0]: https://github.com/yangyang0507/claude-agent-sdk-ui/releases/tag/v0.1.0
