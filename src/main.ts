import './styles.css';
import { Book } from './models/Book';
import { User } from './models/User';
import { Library } from './models/Library';
import { Storage } from './services/Storage';
import { validateBookForm, validateUserForm } from './utils/validation';

const bookLib = new Library<Book>('books');
const userLib = new Library<User>('users');
const storage = new Storage();

// Відновлення LocalStorage
bookLib.items = storage.load<Book[]>('books') || [];
userLib.items = storage.load<User[]>('users') || [];

const alerts = document.getElementById('alerts')!;

function showAlert(msg: string, kind='info') {
  const id = 'a' + Date.now();
  const el = document.createElement('div');
  el.id = id;
  el.className = `toast align-items-center text-bg-${kind} border-0 show mb-2`;
  el.role = 'alert';
  el.innerHTML = '<div class="d-flex"><div class="toast-body">'+msg+'</div><button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button></div>';
  alerts.appendChild(el);
  el.querySelector('button')!.addEventListener('click', ()=> el.remove());
  setTimeout(()=> el.remove(), 5000);
}

function render() {
  const booksList = document.getElementById('books-list')!;
  const usersList = document.getElementById('users-list')!;
  booksList.innerHTML = '';
  usersList.innerHTML = '';

  for (const b of bookLib.items) {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `<div class="card-body">
      <h5 class="card-title">${b.title} <small class="text-muted">(${b.year})</small></h5>
      <p class="card-text">Автор: ${b.author}</p>
      <p>Статус: ${b.takenBy ? 'Позичена' : 'У вільному доступі'}</p>
      <div>
        <button class="btn btn-sm btn-primary borrow-btn" data-id="${b.id}">${b.takenBy ? 'Повернути' : 'Позичити'}</button>
        <button class="btn btn-sm btn-danger ms-2 delete-book" data-id="${b.id}">Видалити</button>
      </div>
    </div>`;
    booksList.appendChild(card);
  }

  for (const u of userLib.items) {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `<div class="card-body">
      <h5 class="card-title">${u.name} <small class="text-muted">ID:${u.id}</small></h5>
      <p>Позичено книг: ${u.borrowed?.length || 0}</p>
      <button class="btn btn-sm btn-danger delete-user" data-id="${u.id}">Видалити</button>
    </div>`;
    usersList.appendChild(card);
  }

  // кнопка "Позичити" / "Повернути"
  document.querySelectorAll('.borrow-btn').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      const book = bookLib.find(b=>b.id===id);
      if (!book) return;

      if (book.takenBy) {
        const user = userLib.find(u=>u.id===book.takenBy);
        if (user) {
          user.borrowed = (user.borrowed||[]).filter(x=>x!==book.id);
          book.takenBy = null;
          storage.save('users', userLib.items);
          storage.save('books', bookLib.items);
          showAlert('Книга повернена', 'success');
          render();
        }
        return;
      }

// Відкриваємо модальне вікно
const modalEl = document.getElementById('borrowModal')!;
const modalInput = document.getElementById('borrowUserId') as HTMLInputElement;
const modal = new window.bootstrap.Modal(modalEl);
modalInput.value = '';
modal.show();

const confirmBtn = document.getElementById('confirmBorrowBtn')!;
const onConfirm = () => {
  const userId = modalInput.value.trim();
  if (!userId) {
    showAlert('Введіть ID користувача', 'warning');
    return;
  }

  const user = userLib.find(u => u.id === userId);
  if (!user) {
    showAlert('Користувача з таким ID не знайдено', 'danger');
    return;
  }

  // ---- 🔧 Виправлений порядок дій ----
  const borrowedCount = (user.borrowed || []).length;
  if (borrowedCount >= 3) {
    showAlert('Користувач вже має 3 книги', 'warning');
    modal.hide();
    confirmBtn.removeEventListener('click', onConfirm);
    return;
  }

  // додаємо книгу після перевірки
  book.takenBy = user.id;
  user.borrowed = [...(user.borrowed || []), book.id];
  storage.save('users', userLib.items);
  storage.save('books', bookLib.items);
  showAlert(`Книга "${book.title}" позичена користувачем ${user.name}`, 'success');

  modal.hide();
  confirmBtn.removeEventListener('click', onConfirm);
  render();
};
confirmBtn.addEventListener('click', onConfirm);

    });
  });

  // видалення книги
  document.querySelectorAll('.delete-book').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      bookLib.remove(id);
      storage.save('books', bookLib.items);
      showAlert('Книга видалена', 'info');
      render();
    });
  });

  // видалення користувача
  document.querySelectorAll('.delete-user').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
      userLib.remove(id);
      storage.save('users', userLib.items);
      showAlert('Користувач видалений', 'info');
      render();
    });
  });
}

// форми додавання
document.getElementById('book-form')!.addEventListener('submit', (e)=>{
  e.preventDefault();
  const title = (document.getElementById('book-title') as HTMLInputElement).value.trim();
  const author = (document.getElementById('book-author') as HTMLInputElement).value.trim();
  const year = (document.getElementById('book-year') as HTMLInputElement).value.trim();
  const err = validateBookForm({title,author,year});
  if (err) { showAlert(err, 'danger'); return; }
  const book = new Book(title, author, year);
  bookLib.add(book);
  storage.save('books', bookLib.items);
  showAlert('Книга додана', 'success');
  (document.getElementById('book-form') as HTMLFormElement).reset();
  render();
});

document.getElementById('user-form')!.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = (document.getElementById('user-name') as HTMLInputElement).value.trim();
  const id = (document.getElementById('user-id') as HTMLInputElement).value.trim();
  const err = validateUserForm({name,id});
  if (err) { showAlert(err, 'danger'); return; }
  const user = new User(name, id);
  userLib.add(user);
  storage.save('users', userLib.items);
  showAlert('Користувач доданий', 'success');
  (document.getElementById('user-form') as HTMLFormElement).reset();
  render();
});

render();
