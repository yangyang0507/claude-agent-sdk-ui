#!/usr/bin/env node

/**
 * CLI 工具：日志重放
 *
 * 用法：
 *   npm run replay -- <log-file> [options]
 *   或安装后：claude-agent-ui-replay <log-file> [options]
 *
 * 选项：
 *   --theme <name>          主题名称 (claude-code, droid)
 *   --speed <number>        播放速度倍数 (默认: 1)
 *   --realtime              按原始时间间隔重放
 *   --streaming             使用流式渲染器
 *   --show-thinking         显示思考内容
 *   --show-tool-details     显示工具详情
 *   --filter-stream-events  过滤 stream_event 消息
 *   --fixed-delay <ms>      消息之间的固定延迟（毫秒）
 *   --help, -h              显示帮助信息
 */

import { replayLog } from '../dist/index.js';
import type { ReplayOptions } from '../dist/index.js';

function showHelp() {
  console.log(`
日志重放工具 - Claude Agent SDK UI

用法:
  npm run replay -- <log-file> [options]

参数:
  <log-file>              要重放的日志文件路径（必需）

选项:
  --theme <name>          设置主题 (claude-code, droid)
                          默认: claude-code

  --speed <number>        播放速度倍数（仅在 realtime 模式下有效）
                          默认: 1

  --realtime              启用实时模式，按原始时间间隔重放
                          默认: 禁用

  --streaming             使用流式渲染器（带打字效果）
                          默认: 禁用

  --show-thinking         显示 AI 的思考过程
                          默认: 禁用

  --show-tool-details     显示工具调用的详细信息
                          默认: 禁用

  --filter-stream-events  过滤掉 stream_event 类型的消息
                          默认: 禁用

  --fixed-delay <ms>      设置消息之间的固定延迟（毫秒）
                          默认: 0

  --help, -h              显示此帮助信息

示例:
  # 基本用法
  npm run replay -- logs/session-xxx.jsonl

  # 使用自定义主题和显示思考内容
  npm run replay -- logs/session-xxx.jsonl --theme droid --show-thinking

  # 实时模式，2倍速播放
  npm run replay -- logs/session-xxx.jsonl --realtime --speed 2

  # 流式渲染，显示所有详情
  npm run replay -- logs/session-xxx.jsonl --streaming --show-thinking --show-tool-details

  # 固定延迟模式，每条消息间隔 500ms
  npm run replay -- logs/session-xxx.jsonl --fixed-delay 500
`);
}

function parseArgs(): { logFile: string; options: ReplayOptions } | null {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return null;
  }

  const logFile = args[0];
  if (!logFile || logFile.startsWith('--')) {
    console.error('错误: 请提供日志文件路径');
    console.error('使用 --help 查看帮助信息');
    process.exit(1);
  }

  const options: ReplayOptions = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--theme':
        options.theme = args[++i] as 'claude-code' | 'droid';
        break;
      case '--speed':
        options.speed = parseFloat(args[++i]);
        break;
      case '--realtime':
        options.realtime = true;
        break;
      case '--streaming':
        options.streaming = true;
        break;
      case '--show-thinking':
        options.showThinking = true;
        break;
      case '--show-tool-details':
        options.showToolDetails = true;
        break;
      case '--filter-stream-events':
        options.filterStreamEvents = true;
        break;
      case '--fixed-delay':
        options.fixedDelay = parseInt(args[++i], 10);
        break;
      default:
        console.warn(`警告: 未知选项 ${arg}`);
    }
  }

  return { logFile, options };
}

async function main() {
  const parsed = parseArgs();
  if (!parsed) {
    process.exit(0);
  }

  const { logFile, options } = parsed;

  console.log(`\n📼 开始重放日志: ${logFile}\n`);
  if (Object.keys(options).length > 0) {
    console.log('配置选项:');
    console.log(JSON.stringify(options, null, 2));
    console.log();
  }

  try {
    await replayLog(logFile, options);
    console.log('\n✅ 重放完成！\n');
  } catch (error) {
    console.error('\n❌ 重放失败:');
    console.error(error);
    process.exit(1);
  }
}

main();
