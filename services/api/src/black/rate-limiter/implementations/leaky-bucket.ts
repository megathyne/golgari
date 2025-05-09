export class LeakyBucket {
  private capacity: number;
  private intervalMs: number;
  private queue: (() => void)[];
  private timer: NodeJS.Timeout | null;

  constructor(capacity: number, intervalMs: number) {
    this.capacity = capacity; // Max number of requests in the bucket
    this.intervalMs = intervalMs; // Leak interval (ms)
    this.queue = [];
    this.timer = null;
  }

  add(task: () => void): boolean {
    if (this.queue.length >= this.capacity) {
      // Bucket is full; Reject the task
      return false;
    }
    this.queue.push(task);
    if (!this.timer) {
      this.start();
    }
    return true;
  }

  private start(): void {
    this.timer = setInterval(() => this.leak(), this.intervalMs);
  }

  private leak(): void {
    const task = this.queue.shift();
    if (task) {
      task();
    }
    if (this.queue.length === 0 && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
