# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - UI Framework Integration (2025-10-14)

#### 🚀 Major Architecture Update
- **UI Framework Migration**: Complete migration to UI framework based on React for CLIs
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
- **Backward Compatibility**: All legacy APIs remains fully functional

#### 📚 Documentation
- **UI_QUICK_START.md**: 5-minute getting started guide
- **UI_RENDERER.md**: Complete UI renderer documentation  
- **UI_MIGRATION_GUIDE.md**: Migration guide for legacy users
- **Updated Examples**: All examples updated to use UI framework

### Added - UI Enhancement Update (2025-10-13)

#### 🎨 Major UI Improvements
- **Enhanced StreamRenderer**: Integrated Spinner, Badge, and Divider components for professional streaming experience
- **Enhanced Renderer**: Completely redesigned message rendering with modern UI components
- **Session Initialization**: Beautiful Box-wrapped session info with Divider separators
- **Tool Execution**: Badge-labeled tool calls with Box-wrapped parameters
- **Tool Results**: Status badges with colored Box borders and execution time display
- **Final Results**: Professional Table layout for statistics and Token usage
- **Loading Feedback**: Automatic Spinner animations during tool execution (TTY environment)

#### 📦 Component Integration
- Badge components for status indicators (EXECUTING, COMPLETED, FAILED, etc.)
- Box components for content wrapping (session info, tool params, results)
- Divider components for visual separation (session start/end, execution complete)
- Table components for structured data (execution stats, Token usage)
- Spinner components for loading animations (tool execution progress)

#### 📚 Documentation
- Added `docs/ui-enhancements.md` - Detailed UI enhancement guide
- Added `docs/ui-upgrade-summary.md` - Complete upgrade summary
- Added `docs/quick-start-enhanced.md` - Quick start guide for enhanced UI
- Updated `README.md` with new UI examples and features

#### 🎯 Examples
- Added `examples/agent-integration/enhanced-ui-demo.ts` - Comprehensive demo
- Added npm script `npm run demo:enhanced` to run the new demo

#### 🎨 Visual Improvements
- Session info now displayed in rounded boxes with colored borders
- Tool calls marked with colored info badges
- Tool results show success/error badges with execution time
- Statistics displayed in professional tables with proper alignment
- Clear visual hierarchy with dividers and spacing
- All components auto-adapt to current theme colors

#### 🔧 Technical Improvements
- Backward compatible - all existing APIs remain unchanged
- Theme-aware component colors
- Automatic TTY detection for optimal rendering
- TypeScript types for all new features
- Zero breaking changes

### Changed
- Upgraded all message rendering to use new UI components
- Improved visual hierarchy and information organization
- Enhanced status feedback with colored badges
- Better data presentation with tables instead of lists

### Fixed
- Removed unused variable warnings in renderer.ts
- Removed unused Box import in stream-renderer.ts
- Fixed TypeScript compilation errors

---

## [0.1.0] - 2025-10-12

### Added
- Initial release
- Core Renderer class
- StreamRenderer for partial message support
- Theme system (dark/light themes)
- Basic message type rendering
- Markdown formatting with marked-terminal
- Code syntax highlighting with cli-highlight
- JSON formatting
- Table formatting with cli-table3
- UI components: Box, Badge, Divider, Spinner, Progress
- Typing effect utility
- Cursor control utility
- Comprehensive documentation
- Multiple examples

### Features
- Zero-config beautiful terminal UI
- Minimal API (`render`, `renderQuery`)
- Complete TypeScript type definitions
- Flexible configuration options
- High performance rendering

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes

---

[Unreleased]: https://github.com/yangyang0507/claude-agent-sdk-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yangyang0507/claude-agent-sdk-ui/releases/tag/v0.1.0
