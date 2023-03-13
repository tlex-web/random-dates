'use-strict'

class DateError extends Error {
    /**
     * Custom error class for the random date application
     * gets the number of the field where the error occurs
     * to show the message in the frontend
     * @param {String} message
     * @param {Number | Number[]} field
     */
    constructor(message, field) {
        super(message)

        this.field = field
    }
}
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
        this._batchSize =
            +batchSize.value <= 0 ? Math.abs(batchSize.value) : +batchSize.value
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
        let batch = []
        let seeds = []
        let availableDates = dates.length

        while (true) {
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

            batch = this.createRandomSampleBatch(dates, this._batchSize).sort(
                (a, b) => a - b
            )
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

// Import all HTML elements
const form = document.querySelector('form')
const outputList = document.querySelector('.output-list')
const submitBtn = document.querySelector('button[type="submit"]')
const clipboard = document.querySelector('#clipboard')
const txt = document.querySelector('#txt')
const csv = document.querySelector('#csv')
const outputField = document.querySelectorAll('.hidden')
const errorFields = document.querySelectorAll('.error')

form.addEventListener('submit', e => {
    e.preventDefault()

    const { startDate, endDate, batchSize, weekend } = e.target

    const randomDate = new RandomDateSampler(
        startDate,
        endDate,
        batchSize,
        weekend,
        errorFields
    )
    const initialize = randomDate.init()

    // exit event after unsuccessful initialization
    if (!initialize) return

    const { html_output, dates } = randomDate.createOutput()

    if (randomDate.error) location.reload()

    // show output field
    if (!randomDate.error || !dates?.length) {
        outputField.forEach(field => {
            if (field.classList.contains('hidden'))
                field.classList.remove('hidden')
        })
    }

    outputList.innerHTML = html_output.join(' ')

    // reformat the data for export
    const prepDataExport = dates.map(
        e =>
            `${e.toString().slice(8, 10)}/${monthNumberFromString(
                e.toString().slice(4, 8)
            )}/${e.toString().slice(11, 16)}`
    )

    // different export types
    clipboard.addEventListener('click', async e => {
        e.preventDefault()

        await navigator.clipboard.writeText(
            prepDataExport.join(' ,').replaceAll(' ,', '')
        )

        clipboard.innerHTML = 'Copied to clipboard'
    })

    txt.addEventListener('click', async e => {
        e.preventDefault()

        saveDataAsTXT(
            'random_dates.txt',
            prepDataExport.join(' ,').replaceAll(' ,', '')
        )
    })

    csv.addEventListener('click', async e => {
        e.preventDefault()

        saveDataAsCSV(
            'random_dates.csv',
            prepDataExport.join(' ,').replaceAll(' ,', ';')
        )
    })
})

/**
 * Function to export data as a text file in the browser
 * @param {String} filename
 * @param {String[]} data
 */
const saveDataAsTXT = (filename, data) => {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
    } else {
        const tmpAnchor = window.document.createElement('a')
        tmpAnchor.href = window.URL.createObjectURL(blob, { oneTimeOnly: true })
        tmpAnchor.download = filename
        tmpAnchor.click()
        URL.revokeObjectURL(tmpAnchor.href)
    }
}

/**
 * Function to export data as a csv file in the browser
 * @param {String} filename
 * @param {String[]} data
 */
const saveDataAsCSV = (filename, data) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
    } else {
        const tmpAnchor = window.document.createElement('a')
        tmpAnchor.href = window.URL.createObjectURL(blob, { oneTimeOnly: true })
        tmpAnchor.download = filename
        tmpAnchor.click()
        URL.revokeObjectURL(tmpAnchor.href)
    }
}

/**
 * Function to export data as a xlsx file in the browser
 * @param {String[]} data
 */
const saveDataAsXlsx = data => {
    // convert string to array buffer
    const str2ab = str => {
        const buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
        const bufView = new Uint16Array(buf)
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i)
        }
        return buf
    }

    const blob = new Blob([str2ab(b64DecodeUnicode(data))], {
        type: '',
    })

    href = URL.createObjectURL(blob)
}

// throws unsafe environment errors
//history.replaceState(null, '', '../index.html')
