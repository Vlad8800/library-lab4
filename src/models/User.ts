export interface IUser {
  id: string;
  name: string;
  borrowed?: string[];
}

export class User implements IUser {
  id: string;
  name: string;
  borrowed?: string[];

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this.borrowed = [];
  }
}
