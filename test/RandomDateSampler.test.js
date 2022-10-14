const assert = require('node:assert').strict
const RandomDateSampler = require('../src/js/RandomDateSampler')

const randInt = RandomDateSampler.getRandomInteger
const createRanB = RandomDateSampler.createRandomBatch

describe('integration test', function () {
    it('getRandomInteger should only return numbers between min and not max', function () {
        let i = randInt(1, 10)

        assert.deepStrictEqual(i, 5)
    })

    it('create a batch with random dates with length n', function () {
        let d = [new Date(), new Date(), new Date()]
        let n = 2
        let r = [new Date(), new Date()]

        assert.deepStrictEqual(createRanB(d, n), r)
    })
})
