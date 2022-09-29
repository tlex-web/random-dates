// JavaScript driver code to create a random sample batch of dates
// within a range of two dates

const form = document.querySelector('form')
const outputList = document.querySelector('.output-list')
const copyBtn = document.querySelector('.copy')
const submitBtn = document.querySelector('button')

const outputField = document.querySelectorAll('.hidden')

copyBtn.addEventListener('click', async e => {
    e.preventDefault()

    await navigator.clipboard.writeText('ffff')
})

submitBtn.addEventListener('click', e => {
    outputField.forEach(field => {
        if (field.classList.contains('hidden')) field.classList.remove('hidden')
    })
})

form.addEventListener('submit', e => {
    e.preventDefault()

    const errorFields = document.querySelectorAll('.error')

    const { startDate, endDate, count, weekend } = e.target

    const start =
        startDate.value.length !== 0
            ? new Date(String(startDate.value))
            : undefined
    const end =
        endDate.value.length !== 0 ? new Date(String(endDate.value)) : undefined
    const n = +count.value
    const excludeWeekend = weekend.checked ? true : false

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

    const dates = getDatesInRange(
        new Date(start),
        new Date(end),
        n,
        excludeWeekend
    )

    const batch = createRandomSampleBatch(dates, n)
    const output = []

    batch.forEach(date => {
        output.push(`<li>${date.toString().slice()}</li>`)
    })

    console.log(output.join(' '))

    outputList.innerHTML = output.join(' ')
})

/**
 * Returns all dates between start and end date
 * @param {Date} start
 * @param {Date} end
 * @param {Boolean} excludeWeekend
 * @returns Date[]
 */
const getDatesInRange = (start, end, excludeWeekend) => {
    if (typeof start !== 'object') throw new Error('DateType')
    if (typeof end !== 'object') throw new Error('DateType')

    const arr = []

    for (
        dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + 1)
    ) {
        if (excludeWeekend) {
            if (
                dt.toString().slice(0, 3) !== 'Sat' &&
                dt.toString().slice(0, 3) !== 'Sun'
            )
                arr.push(new Date(dt))
        } else {
            arr.push(new Date(dt))
        }
    }

    if (!arr?.length) throw new Error("Couldn't create batch")

    return arr
}

/**
 * Create a batch with randomly selected dates of the size n
 * @param {Date[]} dates
 * @param {Number} n
 * @returns Dates[]
 */
const createRandomSampleBatch = (dates, n) => {
    let len = dates.length

    // const even = len % 2 === 0 ? true : false

    // if (!even) {
    //     const rest = 1

    //     len = len - rest
    // }

    let batch = []

    for (let i = 1; i <= n; ++i) {
        const seed = getRandomInteger(0, len)

        batch.push(dates[seed])
    }

    return batch
}

/**
 * Generate a random number between two numbers, including min and excluding amx
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 */
const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}
