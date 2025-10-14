import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQuery } from '../../src/index.js';

await renderQuery(query({
  prompt: 'Hello',
  options: {
    maxTurns: 1,
    allowedTools: ['Read'],
  },
}));
