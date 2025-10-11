/**
 * Basic example - Simple usage of Claude Agent UI
 */

import { renderAgent, AgentMessage } from '../src/index.js';

async function basicExample() {
  console.log('=== Basic Example ===\n');

  // Example 1: User message
  const userMessage: AgentMessage = {
    role: 'user',
    content: '帮我分析这个 TypeScript 项目',
    timestamp: Date.now(),
  };

  await renderAgent(userMessage);

  console.log('');

  // Example 2: Assistant text response
  const assistantMessage: AgentMessage = {
    role: 'assistant',
    content: '好的,我来帮你分析这个项目。让我先查看项目结构。',
    timestamp: Date.now(),
  };

  await renderAgent(assistantMessage);

  console.log('');

  // Example 3: Tool use
  const toolUseMessage: AgentMessage = {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_1',
        name: 'Glob',
        input: {
          pattern: '**/*.ts',
        },
      },
    ],
    timestamp: Date.now(),
  };

  await renderAgent(toolUseMessage);

  // Simulate tool execution delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Example 4: Tool result
  const toolResultMessage: AgentMessage = {
    role: 'assistant',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_1',
        output: {
          files: ['src/index.ts', 'src/app.ts', 'src/utils/helper.ts'],
          count: 23,
        },
      },
    ],
    timestamp: Date.now(),
  };

  await renderAgent(toolResultMessage);

  console.log('');

  // Example 5: Final response with markdown
  const finalMessage: AgentMessage = {
    role: 'assistant',
    content: `
分析完成!项目结构如下:

**项目统计:**
- 总文件数: 23
- TypeScript 文件: 20
- 测试文件: 3

**主要模块:**
1. \`src/index.ts\` - 主入口
2. \`src/app.ts\` - 应用逻辑
3. \`src/utils/\` - 工具函数

✅ 项目结构清晰,代码组织良好!
    `,
    timestamp: Date.now(),
  };

  await renderAgent(finalMessage);
}

// Run the example
basicExample().catch(console.error);
