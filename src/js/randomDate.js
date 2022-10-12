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
            start.value.length !== 0 ? new Date(String(start.value)) : undefined
        this._end =
            end.value.length !== 0 ? new Date(String(end.value)) : undefined
        this._batchSize = +batchSize.value
        this._weekend = weekend.checked ? true : false
        this._errorFields = errorFields
        this._batch = []
        this._output = []
        this._isError = false
    }

    checkInput = () => {
        // check if the dates have been provided
        if (!this._start) throw new DateError('Provide a date', 0)
        if (!this._end) throw new DateError('Provide a date', 1)

        // check if the end date is greater than the start date
        if (this._start.valueOf() > this._end.valueOf())
            throw new DateError(
                `${this._end
                    .toString()
                    .slice(0, 10)} needs to be greater than ${this._start
                    .toString()
                    .slice(0, 10)}`,
                [0, 1]
            )

        // check if the dates have the same value
        if (+this._start === +this._end)
            throw new DateError('Define a valid range', [0, 1])

        // check if a number is provided
        if (this._batchSize <= 0)
            throw new DateError('Sample needs to be greater than 0', 2)
    }

    init() {
        console.log(1)
        while (true) {
            try {
                this.checkInput()
            } catch (error) {
                const { message, field } = error
                console.log(error)

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

            if (!this._isError) break
        }
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

    /**
     * Create the output element containing the date batch
     * @returns Array of HTML elements
     */
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

        return output
    }
}
