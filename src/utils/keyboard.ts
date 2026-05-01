import { InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton } from '../types/update';

export class InlineKeyboard {
  private keyboard: InlineKeyboardButton[][] = [[]];

  text(text: string, callbackData: string): this {
    this.keyboard[this.keyboard.length - 1].push({ text, callback_data: callbackData });
    return this;
  }

  url(text: string, url: string): this {
    this.keyboard[this.keyboard.length - 1].push({ text, url });
    return this;
  }

  row(): this {
    this.keyboard.push([]);
    return this;
  }

  build(): InlineKeyboardMarkup {
    return { inline_keyboard: this.keyboard.filter(row => row.length > 0) };
  }
}

export class ReplyKeyboard {
  private keyboard: KeyboardButton[][] = [[]];

  text(text: string): this {
    this.keyboard[this.keyboard.length - 1].push({ text });
    return this;
  }

  contact(text: string): this {
    this.keyboard[this.keyboard.length - 1].push({ text, request_contact: true });
    return this;
  }

  location(text: string): this {
    this.keyboard[this.keyboard.length - 1].push({ text, request_location: true });
    return this;
  }

  row(): this {
    this.keyboard.push([]);
    return this;
  }

  build(): ReplyKeyboardMarkup {
    return { keyboard: this.keyboard.filter(row => row.length > 0) };
  }
}