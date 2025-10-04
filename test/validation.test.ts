import { expect } from 'chai';
import { validateBookForm, validateUserForm } from '../src/utils/validation';

describe('Validation', () => {
  it('should reject empty book fields', () => {
    expect(validateBookForm({ title: '', author: '', year: '' }))
      .to.equal('Усі поля книги обов\'язкові для заповнення.');
  });

  it('should reject non-numeric year', () => {
    expect(validateBookForm({ title: 'A', author: 'B', year: 'abcd' }))
      .to.equal('Рік видання має складатися з 4 цифр.');
  });

  it('should reject invalid user ID', () => {
    expect(validateUserForm({ name: 'Ivan', id: 'abc' }))
      .to.equal('ID користувача має містити лише цифри.');
  });
});