import { query } from '@anthropic-ai/claude-agent-sdk';
import { renderQueryStreaming } from '../../src/index.js';

await renderQueryStreaming(query({
  prompt: 'Hello',
  options: {
    maxTurns: 1,
    allowedTools: ['Read'],
  },
}));
