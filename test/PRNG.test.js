const assert = require('node:assert').strict

class PRNG {
    /**
     * Pseudo random number generator
     * @param {Number} seed
     * @returns Instance of PRNG
     * @see https://en.wikipedia.org/wiki/Pseudorandom_number_generator
     */
    constructor(seed) {
        this._seed = seed
        this._modulus = 2147483647
        this._multiplier = 48271
        this._quotient = Math.floor(this._modulus / this._multiplier)
        this._remainder = this._modulus % this._multiplier
    }

    /**
     * Generate a random number between two numbers, including min and excluding max
     * @param {Number} min
     * @param {Number} max
     * @returns Number
     */
    next(min, max) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const product = this._multiplier * this._seed
            const remainder = product % this._modulus

            if (product > this._quotient * this._remainder + remainder) {
                this._seed = remainder - this._modulus + this._remainder
            } else {
                this._seed = remainder
            }

            if (this._seed === this._modulus - 1) {
                return this.next(min, max)
            }

            const result = Math.floor((this._seed / this._modulus) * (max - min + 1) + min)

            return result
        }
    }
}

describe('PRNG test', function () {
    it('PRNG should return a random number between min and max', function () {
        let seed = 111

        const prng = new PRNG(seed)

        let i = prng.next(1, 10)

        assert.ok(i >= 1 && i < 10)
    })
})
