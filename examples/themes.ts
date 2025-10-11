/**
 * Theme example - Demonstrating different themes
 */

import { AgentRenderer, AgentMessage } from '../src/index.js';
import { darkTheme, lightTheme, defaultTheme } from '../src/themes/index.js';

async function demonstrateTheme(themeName: string, theme: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${themeName} Theme`);
  console.log('='.repeat(60) + '\n');

  const renderer = new AgentRenderer({
    theme: theme,
    showTimestamps: false,
  });

  const messages: AgentMessage[] = [
    {
      role: 'user',
      content: '帮我分析这段代码',
      timestamp: Date.now(),
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: '好的,让我来分析这段代码。',
        },
        {
          type: 'tool_use',
          id: 'tool_1',
          name: 'Read',
          input: {
            file_path: './example.ts',
          },
        },
      ],
      timestamp: Date.now(),
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool_result',
          tool_use_id: 'tool_1',
          output: 'export function hello() { return "world"; }',
        },
      ],
      timestamp: Date.now(),
    },
    {
      role: 'assistant',
      content: `
分析结果:

这是一个简单的 **TypeScript 函数**:

\`\`\`typescript
export function hello() {
  return "world";
}
\`\`\`

✅ 代码质量良好!
      `,
      timestamp: Date.now(),
    },
  ];

  for (const message of messages) {
    await renderer.render(message);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

async function themeExample() {
  console.log('\n🎨 Claude Agent UI - Theme Demonstration\n');

  // Demonstrate dark theme
  await demonstrateTheme('Dark', darkTheme);

  // Demonstrate light theme
  await demonstrateTheme('Light', lightTheme);

  // Demonstrate default theme
  await demonstrateTheme('Default', defaultTheme);

  // Demonstrate custom theme
  const customTheme = {
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      success: '#95E1D3',
      warning: '#FFE66D',
      error: '#FF6B6B',
      info: '#48B5FF',
      text: '#F7FFF7',
      dim: '#AAA',
    },
    symbols: {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ',
      pending: '○',
      spinner: ['◐', '◓', '◑', '◒'],
    },
    borders: {
      style: 'round' as const,
      color: '#FF6B6B',
    },
  };

  await demonstrateTheme('Custom (Pink)', customTheme);

  console.log('\n' + '='.repeat(60));
  console.log('  Theme demonstration complete!');
  console.log('='.repeat(60) + '\n');
}

// Run the example
themeExample().catch(console.error);
