import { replayLog } from '../../dist/index.js';

// 重放日志文件
await replayLog('logs/session-6ddcb09c-e21d-411d-b177-5020c3cfd52f-2025-10-15T02-27-47-432Z.jsonl', {
  theme: 'claude-code',
  showThinking: true,
  showToolDetails: true,
});
