class RandomDateSampler {
    /**
     * Random date constructor class
     * @param {HTMLInputElement} start
     * @param {HTMLInputElement} end
     * @param {HTMLInputElement} batchSize
     * @param {HTMLInputElement} weekend
     * @param {HTMLInputElement} holidays
     * @param {HTMLInputElement} seed
     * @param {NodeList} errorFields
     * @returns RandomDateSampler
     */
    constructor(start, end, batchSize, weekend, holidays, seed, errorFields) {
        this._start = start.value.length !== 0 ? new Date(String(start.value)) : undefined
        this._end = end.value.length !== 0 ? new Date(String(end.value)) : undefined
        this._batchSize = +batchSize.value <= 0 ? Math.abs(batchSize.value) : +batchSize.value
        this._seed = +seed.value <= 0 ? Math.abs(seed.value) : +seed.value
        this._prng = new PRNG(this._seed)
        this._weekend = weekend.checked ? true : false
        this._holidays = holidays.checked ? true : false
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

        if (this._holidays.length > 0) throw new DateError('Holidays are not implemented yet', 4)

        // check if the seed is provided
        if (!this._seed) throw new DateError('Provide a seed number', 5)

        if (this._seed <= 0) throw new DateError('Seed needs to be greater than 0', 5)

        // 4294967295 = 2^32 - 1
        if (this._seed > 4294967295) throw new DateError('Seed needs to be smaller than 4294967295', 5)
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
        return [this._start, this._end, this._seed, this._weekend, this._batchSize, this._errorFields]
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

        return arr
    }

    /**
     * Create a batch with randomly selected dates of the size n
     * @param {Date[]} dates
     * @param {Number} n
     * @returns Dates[]
     */
    createRandomSampleBatch = async (dates, n) => {
        const holidays = await fetchPublicHolidays('LU', reformatDate(this._start), reformatDate(this._end))

        let batch = []
        let seeds = []
        let numDates = dates.length

        for (let i = 0; i < numDates; i++) {
            const seed = this._prng.next(0, numDates - 1)

            // If true, check if the date is a not a holiday
            if (this._holidays) {
                if (!holidays.includes(dates[seed]) && !seeds.includes(seed)) batch.push(dates[seed])
            } else {
                // Check if the index of the date has already been picked,
                // since the filtering for dates is unreliable
                if (!seeds.includes(seed)) batch.push(dates[seed])
            }

            if (batch.length === n) break

            seeds.push(seed)
        }

        if (batch.length !== n) throw new DateError('Extend the time frame or pick a lower sample size', 2)

        return batch
    }

    /**
     * Create the output element containing the date batch
     * @returns Object with the HTML elements and the raw dates array
     */
    createOutput = async () => {
        let batch = []
        try {
            const dates = this.getDatesInRange(new Date(this._start), new Date(this._end), this._weekend)

            batch = await this.createRandomSampleBatch(dates, this._batchSize).sort((a, b) => a - b)
        } catch (error) {
            const { message, field } = error

            this._isError = true

            if (!message || !field) throw new DateError(`${error}`, 2)
            else this._errorFields[+field].innerHTML = message
        }

        const output = []

        batch.forEach(date => output.push(`<li>${reformatDate(date)}</li>`))

        return { html_output: output, dates: batch }
    }
}
