export class Storage {
  save<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  load<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  remove(key: string) {
    localStorage.removeItem(key);
  }
}
