# Contributing to Claude Agent SDK UI

Thank you for your interest in contributing to Claude Agent SDK UI! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- TypeScript knowledge
- Familiarity with terminal/CLI applications

### Find an Issue

- Browse [open issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- Look for issues tagged with `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/claude-agent-sdk-ui.git
cd claude-agent-sdk-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 4. Development Workflow

```bash
# Start development mode (watch mode)
npm run dev

# Run tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format

# Build the project
npm run build
```

### 5. Test Your Changes

```bash
# Run all tests
npm test

# Run specific demo
npm run demo:ui
npm run demo:ui:streaming
npm run demo:basic

# Test with your own code
npm run example
```

## 🤝 How to Contribute

### Reporting Bugs

1. **Search existing issues** first to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots or code samples if applicable

### Suggesting Features

1. **Search existing issues** for similar suggestions
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the feature
   - Use cases and benefits
   - Possible implementation approach (optional)
   - Examples or mockups (optional)

### Code Contributions

1. **Pick an issue** or create one for discussion
2. **Fork and create a branch** from `main`
3. **Write code** following our coding guidelines
4. **Add tests** for your changes
5. **Update documentation** if needed
6. **Commit your changes** with clear commit messages
7. **Push to your fork** and submit a pull request

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the coding guidelines
- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive

### PR Description

Include in your PR description:

- **What** - What changes you made
- **Why** - Why you made these changes
- **How** - How you implemented the changes
- **Testing** - How you tested the changes
- **Screenshots** - If applicable, add screenshots
- **Related Issues** - Link related issues (e.g., "Fixes #123")

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, maintainers will merge your PR
4. Your contribution will be included in the next release!

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(components): add progress bar component

Add a new progress bar component for tracking long-running operations.
Includes multiple styles and customization options.

Closes #123

fix(renderer): fix box rendering with unicode characters

Unicode characters were causing alignment issues in some terminals.
Now properly calculates string width using string-width library.

Fixes #456
```

## 📝 Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names
- Add TSDoc comments for public APIs

### Code Style

- Follow the existing code style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep lines under 100 characters when possible
- Run `npm run format` before committing

### File Organization

- Place new components in `src/components/`
- Place new formatters in `src/formatters/`
- Place utility functions in `src/utils/`
- Add types in `src/types/`
- Add examples in `examples/`
- Add tests in `test/`

### Naming Conventions

- **Files**: Use kebab-case (e.g., `my-component.ts`)
- **Classes**: Use PascalCase (e.g., `MyComponent`)
- **Functions**: Use camelCase (e.g., `myFunction`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MY_CONSTANT`)
- **Types/Interfaces**: Use PascalCase (e.g., `MyInterface`)

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Update tests when modifying existing code
- Aim for high test coverage
- Use descriptive test names
- Test edge cases and error conditions

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Organization

- Place unit tests next to the code they test
- Use `.test.ts` suffix for test files
- Group related tests using `describe` blocks
- Use `it` or `test` for individual test cases

## 📖 Documentation

### Code Documentation

- Add TSDoc comments for public APIs
- Include examples in comments when helpful
- Document complex logic with inline comments
- Keep comments up-to-date with code changes

### User Documentation

When adding new features, update:

- README.md (if it's a major feature)
- Relevant docs in `docs/` directory
- Add examples in `examples/` directory
- Update CHANGELOG.md

### Documentation Guidelines

- Use clear, concise language
- Include code examples
- Add screenshots or diagrams when helpful
- Keep documentation up-to-date
- Write in English for main docs
- Provide Chinese translation when possible

## 🌍 Community

### Getting Help

- **Documentation**: Check the [docs](./docs/) directory
- **Issues**: Search [existing issues](https://github.com/yangyang0507/claude-agent-sdk-ui/issues)
- **Discussions**: Start a [discussion](https://github.com/yangyang0507/claude-agent-sdk-ui/discussions)

### Communication

- Be respectful and constructive
- Provide helpful feedback
- Ask questions when unsure
- Share your experiences and ideas

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **New Components**: Terminal UI components (charts, forms, etc.)
- **Themes**: New color schemes and themes
- **Performance**: Optimization improvements
- **Documentation**: Tutorials, guides, translations
- **Examples**: Real-world usage examples
- **Tests**: Increase test coverage
- **Bug Fixes**: Fix reported issues
- **Accessibility**: Improve terminal accessibility

## 📄 License

By contributing to Claude Agent SDK UI, you agree that your contributions will be licensed under its MIT License.

## 🙏 Thank You!

Thank you for taking the time to contribute! Your contributions help make Claude Agent SDK UI better for everyone. 🎉

---

**Questions?** Feel free to ask in [GitHub Discussions](https://github.com/yangyang0507/claude-agent-sdk-ui/discussions) or [create an issue](https://github.com/yangyang0507/claude-agent-sdk-ui/issues/new).
