import { Update, Message, CallbackQuery, MessageEntity } from './update';
import { BotMethods, SendMessageOptions } from '../methods/message';

export class Context {
  public commandParams: Record<string, string> = {};

  constructor(
    public readonly update: Update,
    private readonly api: BotMethods
  ) {}

  get message(): Message | undefined { 
    return this.update.message; 
  }
  
  get messageId(): number | undefined { 
    return this.message?.message_id || this.callbackQuery?.message?.message_id;
  }
  
  get text(): string | undefined { 
    return this.message?.text || this.callbackQuery?.message?.text;
  }
  
  get callbackQuery(): CallbackQuery | undefined { 
    return this.update.callback_query; 
  }
  
  get callbackData(): string | undefined { 
    return this.callbackQuery?.data; 
  }
  
  get from() { 
    return this.message?.from || this.callbackQuery?.from; 
  }
  
  get userId(): number | undefined { 
    return this.from?.id; 
  }
  
  get entities(): MessageEntity[] | undefined { 
    return this.message?.entities; 
  }

  get chat() {
    return this.message?.chat || this.callbackQuery?.message?.chat;
  }

  get chatId(): number | undefined {
    return this.chat?.id;
  }

  async reply(text: string, options?: SendMessageOptions) {
    const targetId = this.chatId || this.userId;
    if (!targetId) throw new Error('No chat or user available');
    return this.api.sendMessage(targetId, text, options);
  }

  async replyWithQuote(text: string, options?: SendMessageOptions) {
    const targetId = this.chatId || this.userId;
    if (!targetId) throw new Error('No chat or user available');
    return this.api.sendMessage(targetId, text, { ...options, reply_to_message_id: this.messageId });
  }

  async editMessageText(text: string, options?: { reply_markup?: any }) {
    const targetChatId = this.chatId || this.userId;
    const targetMessageId = this.callbackQuery?.message?.message_id || this.messageId;
    
    if (!targetChatId || !targetMessageId) {
      throw new Error(`Cannot edit: chat=${targetChatId}, message=${targetMessageId}`);
    }
    
    return this.api.editMessageText(targetChatId, targetMessageId, text, options?.reply_markup);
  }

  async answerCallbackQuery(text?: string, showAlert?: boolean) {
    if (!this.callbackQuery) throw new Error('No callback query');
    return this.api.answerCallbackQuery(this.callbackQuery.id, text, showAlert);
  }
}

export type FilterType = 
  | 'text' | 'photo' | 'video' | 'voice' | 'audio' 
  | 'document' | 'animation' | 'sticker' | 'location' 
  | 'contact' | 'callback_query' | 'edited_message' | '*';

export type Handler = (ctx: Context) => Promise<void> | void;

export interface RegisteredHandler {
  filter: FilterType | FilterType[];
  handler: Handler;
}