import { BotClient, ApiResponse } from '../core/client';
import { 
  Message, 
  Update, 
  GetUpdatesParams, 
  WebhookInfo,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove
} from '../types/update';

export interface SendMessageOptions {
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove;
}

export class BotMethods {
  constructor(private readonly client: BotClient) {}

  async getMe() {
    return this.client.callApi<import('../types/update').User>('getMe');
  }

  async sendMessage(chatId: number | string, text: string, options?: SendMessageOptions) {
    return this.client.callApi<Message>('sendMessage', {
      chat_id: chatId,
      text,
      ...options
    });
  }

  async sendPhoto(chatId: number | string, photo: string, options?: { caption?: string; reply_to_message_id?: number; reply_markup?: any }) {
    return this.client.callApi<Message>('sendPhoto', { chat_id: chatId, photo, ...options });
  }

  async sendVideo(chatId: number | string, video: string, options?: { caption?: string; reply_to_message_id?: number; reply_markup?: any }) {
    return this.client.callApi<Message>('sendVideo', { chat_id: chatId, video, ...options });
  }

  async sendDocument(chatId: number | string, document: string, options?: { caption?: string; reply_to_message_id?: number; reply_markup?: any }) {
    return this.client.callApi<Message>('sendDocument', { chat_id: chatId, document, ...options });
  }

  async sendVoice(chatId: number | string, voice: string, options?: { caption?: string; reply_to_message_id?: number; reply_markup?: any }) {
    return this.client.callApi<Message>('sendVoice', { chat_id: chatId, voice, ...options });
  }

  async forwardMessage(chatId: number | string, fromChatId: number | string, messageId: number) {
    return this.client.callApi<Message>('forwardMessage', { chat_id: chatId, from_chat_id: fromChatId, message_id: messageId });
  }

  async copyMessage(chatId: number | string, fromChatId: number | string, messageId: number) {
    return this.client.callApi<{ message_id: number }>('copyMessage', { chat_id: chatId, from_chat_id: fromChatId, message_id: messageId });
  }

  async editMessageText(chatId: number | string, messageId: number, text: string, replyMarkup?: any) {
    return this.client.callApi<Message>('editMessageText', { chat_id: chatId, message_id: messageId, text, reply_markup: replyMarkup });
  }

  async deleteMessage(chatId: number | string, messageId: number) {
    return this.client.callApi<boolean>('deleteMessage', { chat_id: chatId, message_id: messageId });
  }

  async getUpdates(params: GetUpdatesParams = {}) {
    return this.client.callApi<Update[]>('getUpdates', params);
  }

  async setWebhook(url: string) {
    return this.client.callApi<boolean>('setWebhook', { url });
  }

  async deleteWebhook() {
    return this.client.callApi<boolean>('deleteWebhook');
  }

  async getWebhookInfo() {
    return this.client.callApi<WebhookInfo>('getWebhookInfo');
  }

  async answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
    return this.client.callApi<boolean>('answerCallbackQuery', { callback_query_id: callbackQueryId, text, show_alert: showAlert });
  }

  async getChat(chatId: number | string) {
    return this.client.callApi<import('../types/update').ChatFullInfo>('getChat', { chat_id: chatId });
  }

  async pinChatMessage(chatId: number | string, messageId: number) {
    return this.client.callApi<boolean>('pinChatMessage', { chat_id: chatId, message_id: messageId });
  }

  async unpinChatMessage(chatId: number | string, messageId: number) {
    return this.client.callApi<boolean>('unpinChatMessage', { chat_id: chatId, message_id: messageId });
  }

  async sendChatAction(chatId: number | string, action: string) {
    return this.client.callApi<boolean>('sendChatAction', { chat_id: chatId, action });
  }
}