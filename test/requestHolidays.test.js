const assert = require('node:assert').strict

class RandomDateSampler {
    /**
     * Random date constructor class
     * @param {HTMLInputElement} start
     * @param {HTMLInputElement} end
     * @param {HTMLInputElement} batchSize
     * @param {HTMLInputElement} weekend
     * @param {NodeList} errorFields
     */
    constructor(start, end, batchSize, weekend, errorFields) {
        this._start = start.value.length !== 0 ? new Date(String(start.value)) : undefined
        this._end = end.value.length !== 0 ? new Date(String(end.value)) : undefined
        this._batchSize = +batchSize.value <= 0 ? Math.abs(batchSize.value) : +batchSize.value
        this._weekend = weekend.checked ? true : false
        this._errorFields = errorFields
        this._batch = []
        this._holidays = []
        this._output = []
        this._isError = false
    }

    get error() {
        return this._isError
    }

    checkInput = () => {
        // check if the dates have been provided
        if (!this._start) throw new DateError('Provide a date', 0)
        if (!this._end) throw new DateError('Provide a date', 1)

        // check if the end date is greater than the start date
        if (this._start.valueOf() > this._end.valueOf())
            throw new DateError(
                `${this._end.toString().slice(0, 10)} needs to be greater than ${this._start.toString().slice(0, 10)}`,
                [0, 1]
            )

        // check if the dates have the same value
        if (+this._start === +this._end) throw new DateError('Define a valid range', [0, 1])

        // check if a number is provided
        if (this._batchSize <= 0) throw new DateError('Sample needs to be greater than 0', 2)

        if (this.getDatesInRange(new Date(this._start), new Date(this._end), this._weekend).length < this._batchSize)
            throw new DateError('Extend the time frame or pick a lower sample size', [0, 1, 2, 3])
    }

    init() {
        try {
            this.checkInput()
            this._isError = false
        } catch (error) {
            const { message, field } = error

            if (typeof field === 'object') {
                this._isError = true

                field.forEach(e => {
                    this._errorFields[+e].innerHTML = message
                })
            } else {
                this._isError = true
                const n = +field

                this._errorFields[n].innerHTML = message
            }
        }
        if (this._isError) return false
        else return true
    }

    print() {
        return [this._start, this._end, this._weekend, this._batchSize]
    }

    /**
     * Returns all dates between start and end date
     * @param {Date} start
     * @param {Date} end
     * @param {Boolean} excludeWeekend
     * @returns Date[]
     */
    getDatesInRange = (start, end, excludeWeekend) => {
        if (typeof start !== 'object') throw new DateError('DateType', 1)
        if (typeof end !== 'object') throw new DateError('DateType', 2)

        const arr = []

        for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            if (excludeWeekend) {
                if (dt.toString().slice(0, 3) !== 'Sat' && dt.toString().slice(0, 3) !== 'Sun') arr.push(new Date(dt))
            } else {
                arr.push(new Date(dt))
            }

            if (!arr?.length) throw new DateError("Couldn't create batch", 2)
        }
        // Filter out public holidays
        let filteredDates = []

        this.fetchPublicHolidays().then(holidays => {
            for (let date of arr) {
                for (let holiday of holidays) {
                    if (date.valueOf() !== holiday.valueOf() && !filteredDates.includes(date)) {
                        filteredDates.push(date)

                        console.log(filteredDates)
                    }
                }
            }
        })

        console.log(filteredDates)

        this._holidays = filteredDates
    }

    /**
     * Create a batch with randomly selected dates of the size n
     * @param {Date[]} dates
     * @param {Number} n
     * @returns Dates[]
     */
    createRandomSampleBatch = (dates, n) => {
        let batch = []
        let seeds = []
        let numDates = dates.length

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const seed = getRandomInteger(0, numDates)

            // Check if the index of the date has already been picked,
            // since the filtering for dates is a unreliable
            if (!seeds.includes(seed)) batch.push(dates[seed])

            if (batch.length === n) break

            seeds.push(seed)
        }

        if (batch.length !== n) throw new DateError('Extend the time frame or pick a lower sample size', 2)

        return batch
    }

    /**
     * Fetch public holidays from a public API and return them inside a promise
     * @param {Number} year
     * @returns Promise
     */
    fetchPublicHolidays = async year => {
        const currentYear = new Date(year).getFullYear()

        const url = `https://date.nager.at/api/v2/publicholidays/${String(currentYear)}/LU`

        const res = await fetch(url)
        const data = await res.json()

        let holidays = []

        for (let i = 0; i < data.length; ++i) {
            holidays[i] = new Date(data[i].date)
        }

        return holidays
    }

    /**
     * Create the output element containing the date batch
     * @returns Object with the HTML elements and the raw dates array
     */
    createOutput = () => {
        let batch = []
        try {
            const dates = this.getDatesInRange(new Date(this._start), new Date(this._end), this._weekend)

            batch = this.createRandomSampleBatch(dates, this._batchSize).sort((a, b) => a - b)
        } catch (error) {
            const { message, field } = error

            this._isError = true
            this._errorFields[+field].innerHTML = message
        }

        const output = []

        batch.forEach(date => {
            let reformattedDate = `${date.toString().slice(8, 10)}/${monthNumberFromString(
                date.toString().slice(4, 8)
            )}/${date.toString().slice(11, 16)}`

            output.push(`<li>${reformattedDate}</li>`)
        })

        return { html_output: output, dates: batch }
    }
}

describe('RandomDateSampler', function () {
    it('should throw an error if no start date is provided', function () {
        const start = { value: '2023-01-01' }
        const end = { value: '2023-01-10' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Provide a date',
                field: 0,
            }
        )
    })

    it('should throw an error if no end date is provided', function () {
        const start = { value: '2023-01-01' }
        const end = { value: '2023-01-10' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Provide a date',
                field: 1,
            }
        )
    })

    it('should throw an error if the start date is greater than the end date', function () {
        const start = { value: '2021-01-02' }
        const end = { value: '2021-01-01' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: '2021-01-01 needs to be greater than 2021-01-02',
                field: [0, 1],
            }
        )
    })

    it('should throw an error if the start date and end date are equal', function () {
        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-01' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Define a valid range',
                field: [0, 1],
            }
        )
    })
    it('should throw an error if the batch size is less than 1', function () {
        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 0 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Sample needs to be greater than 0',
                field: 2,
            }
        )
    })
    it('should throw an error if the batch size is greater than the range', function () {
        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 3 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Sample needs to be less than 2',
                field: 2,
            }
        )
    })
    it('should throw an error if the batch size is not an integer', function () {
        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 1.5 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: 'Sample needs to be an integer',
                field: 2,
            }
        )
    })
    it('should throw an error if the start date is not a valid date', function () {
        const start = { value: '2021-01-32' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        assert.throws(
            () => {
                randomDateSampler.checkInput()
            },
            {
                name: 'DateError',
                message: '2021-01-32 is not a valid date',
                field: 0,
            }
        )
    })
    it('should return an array of dates', function () {
        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        const result = randomDateSampler.checkInput()
        assert.equal(result.length, 1)
    })
    it('should return an array of dates from a API call', async function () {
        const year = 2021

        const start = { value: '2021-01-01' }
        const end = { value: '2021-01-02' }
        const batchSize = { value: 1 }
        const weekend = { checked: false }
        const errorFields = [{ innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }, { innerHTML: '' }]

        const randomDateSampler = new RandomDateSampler(start, end, batchSize, weekend, errorFields)

        const dates = await randomDateSampler.fetchPublicHolidays(year)

        assert.deepEqual(dates.length, 12)
    })
})
