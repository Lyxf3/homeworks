//1
new Promise((resolve, reject) => {
    throw new Error('Boom');
    resolve(1);
}).then(console.log, console.error);
/*
В консоль выведется console.log(new Error('Boom'))

Потому что
Просмис будет fulfilled и выкидывание ошибки обернеться в
Promise.resolve = Promise.resolve(throw new Error('Boom')).
*/

//2
new Promise(async (resolve) => {
    await new Promise((resolve, reject) => setTimeout(() => reject('Boom'), 100));
    resolve(1);
}).then(console.log, console.error);
/*
В кносоль выведется ошибка

Потому что
Вложенный промис rejected написан через await и не обработан try catch
*/

//3
Promise.all([Promise.resolve(1), Promise.reject(2)].keys()).then(console.log, console.error);
/*
В кносоль выведется console.log([0 ,1])

Потому что
[Promise.resolve(1), Promise.reject(2)].keys() это тоже самое, что и [0 ,1],
поэтму каждый элемент массива обернеться
в Promise.resolve и промис будет fulfilled
*/

//4
Promise.all([Promise.resolve(1), Promise.reject(2)])
    .then((values) => values, (err) => err)
    .then(console.log)
    .catch(console.error);
/*
В кносоль выведется console.error(2)

Потому что
если в Promise.all какой-то промис rejected,
то Promise.all сразу возвращает просим с этой ошибкой
*/

//5
setTimeout(() => {
    console.log('foo')
}, 0);

Promise.resolve().then(() => console.log('bar'));
/*
В кносоль выведется
"bar"
"foo"

Потому что
event loop в стек засунет [Promise, setTimeout] и вроде должен первым выполнить setTimeout,
но setTimeout это макрозадача, а Promise микрозадача. event loop в первую очередь делает все микрозадачи
*/

//Пятое задание очень крутое, я не знал что есть такое разделение :)