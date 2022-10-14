'use-strict'

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
    const prepDataExport = dates.map(e => e.toString().slice(0, 16))

    // different export types
    clipboard.addEventListener('click', async e => {
        e.preventDefault()

        await navigator.clipboard.writeText(prepDataExport)

        clipboard.innerHTML = 'Copied to clipboard'
    })

    txt.addEventListener('click', async e => {
        e.preventDefault()

        saveDataAsTXT('random_dates.txt', prepDataExport)
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

// under development
const saveDataAsXlsx = data => {
    function s2ab(s) {
        const buffer = new ArrayBuffer(s.length)
        const view = new Uint8Array(buffer)
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buffer
    }
    const blob = new Blob([s2ab(atob(data))], {
        type: '',
    })

    href = URL.createObjectURL(blob)
}

// throws unsafe environment errors
//history.replaceState(null, '', '../index.html')
