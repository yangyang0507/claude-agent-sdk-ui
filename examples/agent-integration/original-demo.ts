import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt: '当前文件夹有什么文件',
  options: {
    maxTurns: 2
  },
})) {
  console.log(JSON.stringify(message, null, 2));
}
