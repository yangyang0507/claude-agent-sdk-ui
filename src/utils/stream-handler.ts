/**
 * Stream handler utilities for managing async message streams
 */

export interface StreamBuffer {
  content: string;
  isFlushing: boolean;
}

export class StreamHandler {
  private buffer: StreamBuffer = {
    content: '',
    isFlushing: false,
  };

  private flushInterval: NodeJS.Timeout | null = null;
  private readonly flushDelay: number;

  constructor(flushDelay: number = 100) {
    this.flushDelay = flushDelay;
  }

  /**
   * Add content to the buffer
   */
  add(content: string): void {
    this.buffer.content += content;
    this.scheduleFlush();
  }

  /**
   * Schedule a flush operation
   */
  private scheduleFlush(): void {
    if (this.flushInterval) {
      clearTimeout(this.flushInterval);
    }

    this.flushInterval = setTimeout(() => {
      this.flush();
    }, this.flushDelay);
  }

  /**
   * Flush the buffer and return content
   */
  flush(): string {
    const content = this.buffer.content;
    this.buffer.content = '';
    this.buffer.isFlushing = false;

    if (this.flushInterval) {
      clearTimeout(this.flushInterval);
      this.flushInterval = null;
    }

    return content;
  }

  /**
   * Get current buffer content without flushing
   */
  peek(): string {
    return this.buffer.content;
  }

  /**
   * Check if buffer is empty
   */
  isEmpty(): boolean {
    return this.buffer.content.length === 0;
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.buffer.content = '';
    if (this.flushInterval) {
      clearTimeout(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clear();
  }
}
