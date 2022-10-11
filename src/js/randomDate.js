'use-strict'

class randomDateSampler {
    /**
     * Random date constructor class
     * @param {HTMLInputElement} start
     * @param {HTMLInputElement} end
     * @param {HTMLInputElement} batchSize
     * @param {HTMLInputElement} weekend
     * @param {NodeList} errorFields
     */
    constructor(start, end, batchSize, weekend, errorFields) {
        this._start =
            startDate.value.length !== 0
                ? new Date(String(startDate.value))
                : undefined
        this._end =
            endDate.value.length !== 0
                ? new Date(String(endDate.value))
                : undefined
        this._batchSize = +batchSize.value
        this._weekend = weekend.checked ? true : false
        this._errorFields = errorFields
        this._batch = []
        this._output = []
        this.constructor.init()
    }

    static init = () => {}

    checkInput = () => {
        // check if the dates have been provided
        if (!this._start) this._errorFields[0].innerHTML = 'Provide a date'
        if (!this._end) this._errorFields[1].innerHTML = 'Provide a date'

        // check if the end date is greater than the start date
        if (this._start.valueOf() > this._end.valueOf())
            this._errorFields[2].innerHTML = `${this._end} needs to be greater than ${this._start}`

        // check if the dates have the same value
        if (+this._start === +this._end)
            this._errorFields.forEach(
                el => (el.innerHTML = 'Define a valid range')
            )

        // check if a number is provided
        if (this._batchSize <= 0)
            this._errorFields[2].innerHTML = 'Sample needs to be greater than 0'
    }

    /**
     * Returns all dates between start and end date
     * @param {Date} start
     * @param {Date} end
     * @param {Boolean} excludeWeekend
     * @returns Date[]
     */
    getDatesInRange = (start, end, excludeWeekend) => {
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
    createRandomSampleBatch = (dates, n) => {
        try {
            if (dates.length !== n)
                throw new Error(
                    'Extend the time frame or pick a lower sample size'
                )
        } catch (err) {
            errorFields[2].innerHTML = err
        }

        // const even = len % 2 === 0 ? true : false

        // if (!even) {
        //     const rest = 1

        //     len = len - rest
        // }

        let batch = []
        let seeds = []

        for (let i = 1; i <= n; ++i) {
            const seed = getRandomInteger(0, n)

            // Check if the index of the date has already been picked,
            // since the filtering for dates is a unreliable
            if (!seeds.includes(seed)) batch.push(dates[seed])

            seeds.push(seed)
        }

        if (batch.length !== n)
            errorFields[2].innerHTML =
                'Extend the time frame or pick a lower sample size'

        return batch
    }

    /**
     * Generate a random number between two numbers, including min and excluding max
     * @param {Number} min
     * @param {Number} max
     * @returns Number
     */
    getRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min
    }

    createOutput = () => {
        const dates = getDatesInRange(
            new Date(start),
            new Date(end),
            excludeWeekend
        )
        const batch = createRandomSampleBatch(dates, n)
        const output = []

        batch.forEach(date => {
            output.push(`<li>${date.toString().slice(0, 16)}</li>`)
        })
    }
}
