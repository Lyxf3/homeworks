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

//sleep
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

sleep(200).then(() => {
    console.log('Я проснулся!');
});

//rejectAfterSleep

function rejectAfterSleep(ms, error) {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(error), ms)
    })
}

rejectAfterSleep(200, 'boom!').catch((err) => {
    console.log(err);
});

//timeout

function timeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Timeout')), ms)
        })
    ])
}

timeout(fetch('url'), 500).then(console.log, console.log);

//all
function all(promises) {
    return new Promise((resolve, reject) => {
        resolve(
            Array.from(promises).reduce( (acc, cur) => {
                return acc.then(all => Promise.resolve(cur)
                    .then(promise => [...all, promise])
                    .catch(error => reject(error))
                )
            }, Promise.resolve([]))
        )
    })
}


//allSettled
function allSettled(promises) {
    let result = Array.from(promises).map(p => {
            return Promise.resolve(p)
                .then(val => ({ status: 'fulfilled', value: val }))
                .catch(err => ({ status: 'rejected', reason: err }))
        }
    )
    return all(result)
}

//race
function race(promises) {
    return new Promise((resolve, reject) => {
        Array.from(promises).forEach(e =>
            Promise.resolve(e)
            .then(value => resolve(value))
            .catch(error => reject(error)))
    })
}

//once 
function once(element, event) {
    return new Promise(resolve => {
        element.addEventListener(event, (eventObject) => {
            resolve(eventObject)
        }, {once: true})
    })
}


//promisify
function openFile(file, cb) {
    fs.readFile(file, cb);
}

function promisify(file) {
    return new Promise((resolve, reject) => {
        openFile(file, (err, script) => {
            if (err) reject(err)
            else resolve(script);
        });
    })
}

const openFilePromise = promisify(openFile);

openFilePromise('foo.txt').then(
    console.log,
    console.error
);


//allLimit TODO


//abortablePromise
const controller = new AbortController()

function abortablePromise(promise, controller) {
    const {aborted} = controller
    console.log(aborted)
    if (aborted) {
        return Promise.reject(new Error('AbortError'));
    }
    return new Promise(resolve => {
        resolve(promise)

        controller.addEventListener('abort', () => {
            //Почему тут не работает просто reject ?
            return Promise.reject(Error('AbortError'))
        }, {once: true})
    });
}

abortablePromise(new Promise(resolve =>
    setTimeout(resolve, 2000, "Test")), controller.signal)
    .then(console.log)
    .catch(console.error)

controller.abort()


// //nonNullable
// function nonNullable(func) {
//
// }
//
// function sum(a, b) {
//     return a + b;
// }
//
// function prod(a, b) {
//     return a * b;
// }
//
// const sum2 = nonNullable(sum);
// const prod2 = nonNullable(prod);
//
// prod2(10, null).then(sum2).catch(console.error);