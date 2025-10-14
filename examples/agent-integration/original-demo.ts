import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt: '请帮我分析一下当前目录的文件结构',
  options: {
    maxTurns: 10,
    allowedTools: ['Read', 'Grep'],
  },
})) {
  console.log(JSON.stringify(message, null, 2));
}
