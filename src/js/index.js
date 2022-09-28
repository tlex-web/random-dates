// JavaScript driver code to create a random sample batch of dates
// within a range of two dates

const form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()

    const errorFields = document.querySelectorAll('.error')

    const { startDate, endDate, count } = e.target

    const start =
        startDate.value.length !== 0
            ? new Date(String(startDate.value))
            : undefined
    const end =
        endDate.value.length !== 0 ? new Date(String(endDate.value)) : undefined
    const n = +count.value

    try {
        // check if the dates have been provided
        if (!start) errorFields[0].innerHTML = 'Provide a date'
        if (!end) errorFields[1].innerHTML = 'Provide a date'

        // check if the end date is greater than the start date
        if (start.valueOf() > end.valueOf())
            errorFields[2].innerHTML = `${end} needs to be greater than ${start}`

        // check if the dates have the same value
        if (+start === +end)
            errorFields.forEach(el => (el.innerHTML = 'Define a valid range'))

        // check if a number is provided
        if (n <= 0)
            errorFields[2].innerHTML = 'Sample needs to be greater than 0'
    } catch (error) {
        console.log('error')
    }

    const dates = getDatesInRange(new Date(start), new Date(end), n)

    console.log(dates)

    const li = `<li>${date}</li>`
})

/**
 * Returns all dates between start and end date
 * @param {Date} start
 * @param {Date} end
 * @param {Number} n
 * @returns Date[]
 */
const getDatesInRange = (start, end, n) => {
    if (typeof start !== 'object') throw new Error('DateType')
    if (typeof end !== 'object') throw new Error('DateType')
    if (typeof n !== 'number') throw new Error('DateType')

    const arr = []

    for (
        dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + 1)
    ) {
        arr.push(new Date(dt))
    }

    if (!arr) throw new Error("Couldn't create batch")

    return arr
}

/**
 * Create a n sized batch with random dates
 * @param {Date[]} dates
 * @param {Number} n
 * @returns Dates[]
 */
const createRandomSampleBatch = (dates, n) => {
    const len = dates.length
    const seed = getRandomInteger(2, len)
    const batch = Array(n)

    const even = len % 2 === 0 ? true : false

    if (!even) {
        const rest = 1
    }

    for (let i = 0; i <= len; ++i) {}

    return batch
}

/**
 * Generate a random number between two numbers, including min and max
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 */
const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
