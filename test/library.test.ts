import { expect } from 'chai';
import { Library } from '../src/models/Library';
import { Book } from '../src/models/Book';

describe('Library class', () => {
  it('should add and find a book', () => {
    const lib = new Library<Book>('books');
    const book = new Book('Title', 'Author', '2020');
    lib.add(book);
    const found = lib.find(b => b.id === book.id);
    expect(found).to.equal(book);
  });

  it('should remove a book', () => {
    const lib = new Library<Book>('books');
    const book = new Book('Title', 'Author', '2020');
    lib.add(book);
    lib.remove(book.id);
    expect(lib.find(b => b.id === book.id)).to.be.undefined;
  });
});