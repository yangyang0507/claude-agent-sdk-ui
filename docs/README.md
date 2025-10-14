# Documentation

Welcome to Claude Agent SDK UI documentation!

## 📚 Table of Contents

### Getting Started

1. **[UI Quick Start](./UI_QUICK_START.md)** ⭐ **Recommended**
   - 5-minute guide to experience the UI framework
   - Live examples with streaming and typing effects
   - Configuration options and customization

2. **[Getting Started](./getting-started.md)**
   - Basic installation and setup
   - Simple examples
   - Common use cases

### Features

3. **[UI Enhancements](./ui-enhancements.md)** ✨ **New!**
   - Overview of new UI components
   - Badge, Box, Divider, Table, Spinner
   - Before/after comparisons
   - Usage examples

4. **[Streaming Rendering](./streaming.md)**
   - Real-time message updates
   - Streaming API usage
   - Performance considerations
   - Best practices

5. **[Typing Effect](./typing-effect.md)**
   - Character-by-character output
   - Configuration options
   - Use cases and examples
   - Performance tips

6. **[UI Components](./ui-components.md)**
   - 5 built-in components
   - Component API reference
   - Customization options
   - Examples for each component

7. **[UI Renderer Guide](./UI_RENDERER.md)**
   - Complete UI framework documentation
   - Component architecture
   - Advanced rendering techniques

8. **[UI Migration Guide](./UI_MIGRATION_GUIDE.md)**
   - Migrate from legacy to UI framework
   - Step-by-step instructions
   - Compatibility information

### Advanced Topics

7. **[UI Upgrade Summary](./ui-upgrade-summary.md)**
   - Complete upgrade details
   - Technical implementation
   - Migration guide
   - Performance improvements

### Development

8. **[Development Guide](../dev/DEVELOPMENT.md)**
   - Project architecture
   - Code organization
   - Build system
   - Contributing guidelines

9. **[Testing Guide](../dev/TESTING.md)**
   - Testing strategy
   - Running tests
   - Writing tests
   - Troubleshooting

10. **[TODO List](../dev/TODO.md)**
    - Current progress
    - Planned features
    - Known issues
    - Future roadmap

## 🎯 Quick Navigation

### By User Type

**For Beginners:**
1. [UI Quick Start](./UI_QUICK_START.md)
2. [Getting Started](./getting-started.md)
3. [UI Enhancements](./ui-enhancements.md)

**For Advanced Users:**
1. [Streaming Rendering](./streaming.md)
2. [UI Components](./ui-components.md)
3. [Typing Effect](./typing-effect.md)

**For Contributors:**
1. [Development Guide](../dev/DEVELOPMENT.md)
2. [Testing Guide](../dev/TESTING.md)
3. [Contributing Guidelines](../CONTRIBUTING.md)

### By Topic

**UI & Styling:**
- [UI Enhancements](./ui-enhancements.md)
- [UI Components](./ui-components.md)
- [Theme System](./getting-started.md#theme-system)

**Rendering:**
- [Streaming Rendering](./streaming.md)
- [Typing Effect](./typing-effect.md)
- [Message Types](./getting-started.md#message-types)

**Configuration:**
- [Renderer Options](./getting-started.md#configuration)
- [Custom Themes](./getting-started.md#custom-theme)
- [Component Options](./ui-components.md#configuration)

## 📖 Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── quick-start-enhanced.md      # ⭐ Quick start with new UI
├── getting-started.md           # Basic getting started guide
├── ui-enhancements.md          # ✨ New UI enhancements
├── streaming.md                # Streaming rendering guide
├── typing-effect.md            # Typing effect guide
├── ui-components.md            # UI components reference
└── ui-upgrade-summary.md       # Technical upgrade summary

dev/
├── DEVELOPMENT.md              # Development guide
├── TESTING.md                  # Testing guide
└── TODO.md                     # Project progress

examples/
├── agent-integration/          # Agent SDK integration examples
├── components/                 # Component usage examples
└── README.md                   # Examples index
```

## 🎨 Examples

Each documentation page includes examples. For more examples, check:

- **[Examples Directory](../examples/README.md)** - All examples
- **[Enhanced UI Demo](../examples/agent-integration/enhanced-ui-demo.ts)** - Complete demo
- **[Streaming Demo](../examples/agent-integration/streaming-demo.ts)** - Streaming examples
- **[Components Demo](../examples/components/)** - Component examples

## 🚀 Running Examples

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

## 📝 Contributing to Documentation

We welcome documentation improvements! To contribute:

1. Read the [Contributing Guidelines](../CONTRIBUTING.md)
2. Find or create an issue
3. Submit a pull request

### Documentation Guidelines

- **Clear and Concise**: Write clearly and get to the point
- **Code Examples**: Include working code examples
- **Screenshots**: Add screenshots where helpful
- **Keep Updated**: Ensure examples work with current version
- **English + Chinese**: Provide both language versions when possible

## 🔗 External Resources

### Claude Agent SDK

- [Official Documentation](https://docs.anthropic.com/en/api/agent-sdk/typescript)
- [Python SDK](https://docs.anthropic.com/en/api/agent-sdk/python)
- [Claude API](https://docs.anthropic.com/)

### Community

- [GitHub Repository](https://github.com/yangyang0507/claude-agent-sdk-ui)
- [Issue Tracker](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- [npm Package](https://www.npmjs.com/package/claude-agent-sdk-ui)

## ❓ Need Help?

- **Can't find what you're looking for?**
  - Check the [FAQ](./getting-started.md#faq)
  - Search [existing issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
  - Ask in [GitHub Discussions](https://github.com/yangyang0507/claude-agent-sdk-ui/discussions)

- **Found a bug?**
  - [Report it](https://github.com/yangyang0507/claude-agent-sdk-ui/issues/new)

- **Have a feature request?**
  - [Suggest it](https://github.com/yangyang0507/claude-agent-sdk-ui/issues/new)

## 🎯 What's Next?

After reading the documentation:

1. ⭐ **Star the project** on [GitHub](https://github.com/yangyang0507/claude-agent-sdk-ui)
2. 🎨 **Try the examples** (`npm run demo:enhanced`)
3. 💬 **Share your feedback** in [Discussions](https://github.com/yangyang0507/claude-agent-sdk-ui/discussions)
4. 🤝 **Contribute** following the [Contributing Guidelines](../CONTRIBUTING.md)

---

**Happy coding!** 🚀

If you find Claude Agent SDK UI helpful, please consider giving it a star on GitHub! ⭐
