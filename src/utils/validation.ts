export function validateBookForm(data: { title: string; author: string; year: string }): string {
  if (!data.title || !data.author || !data.year) {
    return 'Усі поля книги обов\'язкові для заповнення.';
  }
  const currentYear = new Date().getFullYear();
  if (!/^\d{4}$/.test(data.year)) {
    return 'Рік видання має складатися з 4 цифр.';
  }
  const yearNum = parseInt(data.year, 10);
  if (yearNum < 1500 || yearNum > currentYear) {
    return `Рік видання має бути в межах 1500–${currentYear}.`;
  }
  return '';
}

export function validateUserForm(data: { name: string; id: string }): string {
  if (!data.name || !data.id) {
    return 'Усі поля користувача обов\'язкові для заповнення.';
  }
  if (!/^\d+$/.test(data.id)) {
    return 'ID користувача має містити лише цифри.';
  }
  if (data.id.length < 3 || data.id.length > 10) {
    return 'ID користувача має містити від 3 до 10 цифр.';
  }
  return '';
}