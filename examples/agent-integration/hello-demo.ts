import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from '../../src/index.js';

await renderQuery(
  query({
    prompt: '当前文件夹有什么',
    options: {
      maxTurns: 2,
      // allowedTools: ['Read'],
    },
  }),
  {
    theme: 'droid',
    logging: {
      enabled: true
    }
  }
);
