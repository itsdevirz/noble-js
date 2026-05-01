// src/core/client.ts

// تعریف ساختار استاندارد پاسخ‌های API بله
export interface ApiResponse<T> {
    ok: boolean;
    result?: T;
    description?: string;
    error_code?: number;
  }
  
  export class BotClient {
    private readonly baseUrl: string;
  
    constructor(
      private readonly token: string,
      // Fetcher می‌تواند fetch پیش‌فرض یا نمونه Hono باشد
      private readonly fetcher: typeof fetch = fetch
    ) {
      this.baseUrl = `https://tapi.bale.ai/bot${this.token}`;
    }
  
    /**
     * یک تابع کمکی برای فراخوانی متدهای API.
     * @param method - اسم متد (مثال 'sendMessage')
     * @param body - بدنه JSON درخواست (اختیاری)
     * @returns پاسخ API که در یک شیء JSON با ساختار ApiResponse<T> قرار دارد.
     */
    async callApi<T>(method: string, body?: Record<string, any>): Promise<ApiResponse<T>> {
      const url = `${this.baseUrl}/${method}`;
  
      try {
        const response = await this.fetcher(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });
  
        if (!response.ok) {
          // مدیریت خطاهای HTTP
          console.error(`HTTP Error: ${response.status} ${await response.text()}`);
          return { ok: false, description: `HTTP Error: ${response.status}` };
        }
  
        const data = await response.json() as ApiResponse<T>;
        return data;
      } catch (error) {
        console.error(`Network or parsing error for method ${method}:`, error);
        return { ok: false, description: 'Network or parsing error' };
      }
    }
  }