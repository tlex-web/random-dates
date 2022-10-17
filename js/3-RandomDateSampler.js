'use-strict'

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

        if (
            this.getDatesInRange(
                new Date(this._start),
                new Date(this._end),
                this._weekend
            ).length < this._batchSize
        )
            throw new DateError(
                'Extend the time frame or pick a lower sample size',
                [0, 1, 2, 3]
            )
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
        if (typeof start !== 'object') throw new Error('DateType')
        if (typeof end !== 'object') throw new Error('DateType')

        const arr = []

        for (
            let dt = new Date(start);
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

        if (!arr?.length) throw new DateError("Couldn't create batch", 2)

        return arr
    }

    /**
     * Create a batch with randomly selected dates of the size n
     * @param {Date[]} dates
     * @param {Number} n
     * @returns Dates[]
     */
    createRandomSampleBatch = (dates, n) => {
        // const even = len % 2 === 0 ? true : false

        // if (!even) {
        //     const rest = 1

        //     len = len - rest
        // }

        let batch = []
        let seeds = []
        let availableDates = dates.length

        for (let i = 1; i <= availableDates; ++i) {
            const seed = getRandomInteger(0, availableDates)

            // Check if the index of the date has already been picked,
            // since the filtering for dates is a unreliable
            if (!seeds.includes(seed)) batch.push(dates[seed])

            if (batch.length === n) break

            seeds.push(seed)
        }

        if (batch.length !== n)
            throw new DateError(
                'Extend the time frame or pick a lower sample size',
                2
            )

        return batch
    }

    /**
     * Create the output element containing the date batch
     * @returns Object with the HTML elements and the raw dates array
     */
    createOutput = () => {
        let batch = []
        try {
            const dates = this.getDatesInRange(
                new Date(this._start),
                new Date(this._end),
                this._weekend
            )

            batch = this.createRandomSampleBatch(dates, this._batchSize)
        } catch (error) {
            const { message, field } = error

            this._isError = true
            this._errorFields[+field].innerHTML = message
        }

        const output = []

        batch.forEach(date => {
            let reformattedDate = `${date
                .toString()
                .slice(8, 10)}/${monthNumberFromString(
                date.toString().slice(4, 8)
            )}/${date.toString().slice(11, 16)}`

            output.push(`<li>${reformattedDate}</li>`)
        })

        return { html_output: output, dates: batch }
    }
}
