export class Library<T extends { id: string }> {
  key: string;
  items: T[] = [];

  constructor(key: string) {
    this.key = key;
  }

  add(item: T) {
    this.items.push(item);
  }

  remove(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }

  find(fn: (item: T)=>boolean) {
    return this.items.find(fn);
  }
}
