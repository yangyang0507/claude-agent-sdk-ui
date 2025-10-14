/**
 * 流式渲染演示
 * 展示如何使用流式渲染功能渲染实时消息
 */

import { renderQuery, createRenderer } from '../../src/index.js';
import { query } from '@anthropic-ai/claude-agent-sdk';

async function streamingDemo() {
  console.log('\n=== Claude Agent SDK UI - 流式渲染演示 ===\n');

  // 示例 1: 使用默认渲染器 (自动检测流式消息)
  console.log('📝 示例 1: 简单流式查询\n');

  try {
    await renderQuery(
      query({
        prompt: '写一个关于 TypeScript 的简短介绍,大约 100 字',
        options: {
          includePartialMessages: true, // 启用流式消息
        },
      }),
      {
        theme: 'dark',
        streaming: true, // 启用流式渲染
        showThinking: false,
        showToolDetails: true,
        showToolContent: false,
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // 示例 2: 自定义渲染器配置
  console.log('📝 示例 2: 带工具调用的流式查询\n');

  try {
    const renderer = createRenderer({
      theme: 'dark',
      streaming: true,
      showThinking: true, // 显示思考过程
      showToolDetails: true,
      showToolContent: false,
      maxWidth: 100,
    });

    for await (const message of query({
      prompt: '请列出当前目录的文件',
      options: {
        includePartialMessages: true,
        allowedTools: ['Bash', 'Read'],
      },
    })) {
      await renderer.render(message);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // 示例 3: Light 主题流式渲染
  console.log('📝 示例 3: Light 主题流式渲染\n');

  try {
    await renderQuery(
      query({
        prompt: '解释什么是递归函数',
        options: {
          includePartialMessages: true,
        },
      }),
      {
        theme: 'light',
        streaming: true,
        showThinking: false,
        showToolContent: false,
        compact: true,
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n✅ 流式渲染演示完成!\n');
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  streamingDemo().catch(console.error);
}

export { streamingDemo };
