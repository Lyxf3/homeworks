# Задания на тему Promise API

## Вопросы

1. Что выведется в консоль?

  ```js
  new Promise((resolve, reject) => {
    throw new Error('Boom');
    resolve(1);
  }).then(console.log, console.error);
  ```

2. Что выведется в консоль?

  ```js
  new Promise(async (resolve) => {
    await new Promise((resolve, reject) => setTimeout(() => reject('Boom'), 100));
    resolve(1);
  }).then(console.log, console.error);
  ```

3. Что выведется в консоль?

  ```js
  Promise.all([Promise.resolve(1), Promise.reject(2)].keys()).then(console.log, console.error);
  ```

4. Что выведется в консоль?

  ```js
  Promise.all([Promise.resolve(1), Promise.reject(2)])
    .then((values) => values, (err) => err)
    .then(console.log)
    .catch(console.error);
  ```

5. Что выведется в консоль раньше?

  ```js
  setTimeout(() => {
    console.log('foo')
  }, 0);

  Promise.resolve().then(() => console.log('bar'));
  ```

## sleep

> Необходимо написать функцию возвращающую Promise, который зарезолвится через заданное количество миллисекунд.

```js
sleep(200).then(() => {
  console.log('Я проснулся!');
});
```

## rejectAfterSleep

> Необходимо написать функцию возвращающую Promise, который зареджектится через заданное количество миллисекунд. Вторым аргументов функция принимает объект ошибки

```js
rejectAfterSleep(200, 'boom!').catch((err) => {
  console.log(err);
});
```

## timeout

> Необходимо написать функцию, которая принимает объект Promise и некоторое количество миллисекунд и возвращает новый Promise. Если переданный Promise не успевает зарезолвится до истечения этого времени, то результирующий Promise должен быть зареджекчен с ошибкой new Error('Timeout').

```js
timeout(fetch('url'), 500).then(console.log, console.log);
```

## all

> Необходимо написать функцию, которая идентична Promise.all.

## allSettled

> Необходимо написать функцию, которая идентична Promise.allSettled.

## race

> Необходимо написать функцию, которая идентична Promise.race.

## once

> Необходимо написать функцию, которая бы добавлял обработчик события на заданный элемент и возвращала Promise. Promise должен зарезолвится при срабатывании события. В качестве значения Promise должен возвращать объект события.

## promisify

> Необходимо написать функцию, которая бы принимала функцию ожидающую callback и возвращала новую функцию. Новая функция вместо callback должна возвращать Promise. Предполагается, что исходная функция принимает callback последним параметром, т. е. если функция принимает другие аргументы, то они идут ДО callback. Сам callback первым параметром принимает объект ошибки или null, а вторым возвращаемое значение (если нет ошибки).

```js
function openFile(file, cb) {
  fs.readFile(file, cb);
}

const openFilePromise = promisify(openFile);

openFilePromise('foo.txt').then(
  console.log,
  console.error
);
```

## allLimit

> Необходимо написать статический метод для Promise, который бы работал как Promise.all, но с возможностью задания лимита на выполнения "одновременных" задач. В качестве первого параметра, метод должен принимать Iterable объект с функциями, которые возвращают Promise. Сам метод также возвращает Promise.

```js
// Одновременно может быть не более 2-х запросов
allLimit([
  fetch.bind(null, 'url1'),
  fetch.bind(null, 'url2'),
  fetch.bind(null, 'url3'),
  fetch.bind(null, 'url4')
], 2).then(([data1, data2, data3, data4]) => {
  console.log(data1, data2, data3, data4);
})
```

## abortablePromise

> Необходимо написать функцию, которая принимала бы некоторый Promise и экземпляр AbortController и возвращала бы новый. Этот промис можно отменить с помощью использования переданного AbortController. При отмене промис режектится.

```js
var controller = new AbortController();

abortablePromise(myPromise, controller.signal).catch(console.error);

controller.abort();
```

## nonNullable

> Нужно написать функцию, которая принимает функцию и возвращает новую. Новая функция в качестве результата возвращает Promise. Если новой функции передать null в качестве аргументов, то промис должен режектится.

```js
function sum(a, b) {
  return a + b;
}

function prod(a, b) {
  return a * b;
}

const sum2 = nonNullable(sum);
const prod2 = nonNullable(prod);

prod2(10, null).then(sum2).catch(console.error);
```

## syncPromise

> Необходимо написать функцию, которая по своему интерфейсу идентична конструктору Promise, но возвращала бы объект, в котором методы then, catch и finally выполнятся немедленно, если промис уже зарезолвлен. Сементика работы методов в остальном должны быть идентична нативным промисам.

```js
// Порядок в консоли: 1 2
syncPromise((resolve) => resolve(1)).then(console.log);
console.log(2);
```

## SyncPromise

> Необходимо написать класс, который был бы идентичен нативному Promise, но в отличие от него, если Promise уже в статусе resolved или rejected, то then и catch должны выполнятся немедленно, а не отложено. Статически методы resolve, reject, all, race, allSettled также должны быть реализованы.

```js
// Порядок в консоли: 1 2
SyncPromise.resolve(1).then(console.log);
console.log(2);
```

## AbortablePromise

> Необходимо написать класс, который был бы идентичен нативному Promise, но предоставлял возможность "отмены" выполнения. Отмененный Promise должен немедленно перейти в rejected с заданной ошибкой. Статически методы resolve, reject, all, race, allSettled также должны быть реализованы.

```js
const promise = new AbortablePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Все хорошо!');
  }, 300);
});

promise.abort('Умри!');
```

### AbortablePromise с заданным родителем

> Необходимо добавить возможность указать "родительский" Promise при создании нового. Если дочерний Promise будет отменен, то родительский отменяется также. Если родительский отменяется, то отменяются и все потомки. Статические методы также должны поддерживать передачу родителя.

```js
const promise1 = new AbortablePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Все хорошо!');
  }, 300);
});

const promise2 = new AbortablePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Все хорошо!');
  }, 1500);
}, promise1);

promise1.abort('Умри!');
promise2.catch(console.log);
```

## fetchWithRetry

>> Необходимо написать обертку для fetch, с возможностью "перезапроса" в случае неудачи. Функция должна принимать параметр-функцию, которая получает какой по счету перезапрос и возвращать количество мс до следующего перезапроса или false. Если функция вернула false, то Promise запроса режектится с исходной ошибкой.

```js
fetchWithRetry('my-url', {
  retry: (i) => {
    if (i < 5) {
      return i * 1e3;
    }

    return false;
  }
});
```
