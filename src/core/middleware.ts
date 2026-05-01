import { Context, Handler } from '../types/context';

export type MiddlewareFunction = (ctx: Context, next: () => Promise<void>) => Promise<void> | void;

export function compose(middlewares: MiddlewareFunction[]): MiddlewareFunction {
  return async (ctx, next) => {
    let index = -1;
    
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      
      const middleware = middlewares[i];
      if (!middleware) return next();
      
      await middleware(ctx, () => dispatch(i + 1));
    };
    
    await dispatch(0);
  };
}

export class MiddlewareChain {
  private middlewares: MiddlewareFunction[] = [];

  use(fn: MiddlewareFunction): this {
    this.middlewares.push(fn);
    return this;
  }

  async run(ctx: Context, handler: Handler): Promise<void> {
    if (this.middlewares.length === 0) {
      await handler(ctx);
      return;
    }

    const composed = compose(this.middlewares);
    await composed(ctx, async () => {
      await handler(ctx);
    });
  }
}