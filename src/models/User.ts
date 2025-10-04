export class User {
  id: string;
  name: string;
  borrowed: string[];

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
    this.borrowed = [];
  }
}