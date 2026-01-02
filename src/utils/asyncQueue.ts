export type QueueItem<T> = {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export class AsyncQueue<T> {
  private queue: QueueItem<T>[] = [];

  enqueue(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ resolve, reject });
    });
  }

  resolveAll(value: T) {
    this.queue.forEach(({ resolve }) => resolve(value));
    this.clear();
  }

  rejectAll(error: unknown) {
    this.queue.forEach(({ reject }) => reject(error));
    this.clear();
  }

  clear() {
    this.queue = [];
  }

  get size() {
    return this.queue.length;
  }
}
