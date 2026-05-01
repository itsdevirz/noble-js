import { Context, FilterType, Handler, RegisteredHandler } from '../types/context';
import { Update, Message } from '../types/update';
import { BotMethods } from '../methods/message';
import { BotClient } from './client';
import { MiddlewareChain, MiddlewareFunction } from './middleware';

interface CommandHandler {
  pattern: string | RegExp;
  handler: Handler;
}

export class Bot {
  private handlers: RegisteredHandler[] = [];
  private commands: CommandHandler[] = [];
  private middleware: MiddlewareChain;
  public readonly api: BotMethods;

  constructor(token: string) {
    const client = new BotClient(token);
    this.api = new BotMethods(client);
    this.middleware = new MiddlewareChain();
  }

  get bot(): BotMethods {
    return this.api;
  }

  use(fn: MiddlewareFunction): this {
    this.middleware.use(fn);
    return this;
  }

  on(filter: FilterType | FilterType[], handler: Handler): this {
    this.handlers.push({ filter, handler });
    return this;
  }

  onText(handler: Handler): this { return this.on('text', handler); }
  onCallback(handler: Handler): this { return this.on('callback_query', handler); }
  onPhoto(handler: Handler): this { return this.on('photo', handler); }
  onAll(handler: Handler): this { return this.on('*', handler); }

  command(pattern: string | RegExp, handler: Handler): this {
    this.commands.push({ pattern, handler });
    return this;
  }

  async handleUpdate(update: Update): Promise<void> {
    const ctx = new Context(update, this.api);
    await this.handleCommands(ctx);

    for (const { filter, handler } of this.handlers) {
      if (this.matchesFilter(update, filter)) {
        await this.middleware.run(ctx, handler);
      }
    }
  }

  private async handleCommands(ctx: Context): Promise<void> {
    const text = ctx.text;
    if (!text) return;

    for (const { pattern, handler } of this.commands) {
      let matched = false;

      if (typeof pattern === 'string') {
        const cleanPattern = pattern.replace(/\{(\w+)\}/g, '(\\S+)');
        const regex = new RegExp(`^${cleanPattern}$`);
        const match = text.match(regex);
        
        if (match) {
          const paramNames = [...pattern.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
          paramNames.forEach((name, i) => ctx.commandParams[name] = match[i + 1]);
          matched = true;
        }
      } else if (pattern instanceof RegExp) {
        matched = pattern.test(text);
      }

      if (matched) {
        await this.middleware.run(ctx, handler);
      }
    }
  }

  private matchesFilter(update: Update, filter: FilterType | FilterType[]): boolean {
    if (filter === '*') return true;
    if (Array.isArray(filter)) return filter.some(f => this.matchesFilter(update, f));

    const message = update.message || update.edited_message;
    
    switch (filter) {
      case 'callback_query': return !!update.callback_query;
      case 'edited_message': return !!update.edited_message;
      default: return message ? filter in message && (message as any)[filter] !== undefined : false;
    }
  }
}