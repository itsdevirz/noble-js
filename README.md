# Noble.JS 🎯

فریم‌ورک سبک و سریع برای ساخت ربات بله با Node.js و Hono

## ✨ قابلیت‌ها

- 🚀 مبتنی بر Hono - سریع و مدرن
- 🎣 پشتیبانی از Webhook و Long Polling
- 🎯 سیستم فیلترگذاری پیشرفته (text, photo, video...)
- ⌨️ کیبوردهای اینلاین و Reply
- ⚡ سیستم Command با Regex
- 🔄 مدیریت آپدیت‌های تکراری
- 📦 کمک حجم، بدون وابستگی اضافه

## 📦 نصب

```bash
npm install noble-js
```

## 🚀 راه‌اندازی سریع:

```typescript
import { Bot, Context, InlineKeyboard } from 'noble-js';

const bot = new Bot('YOUR_BOT_TOKEN');

bot.command('/start', async (ctx: Context) => {
  await ctx.reply(`سلام ${ctx.from?.first_name}! 👋`);
});

bot.startPolling();
```

## 📚 مثال‌های استفاده:

دریافت پیام متنی:
```typescript
bot.on('text', async (ctx: Context) => {
  await ctx.reply(`گفتی: ${ctx.text}`);
});
```
فیلتر انواع پیام
```typescript
bot.on('photo', async (ctx: Context) => {
  await ctx.reply('📸 عکس قشنگیه!');
});

bot.on(['video', 'animation'], async (ctx: Context) => {
  await ctx.reply('🎬 ویدیو یا گیف دریافت شد');
});
```
دکمه‌های شیشه‌ای (Inline)
```typescript
bot.command('/menu', async (ctx: Context) => {
  const keyboard = new InlineKeyboard()
    .text('پروفایل 👤', 'profile')
    .text('تنظیمات ⚙️', 'settings')
    .build();

  await ctx.reply('یک گزینه انتخاب کن:', { reply_markup: keyboard });
});

bot.on('callback_query', async (ctx: Context) => {
  if (ctx.callbackData === 'profile') {
    await ctx.answerCallbackQuery('پروفایل شما');
  }
});
```
دستورات با پارامتر
```typescript
bot.command('/echo {text}', async (ctx: Context) => {
  await ctx.reply(ctx.commandParams.text);
});

bot.command(/\/ban (\d+)/, async (ctx: Context) => {
  const userId = ctx.text?.match(/\/ban (\d+)/)?.[1];
  await ctx.reply(`کاربر ${userId} بن شد`);
});
```
Middleware
```typescript
bot.use(async (ctx, next) => {
  console.log(`درخواست از ${ctx.from?.first_name}`);
  await next();
});
```
🌐 وب‌هوک
```typescript
import { Bot, Hono, serve } from 'noble-js';

const bot = new Bot('TOKEN');
const app = new Hono();

app.post('/webhook', async (c) => {
  const update = await c.req.json();
  await bot.handleUpdate(update);
  return c.text('OK');
});

serve({ fetch: app.fetch, port: 3000 });
```
