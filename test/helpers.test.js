const assert = require('node:assert').strict

/**
 * Generate a random number between two numbers, including min and excluding max
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 */
const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

describe('helper function test', function () {
    it('getRandomInteger should only return numbers between min and not max', function () {
        let i = getRandomInteger(1, 10)

        assert.ok(i >= 1 && i < 10)
    })
})
