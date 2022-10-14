const assert = require('node:assert').strict

const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

assert.deepStrictEqual(getRandomInteger(1, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9])
