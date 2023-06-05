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

/**
 * Fetch public holidays from a public API and return them inside a promise
 * @param {Number} year
 * @returns Promise
 */
const fetchPublicHolidays = async () => {
    const country = 'LU'
    const language = 'EN'
    const start = '2021-01-01'
    const end = '2021-12-31'

    const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${country}&languageIsoCode=${language}&validFrom=${start}&validTo=${end}`

    const res = await fetch(url)
    const data = await res.json()

    let holidays = []

    for (let i = 0; i < data.length; ++i) {
        holidays[i] = new Date(data[i].startDate)
    }

    return holidays
}

describe('helper function test', function () {
    it('getRandomInteger should only return numbers between min and not max', function () {
        let i = getRandomInteger(1, 10)

        assert.ok(i >= 1 && i < 10)
    })
    it('fetch public holidays within the provided parameters as array', async function () {
        const holidays = await fetchPublicHolidays()

        assert.deepEqual(holidays.length, 12)
    })
})
