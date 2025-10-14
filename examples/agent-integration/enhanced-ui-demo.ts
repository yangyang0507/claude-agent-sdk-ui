/**
 * Enhanced UI Demo - 展示所有新的 UI 增强特性
 * 包括：Badge、Box、Divider、Table、Spinner 等组件的集成
 */

import { renderQuery } from '../../src/index.js';
import { query } from '@anthropic-ai/claude-agent-sdk';

async function enhancedUIDemo() {
  console.log('\n🎨 Claude Agent SDK UI - Enhanced UI Demo\n');
  console.log('This demo showcases all the new UI enhancements:');
  console.log('  ✨ Badge components for status indicators');
  console.log('  📦 Box components for content wrapping');
  console.log('  📏 Divider components for visual separation');
  console.log('  📊 Table components for structured data');
  console.log('  ⏳ Spinner components for loading states');
  console.log('');

  try {
    // Example 1: Simple query with enhanced rendering
    console.log('━━━ Example 1: Simple Query with Enhanced UI ━━━\n');
    
    await renderQuery(
      query({
        prompt: 'List the files in the current directory and explain what this project does.',
        options: {
          maxTurns: 5,
          allowedTools: ['Bash', 'Read', 'Glob'],
        },
      }),
      {
        theme: 'dark',
        showTokenUsage: true,
        showToolDetails: true,
        showToolContent: false,
        streaming: false, // 使用标准渲染器查看完整的增强效果
      }
    );

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Example 2: Multiple tool calls
    console.log('━━━ Example 2: Multiple Tool Calls ━━━\n');

    await renderQuery(
      query({
        prompt: 'Read the package.json file and summarize the project dependencies in a table format.',
        options: {
          maxTurns: 5,
          allowedTools: ['Read'],
        },
      }),
      {
        theme: 'dark',
        showTokenUsage: true,
        showToolDetails: true,
        showToolContent: false,
      }
    );

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Example 3: Streaming mode (if supported)
    console.log('━━━ Example 3: Streaming Mode with Enhanced UI ━━━\n');

    await renderQuery(
      query({
        prompt: 'Explain the benefits of TypeScript in 3 short points.',
        options: {
          maxTurns: 2,
          includePartialMessages: true, // Enable streaming
        },
      }),
      {
        theme: 'dark',
        streaming: true, // Enable streaming renderer
        showTokenUsage: true,
        typingEffect: false, // Keep it fast for demo
        showToolContent: false,
      }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('\n✅ Enhanced UI Demo completed successfully!\n');
  console.log('Key improvements demonstrated:');
  console.log('  • Session info wrapped in styled box with badges');
  console.log('  • Tool calls marked with colored badges');
  console.log('  • Tool parameters wrapped in bordered boxes');
  console.log('  • Results displayed with status badges and colored borders');
  console.log('  • Statistics shown in professional tables');
  console.log('  • Visual separators (dividers) between sections');
  console.log('  • Spinners for tool execution progress (in TTY mode)');
  console.log('');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  enhancedUIDemo().catch(console.error);
}

export { enhancedUIDemo };
