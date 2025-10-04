export class Storage {
  save<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  load<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}