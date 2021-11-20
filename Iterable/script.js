"use strict"



function* objToIterator2(obj) {
    yield* obj
}

Array.from(objToIterator2({a: 1, b: 2}))

function* filter2(iter, fn) {
    for (const el of iter) {
        if (fn(el)) {
            yield el
        }
    }
}

console.log(Array.from(filter2(new Set([1, 2, 3, 4]), (el) => el > 2)))

function* map2(iter, fn) {
    for (const el of iter) {
        yield fn(el)
    }
}

console.log(Array.from(map2(new Set([1, 2, 3, 4]), (el) => el * 2)))

function* on(elem, event) {
    let currValue;
    elem.addEventListener(event, (val) => {
        currValue = val
    })

    return new Promise(resolve => {
        resolve(
            {
                done: false,
                value:currValue
            }
        )
    })
}

(async () => {
    for await (const e of on(document, 'click')) {
        console.log(e);
    }
})();

function* enumerate2(iter) {
    let
        index = 0

    for (const el of iter) {
        yield [index, el]
        index++
    }
}

console.log(Array.from(enumerate([1, 2, 3])))

function* take2(iter, n) {
    if (n <= 0) {
        return;
    }
    for (const el of iter) {
        if (n <= 0) {
            return;
        }

        yield el
        n--;
    }
}

console.log(Array.from(take2([1, 2, 3], 2)))

function* repeat2(iter, n) {
    for (let i = 0; i < n; i++) {
        yield* iter
    }
}

console.log(Array.from(repeat2([1, 2, 3], 2)))

function* zip2(...iterables) {
    const iters = iterables.map(x => x[Symbol.iterator]())

    while (true) {
        const ret = new Array();
        for (const iter of iters) {
            const { done, value } = iter.next();
            if (done) {
                return;
            }
            ret.push(value);
        }
        yield ret;
    }
}

console.log(Array.from(zip2([1, 2, 3], [2, 3, 4])))

