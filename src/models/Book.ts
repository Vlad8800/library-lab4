export interface IBook {
  id: string;
  title: string;
  author: string;
  year: string;
  takenBy: string | null;
}

export class Book implements IBook {
  id: string;
  title: string;
  author: string;
  year: string;
  takenBy: string | null = null;

  constructor(title: string, author: string, year: string) {
    this.id = 'b' + Math.random().toString(36).slice(2,9);
    this.title = title;
    this.author = author;
    this.year = year;
  }
}
