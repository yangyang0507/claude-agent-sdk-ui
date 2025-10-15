/**
 * 简单流式渲染示例
 * 最简单的流式渲染使用方式
 */

import { renderQuery } from '../../src/index.js';
import { query } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  console.log('\n🚀 流式渲染简单示例\n');
  console.log('输入查询: "当前文件夹有什么文件"\n');

  // 🎉 超级简洁!一行代码搞定流式渲染
  await renderQuery(
    query({
      prompt: '当前文件夹有什么文件',
      options: {
        maxTurns: 2, // 最多 2 轮对话
        includePartialMessages: true, // 启用流式消息
      },
    }),
    {
      logging: {
        enabled: true
      }
    }
  );

  console.log('\n✅ 完成!\n');
}

main().catch(console.error);
