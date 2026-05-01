// src/core/polling.ts

import { Bot } from './bot';
import { Update } from '../types/update';

export interface PollingOptions {
  /** مدت زمان انتظار بین درخواست‌ها (ثانیه) */
  timeout?: number;
  /** حداکثر تعداد آپدیت‌ها در هر درخواست */
  limit?: number;
  /** تاخیر بین درخواست‌ها در صورت خطا (میلی‌ثانیه) */
  retryDelay?: number;
  /** حداکثر تعداد تلاش مجدد در صورت خطا */
  maxRetries?: number;
  /** آیا باید آپدیت‌های پردازش شده لاگ شوند */
  logUpdates?: boolean;
}

export class PollingManager {
  private offset: number = 0;
  private isRunning: boolean = false;
  private retryCount: number = 0;
  
  private readonly options: Required<PollingOptions>;
  
  constructor(
    private readonly bot: Bot, // ✅ همینجا از Bot استفاده میکنیم
    options: PollingOptions = {}
  ) {
    this.options = {
      timeout: options.timeout ?? 30,
      limit: options.limit ?? 100,
      retryDelay: options.retryDelay ?? 5000,
      maxRetries: options.maxRetries ?? 5,
      logUpdates: options.logUpdates ?? true,
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Polling is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Long polling started...');
    
    this.poll();
  }

  stop(): void {
    this.isRunning = false;
    console.log('🛑 Long polling stopped');
  }

  getCurrentOffset(): number {
    return this.offset;
  }

  private async poll(): Promise<void> {
    while (this.isRunning) {
      try {
        // ✅ دسترسی به bot.bot برای گرفتن BotMethods
        const response = await this.bot.bot.getUpdates({
          offset: this.offset,
          limit: this.options.limit,
          timeout: this.options.timeout,
        });

        if (!response.ok) {
          throw new Error(`getUpdates failed: ${response.description}`);
        }

        const updates = response.result || [];
        this.retryCount = 0;

        if (updates.length > 0 && this.options.logUpdates) {
          console.log(`📨 Received ${updates.length} update(s)`);
        }

        for (const update of updates) {
          try {
            // ✅ استفاده از متد handleUpdate خود Bot
            await this.bot.handleUpdate(update);
            this.offset = update.update_id + 1;
          } catch (handlerError) {
            console.error('Error handling update:', update.update_id, handlerError);
            this.offset = update.update_id + 1;
          }
        }

      } catch (error) {
        this.retryCount++;
        console.error(`Polling error (attempt ${this.retryCount}/${this.options.maxRetries}):`, error);

        if (this.retryCount >= this.options.maxRetries) {
          console.error('Max retries reached. Stopping polling...');
          this.stop();
          break;
        }

        console.log(`Waiting ${this.options.retryDelay}ms before retry...`);
        await this.delay(this.options.retryDelay);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}