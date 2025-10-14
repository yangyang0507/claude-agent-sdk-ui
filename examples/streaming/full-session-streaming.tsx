/**
 * 完整会话流式测试
 *
 * 测试 StreamingRenderer 的完整会话流式渲染
 */

import type {
  SDKSystemMessage,
  SDKAssistantMessage,
  SDKUserMessage,
  SDKResultMessage,
} from '@anthropic-ai/claude-agent-sdk';
import { StreamingRenderer } from '../../src/renderer/streaming-renderer.js';

// 模拟 System 初始化消息
const mockSystemMessage: SDKSystemMessage = {
  type: 'system',
  subtype: 'init',
  kind: 'system',
  session_id: 'test-session-streaming',
  model: 'claude-sonnet-4',
  cwd: '/Users/test/project',
  permissionMode: 'default',
  tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep'],
};

// 模拟 Assistant 文本消息 1
const mockAssistantTextMessage1: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '你好！我可以帮你**查看文件**、**执行命令**等操作。\n\n让我先看看当前目录有什么文件。',
      },
    ],
    usage: {
      input_tokens: 100,
      output_tokens: 50,
    },
  },
};

// 模拟 Assistant 工具调用消息
const mockAssistantToolMessage: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_123',
        name: 'Glob',
        input: {
          pattern: '*',
          path: '.',
        },
      },
    ],
    usage: {
      input_tokens: 120,
      output_tokens: 30,
    },
  },
};

// 模拟工具结果消息
const mockToolResultMessage: SDKUserMessage = {
  type: 'user',
  message: {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_123',
        content: 'package.json\ntsconfig.json\nsrc/\nexamples/\nREADME.md',
        is_error: false,
      },
    ],
  },
};

// 模拟 Assistant 最终响应
const mockAssistantFinalMessage: SDKAssistantMessage = {
  type: 'assistant',
  message: {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: '当前目录包含以下文件和文件夹：\n\n- `package.json` - 项目配置文件\n- `tsconfig.json` - TypeScript 配置\n- `src/` - 源代码目录\n- `examples/` - 示例代码\n- `README.md` - 项目说明\n\n所有文件都已列出！',
      },
    ],
    usage: {
      input_tokens: 200,
      output_tokens: 100,
    },
  },
};

// 模拟最终结果消息
const mockResultMessage: SDKResultMessage = {
  type: 'result',
  subtype: 'success',
  result: '成功列出了当前目录的所有文件。',
  duration_ms: 2500,
  num_turns: 3,
  total_cost_usd: 0.0025,
  usage: {
    input_tokens: 420,
    output_tokens: 180,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
  },
  permission_denials: [],
};

/**
 * 模拟流式会话
 */
async function runStreamingSession() {
  console.log('🎬 Starting streaming session test...\n');

  const renderer = new StreamingRenderer({
    theme: 'dark',
    streaming: true,
    typingEffect: true,
    typingSpeed: 20,
    showToolDetails: true,
    showTokenUsage: true,
  });

  try {
    // 渲染每条消息，流式组件会自动处理打字机效果
    await renderer.render(mockSystemMessage);
    await renderer.render(mockAssistantTextMessage1);
    await renderer.render(mockAssistantToolMessage);
    await renderer.render(mockToolResultMessage);
    await renderer.render(mockAssistantFinalMessage);
    await renderer.render(mockResultMessage);

    // 等待一下再退出
    setTimeout(() => {
      renderer.cleanup();
      console.log('\n✅ Streaming session test completed!\n');
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error('❌ Test failed:', error);
    renderer.cleanup();
    process.exit(1);
  }
}

// 运行测试
runStreamingSession();
