import { Observable, interval, of } from 'rxjs';
import { take, map, catchError, switchMap } from 'rxjs/operators';

// Функція для симуляції асинхронного запиту до сервера
function fetchData() {
  return new Observable((observer) => {
    setTimeout(() => {
      // Симулюємо отримання даних від сервера
      observer.next('__data-server fetched__');
      // Після отримання даних завершуємо Observable
      observer.complete();
    }, 2000);
  });
}

const src$ = interval(1000).pipe(
  take(5), // Вибираємо перші 5 значень
  map((value) => `Val: ${value}`), // Трансформація значень
  catchError((error) => of(`Error: ${error}`)) // Обробка помилок
);

const main$ = fetchData().pipe(
  switchMap((data) => {
    console.log('fetchData::', data); // __data-server fetched__
    return src$;
  }) // Перемикаємо до іншого Observable після отримання даних
);

// main$ -> fetchData -> src$
const subscription = main$.subscribe({
  next: (data) => console.log(data),
  error: (error) => console.error(error),
  complete: () => console.log('Complete'),
});
