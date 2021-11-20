"use strict"

function sum(obj, sumOfValues = 0) {
    if (!Object.keys(obj)) {
        return sumOfValues
    }

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            return sum(obj[key], sumOfValues)
        } else {
            sumOfValues += obj[key]
        }
    }

    return sumOfValues
}

console.log(sum({
    a: {
        b: 1,
        c: {
            e: 2,
            d: 10
        }
    }
}))
