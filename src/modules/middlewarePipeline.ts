import { container } from 'tsyringe';
import { Constructor } from '../modules/types';
import { isClassConstructor } from './guards';

type FunctionMiddleware<T> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>;

abstract class ClassMiddleware<T> {
  abstract executeAsync: FunctionMiddleware<T>;
}

type Middleware<T> = FunctionMiddleware<T> | Constructor<ClassMiddleware<T>>;

class MiddlewarePipeline<T> {
  use = (fn: Middleware<T>) => {
    this.execute = (stack => (c: T, next?: FunctionMiddleware<T>) =>
      stack(c, async () => await this.invokeAsync(fn, c, next)))(this.execute);

    return this;
  };

  execute = async (context: T, next?: () => Promise<void>) => {
    if (next) {
      await next();
    }
  };

  private async invokeAsync(
    fn: Middleware<T>,
    context: T,
    next?: FunctionMiddleware<T>
  ) {
    type ClassHandler = ClassMiddleware<T>;

    const handler = isClassConstructor<ClassHandler>(fn)
      ? container.resolve<ClassHandler>(fn).executeAsync
      : (fn as FunctionMiddleware<T>);

    await handler(context, async () => next && (await next(context, null!)));
  }
}

export { MiddlewarePipeline, ClassMiddleware };
export type { Middleware };
