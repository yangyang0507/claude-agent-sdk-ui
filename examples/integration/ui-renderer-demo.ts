/**
 * UI 渲染器集成示例
 *
 * 展示如何使用新的 UI 渲染器渲染 Claude Agent SDK 消息
 */

import {
  createRenderer,
  createStreamingRenderer,
  renderQuery,
  renderQueryStreaming,
} from '../../src/index.js';
import type {
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
} from '@anthropic-ai/claude-agent-sdk';

// 模拟消息数据
const mockSystemMessage: SDKSystemMessage = {
  type: 'system',
  subtype: 'init',
  kind: 'system',
  session_id: 'integration-demo',
  model: 'claude-sonnet-4',
  cwd: '/Users/demo/project',
  permissionMode: 'default',
  tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep'],
};

const mockAssistantMessage: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '你好！我是 Claude，一个 AI 助手。\n\n我可以帮助你：\n- 📝 **读写文件**\n- 💻 **执行命令**\n- 🔍 **搜索代码**\n- ⚙️ **自动化任务**',
      },
    ],
    usage: {
      input_tokens: 100,
      output_tokens: 60,
    },
  },
};

const mockToolMessage: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_001',
        name: 'Read',
        input: {
          file_path: '/Users/demo/project/README.md',
        },
      },
    ],
    usage: {
      input_tokens: 120,
      output_tokens: 30,
    },
  },
};

const mockToolResultMessage: SDKUserMessage = {
  type: 'user',
  message: {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_001',
        content: '# My Project\n\nThis is a demo project for testing UI renderer.',
        is_error: false,
      },
    ],
  },
};

const mockFinalMessage: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '我已经读取了 README.md 文件。这是一个演示项目，用于测试 UI 渲染器。',
      },
    ],
    usage: {
      input_tokens: 200,
      output_tokens: 50,
    },
  },
};

const mockResultMessage: SDKResultMessage = {
  type: 'result',
  subtype: 'success',
  kind: 'result',
  result: '成功完成任务！',
  duration_ms: 1500,
  num_turns: 2,
  total_cost_usd: 0.0015,
  usage: {
    input_tokens: 420,
    output_tokens: 140,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
  },
  permission_denials: [],
};

/**
 * 示例 1: 使用手动渲染器（非流式）
 */
async function demo1_ManualRenderer() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('示例 1: 手动 UI 渲染器（非流式）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const renderer = createRenderer({
    theme: 'dark',
    showTokenUsage: false,
  });

  await renderer.render(mockSystemMessage);
  await renderer.render(mockAssistantMessage);
  await renderer.render(mockToolMessage);
  await renderer.render(mockToolResultMessage);
  await renderer.render(mockFinalMessage);
  await renderer.render(mockResultMessage);

  renderer.cleanup();

  // 等待用户查看
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * 示例 2: 使用流式渲染器（带打字机效果）
 */
async function demo2_StreamingRenderer() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('示例 2: 流式 UI 渲染器（打字机效果）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const renderer = createStreamingRenderer({
    theme: 'dark',
    streaming: true,
    typingEffect: true,
    typingSpeed: 15,
    showTokenUsage: true,
  });

  await renderer.render(mockSystemMessage);
  await renderer.render(mockAssistantMessage);
  await renderer.render(mockToolMessage);
  await renderer.render(mockToolResultMessage);
  await renderer.render(mockFinalMessage);
  await renderer.render(mockResultMessage);

  renderer.cleanup();

  // 等待用户查看
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * 示例 3: 使用便捷 API（模拟 query）
 */
async function demo3_ConvenienceAPI() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('示例 3: 便捷 API（模拟 query）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 模拟一个 async generator
  async function* mockQuery() {
    yield mockSystemMessage;
    yield mockAssistantMessage;
    yield mockToolMessage;
    yield mockToolResultMessage;
    yield mockFinalMessage;
    yield mockResultMessage;
  }

  await renderQuery(mockQuery(), {
    theme: 'dark',
    showTokenUsage: true,
  });

  // 等待用户查看
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

/**
 * 示例 4: 使用流式便捷 API
 */
async function demo4_StreamingConvenienceAPI() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('示例 4: 流式便捷 API（最推荐）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 模拟一个 async generator
  async function* mockQuery() {
    yield mockSystemMessage;
    yield mockAssistantMessage;
    yield mockToolMessage;
    yield mockToolResultMessage;
    yield mockFinalMessage;
    yield mockResultMessage;
  }

  await renderQueryStreaming(mockQuery(), {
    theme: 'dark',
    typingEffect: true,
    typingSpeed: 15,
    showTokenUsage: true,
  });

  console.log('\n✅ 所有示例演示完成！\n');
}

/**
 * 运行所有示例
 */
async function runAllDemos() {
  console.clear();
  console.log('🎬 UI 渲染器集成示例\n');
  console.log('展示如何使用新的 UI 渲染器替代旧版渲染器\n');

  await demo1_ManualRenderer();
  await demo2_StreamingRenderer();
  await demo3_ConvenienceAPI();
  await demo4_StreamingConvenienceAPI();
}

// 运行示例
runAllDemos().catch((error) => {
  console.error('演示出错:', error);
  process.exit(1);
});
