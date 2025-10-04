export class Book {
  id: string;
  title: string;
  author: string;
  year: string;
  takenBy: string | null = null;

  constructor(title: string, author: string, year: string) {
    this.id = Date.now().toString();
    this.title = title;
    this.author = author;
    this.year = year;
  }
}