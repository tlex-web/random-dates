/**
 * get the number of the month by providing the month as a 3 characters string
 * @param {String} month
 * @returns Number
 */
let monthNumberFromString = month => {
    return new Date(`${month} 01 2000`).toLocaleDateString(`en`, {
        month: `2-digit`,
    })
}

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
