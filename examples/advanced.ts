/**
 * Advanced example - Using AgentRenderer with custom options
 */

import { AgentRenderer, AgentMessage } from '../src/index.js';
import { darkTheme } from '../src/themes/index.js';

async function advancedExample() {
  console.log('=== Advanced Example with Custom Configuration ===\n');

  // Create renderer with custom options
  const renderer = new AgentRenderer({
    theme: darkTheme,
    showTimestamps: true,
    showTokenUsage: true,
    showToolDetails: true,
    codeHighlight: true,
    markdownRendering: true,
    maxWidth: 120,

    // Custom tool renderer
    customRenderers: {
      Read: (data) => {
        return `📖 读取文件: ${data.input.file_path}`;
      },
    },

    // Callbacks
    onToolStart: (tool) => {
      console.log(`[DEBUG] Tool started: ${tool}`);
    },
    onToolEnd: (tool, result) => {
      console.log(`[DEBUG] Tool completed: ${tool}`);
    },
  });

  // Render header
  renderer.renderHeader('🤖 Claude Agent');

  console.log('');

  // User message
  const userMessage: AgentMessage = {
    role: 'user',
    content: '读取 package.json 文件',
    timestamp: Date.now(),
  };

  await renderer.render(userMessage);

  console.log('');

  // Assistant with tool use
  const toolMessage: AgentMessage = {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '好的,我来读取 package.json 文件。',
      },
      {
        type: 'tool_use',
        id: 'tool_read_1',
        name: 'Read',
        input: {
          file_path: './package.json',
        },
      },
    ],
    timestamp: Date.now(),
  };

  await renderer.render(toolMessage);

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Tool result
  const resultMessage: AgentMessage = {
    role: 'assistant',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_read_1',
        output: `{
  "name": "@anthropic-ai/agent-ui",
  "version": "0.1.0",
  "description": "Beautiful CLI UI rendering for Claude Agent SDK"
}`,
      },
    ],
    timestamp: Date.now(),
  };

  await renderer.render(resultMessage);

  console.log('');

  // Response with code block
  const responseMessage: AgentMessage = {
    role: 'assistant',
    content: `
我已经读取了 package.json 文件。这是一个 **Claude Agent UI** 项目:

\`\`\`json
{
  "name": "@anthropic-ai/agent-ui",
  "version": "0.1.0"
}
\`\`\`

主要特点:
- 📦 包名: @anthropic-ai/agent-ui
- 🔖 版本: 0.1.0
- 📝 描述: 为 Claude Agent SDK 提供美观的 CLI UI 渲染

✨ 这是一个高质量的 UI 工具包!
    `,
    timestamp: Date.now(),
  };

  await renderer.render(responseMessage);

  console.log('');

  // Render divider
  renderer.renderDivider();

  // Render footer with stats
  renderer.renderFooter({
    duration: 2300,
    tokens: 1234,
  });
}

// Run the example
advancedExample().catch(console.error);
