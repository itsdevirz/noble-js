import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Bot } from './core/bot';
import { PollingManager } from './core/polling';
import { Context } from './types/context';
import { InlineKeyboard } from './utils/keyboard';

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const USE_POLLING = process.env.USE_POLLING === 'true';
const WEBHOOK_PATH = '/bale-webhook';
const PORT = parseInt(process.env.PORT || '3000', 10);

const bot = new Bot(BOT_TOKEN);

const mainMenuKeyboard = () => new InlineKeyboard()
  .text('پروفایل 👤', 'profile')
  .text('تنظیمات ⚙️', 'settings')
  .row()
  .text('راهنما 📚', 'help')
  .text('درباره ℹ️', 'about')
  .row()
  .url('وبسایت 🌐', 'https://bale.ai')
  .build();

bot.command('/start', async (ctx: Context) => {
  await ctx.reply(
    `👋 سلام ${ctx.from?.first_name || 'کاربر'}!\nیکی از گزینه‌ها رو انتخاب کن:`,
    { reply_markup: mainMenuKeyboard() }
  );
});

const callbackHandlers: Record<string, (ctx: Context) => Promise<void>> = {
  profile: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      `👤 پروفایل شما:\nنام: ${ctx.from?.first_name}\nشناسه: ${ctx.userId}`,
      { reply_markup: new InlineKeyboard().text('بازگشت 🔙', 'back_to_main').build() }
    );
  },
  
  settings: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      '⚙️ منوی تنظیمات:',
      {
        reply_markup: new InlineKeyboard()
          .text('تغییر نام ✏️', 'change_name')
          .text('تغییر زبان 🌍', 'change_lang')
          .row()
          .text('بازگشت 🔙', 'back_to_main')
          .build()
      }
    );
  },
  
  help: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      '📚 راهنما:\nبرای استفاده از ربات با پشتیبانی تماس بگیرید.',
      { reply_markup: new InlineKeyboard().text('بازگشت 🔙', 'back_to_main').build() }
    );
  },
  
  about: async (ctx) => {
    await ctx.answerCallbackQuery('نسخه ۱.۰.۰', true);
  },
  
  back_to_main: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      `👋 ${ctx.from?.first_name}! یکی از گزینه‌ها رو انتخاب کن:`,
      { reply_markup: mainMenuKeyboard() }
    );
  },
};

bot.on('callback_query', async (ctx: Context) => {
  const data = ctx.callbackData;
  if (data && callbackHandlers[data]) {
    await callbackHandlers[data](ctx);
  } else {
    await ctx.answerCallbackQuery('گزینه نامعتبر');
  }
});

async function main() {
  if (USE_POLLING) {
    console.log('🤖 Starting bot in POLLING mode...');
    const poller = new PollingManager(bot, { timeout: 30, limit: 100, logUpdates: true });

    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down...');
      poller.stop();
      process.exit(0);
    });

    await poller.start();
  } else {
    console.log('🌐 Starting bot in WEBHOOK mode...');
    const app = new Hono();

    app.post(WEBHOOK_PATH, async (c) => {
      try {
        const update = await c.req.json();
        await bot.handleUpdate(update);
        return c.text('OK', 200);
      } catch (error) {
        console.error('❌ Webhook error:', error);
        return c.text('Error', 200);
      }
    });

    app.get('/health', (c) => c.json({ status: 'ok' }));
    console.log(`🚀 Server running on port ${PORT}`);
    
    serve({
      fetch: app.fetch,
      port: PORT,
    }, (info) => {
      console.log(`✅ Server ready: http://localhost:${info.port}`);
    });
  }
}

main().catch(console.error);