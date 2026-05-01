// src/types/update.ts

/** این تایپ‌ها مستقیماً از مستندات API بله استخراج شده‌اند */

// ----- موجودیت‌های اصلی -----
export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }
  
  export interface Chat {
    id: number;
    type: 'private' | 'group' | 'channel';
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  }
  
  // ----- Photo -----
  export interface PhotoSize {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
  }
  
  // ----- Audio -----
  export interface Audio {
    file_id: string;
    file_unique_id: string;
    duration: number;
    title?: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }
  
  // ----- Document -----
  export interface Document {
    file_id: string;
    file_unique_id: string;
    thumbnail?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }
  
  // ----- Video -----
  export interface Video {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    duration: number;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }
  
  // ----- Voice -----
  export interface Voice {
    file_id: string;
    file_unique_id: string;
    duration: number;
    mime_type?: string;
    file_size?: number;
  }
  
  // ----- Animation -----
  export interface Animation {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    duration: number;
    thumbnail?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }
  
  // ----- Sticker -----
  export interface Sticker {
    file_id: string;
    file_unique_id: string;
    type: 'regular' | 'mask';
    width: number;
    height: number;
    file_size?: number;
  }
  
  // ----- Contact -----
  export interface Contact {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
  }
  
  // ----- Location -----
  export interface Location {
    longitude: number;
    latitude: number;
  }
  
  // ----- MessageEntity -----
  export interface MessageEntity {
    type: 'mention' | 'bot_command';
    offset: number;
    length: number;
  }
  
  // ----- InlineKeyboard -----
  export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
  }
  
  export interface InlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: string;
    web_app?: WebAppInfo;
    copy_text?: CopyTextButton;
  }
  
  export interface WebAppInfo {
    url: string;
  }
  
  export interface CopyTextButton {
    text: string;
  }
  
  // ----- ReplyKeyboard -----
  export interface ReplyKeyboardMarkup {
    keyboard: KeyboardButton[][];
  }
  
  export interface KeyboardButton {
    text: string;
    request_contact?: boolean;
    request_location?: boolean;
    web_app?: WebAppInfo;
  }
  
  export interface ReplyKeyboardRemove {
    remove_keyboard: true;
  }
  
  // ----- Invoice & Payment -----
  export interface Invoice {
    title: string;
    description: string;
    total_amount: number;
  }
  
  export interface SuccessfulPayment {
    // فیلدهای payment بر اساس نیاز تکمیل میشن
  }
  
  // ----- WebAppData -----
  export interface WebAppData {
    data: string;
  }
  
  // ----- File -----
  export interface File {
    file_id: string;
    file_unique_id: string;
    file_size?: number;
    file_path?: string;
  }
  
  // ----- Message (کامل) -----
  export interface Message {
    message_id: number;
    from?: User;
    date: number;
    chat: Chat;
    sender_chat?: Chat;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_date?: number;
    reply_to_message?: Message;
    edit_date?: number;
    media_group_id?: string;
    text?: string;
    entities?: MessageEntity[];
    animation?: Animation;
    audio?: Audio;
    document?: Document;
    photo?: PhotoSize[];
    sticker?: Sticker;
    video?: Video;
    voice?: Voice;
    caption?: string;
    caption_entities?: MessageEntity[];
    contact?: Contact;
    location?: Location;
    new_chat_members?: User[];
    left_chat_member?: User;
    invoice?: Invoice;
    successful_payment?: SuccessfulPayment;
    web_app_data?: WebAppData;
    reply_markup?: InlineKeyboardMarkup;
  }
  
  // ----- MessageId -----
  export interface MessageId {
    message_id: number;
  }
  
  // ----- CallbackQuery -----
  export interface CallbackQuery {
    id: string;
    from: User;
    message?: Message;
    data?: string;
  }
  
  // ----- ChatMember -----
  export interface ChatMemberOwner {
    status: 'creator';
    user: User;
  }
  
  export interface ChatMemberAdministrator {
    status: 'administrator';
    user: User;
    can_delete_messages?: boolean;
    can_manage_video_chats?: boolean;
    can_restrict_members?: boolean;
    can_promote_members?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_post_stories?: boolean;
    can_post_messages?: boolean;
    can_edit_messages?: boolean;
    can_pin_messages?: boolean;
  }
  
  export interface ChatMemberMember {
    status: 'member';
    user: User;
  }
  
  export interface ChatMemberRestricted {
    status: 'restricted';
    user: User;
    is_member: boolean;
    can_send_messages?: boolean;
    can_send_audios?: boolean;
    can_send_documents?: boolean;
    can_send_photos?: boolean;
    can_send_videos?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_pin_messages?: boolean;
  }
  
  export type ChatMember = 
    | ChatMemberOwner 
    | ChatMemberAdministrator 
    | ChatMemberMember 
    | ChatMemberRestricted;
  
  // ----- Chat Photo -----
  export interface ChatPhoto {
    small_file_id: string;
    small_file_unique_id: string;
    big_file_id: string;
    big_file_unique_id: string;
  }
  
  // ----- ChatFullInfo -----
  export interface ChatFullInfo {
    id: number;
    type: 'private' | 'group' | 'channel';
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo?: ChatPhoto;
    bio?: string;
    description?: string;
    invite_link?: string;
    linked_chat_id?: string;
  }
  
  // ----- ResponseParameters -----
  export interface ResponseParameters {
    retry_after?: number;
  }
  
  // ----- WebhookInfo -----
  export interface WebhookInfo {
    url: string;
  }
  
  // ----- Update (آپدیت اصلی) -----
  export interface Update {
    update_id: number;
    message?: Message;
    edited_message?: Message;
    callback_query?: CallbackQuery;
    pre_checkout_query?: PreCheckoutQuery;
  }
  
  // ----- PreCheckoutQuery -----
  export interface PreCheckoutQuery {
    id: string;
    from: User;
    // سایر فیلدها بر اساس نیاز
  }
  
  // ----- پارامترهای getUpdates -----
  export interface GetUpdatesParams {
    offset?: number;
    limit?: number;
    timeout?: number;
  }
  
  // ----- InputMedia types -----
  export interface InputMediaPhoto {
    type: 'photo';
    media: string;
    caption?: string;
  }
  
  export interface InputMediaVideo {
    type: 'video';
    media: string;
    thumbnail?: string;
    caption?: string;
    width?: number;
    height?: number;
    duration?: number;
  }
  
  export interface InputMediaAnimation {
    type: 'animation';
    media: string;
    thumbnail?: string;
    caption?: string;
    width?: number;
    height?: number;
    duration?: number;
  }
  
  export interface InputMediaAudio {
    type: 'audio';
    media: string;
    thumbnail?: string;
    caption?: string;
    duration?: number;
    title?: string;
  }
  
  export interface InputMediaDocument {
    type: 'document';
    media: string;
    thumbnail?: string;
    caption?: string;
  }
  
  export type InputMedia = 
    | InputMediaPhoto 
    | InputMediaVideo 
    | InputMediaAnimation 
    | InputMediaAudio 
    | InputMediaDocument;