/**
 * Claude Agent UI - Beautiful CLI UI rendering for Claude Agent SDK
 */

export * from './types.js';
export * from './core/renderer.js';
export * from './components/index.js';
export * from './formatters/index.js';
export * from './themes/index.js';
export * from './utils/index.js';

import { AgentRenderer } from './core/renderer.js';
import type { AgentMessage, RenderOptions } from './types.js';

/**
 * Simple render function for quick usage
 */
export async function renderAgent(
  message: AgentMessage,
  options: RenderOptions = {}
): Promise<void> {
  const renderer = new AgentRenderer(options);
  await renderer.render(message);
}

/**
 * Default export
 */
export default {
  AgentRenderer,
  renderAgent,
};
