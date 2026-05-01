export interface SessionData {
    [key: string]: any;
  }
  
  export class SessionManager<T extends SessionData = SessionData> {
    private storage = new Map<number, T>();
    private defaults: () => T;
  
    constructor(defaults?: () => T) {
      this.defaults = defaults || (() => ({} as T));
    }
  
    get(userId: number): T {
      if (!this.storage.has(userId)) {
        this.storage.set(userId, this.defaults());
      }
      return this.storage.get(userId)!;
    }
  
    set(userId: number, data: Partial<T>): void {
      const current = this.get(userId);
      this.storage.set(userId, { ...current, ...data });
    }
  
    delete(userId: number): void {
      this.storage.delete(userId);
    }
  
    clear(): void {
      this.storage.clear();
    }
  }