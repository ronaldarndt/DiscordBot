export type Middleware<T> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>;

class MiddlewarePipeline<T> {
  use = (fn: Middleware<T>) => {
    this.execute = (stack => (c: T, next: Middleware<T>) =>
      stack(c, async () => {
        await fn(c, () => next(c, null));
      }))(this.execute);

    return this;
  };

  execute = async (context: T, next?: () => Promise<void>) => {
    if (next) {
      await next();
    }
  };
}

export { MiddlewarePipeline };
