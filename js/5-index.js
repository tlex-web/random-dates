// Import all HTML elements
const form = document.querySelector('form')
const outputList = document.querySelector('.output-list')
const submitBtn = document.querySelector('button[type="submit"]')
const clipboard = document.querySelector('#clipboard')
const txtBtn = document.querySelector('#txtBtn')
const csvBtn = document.querySelector('#csvBtn')
const jsonBtn = document.querySelector('#jsonBtn')
const outputField = document.querySelectorAll('.hidden')
const errorFields = document.querySelectorAll('.error')

form.addEventListener('submit', e => {
    e.preventDefault()

    const { startDate, endDate, batchSize, seed, weekend } = e.target

    const randomDateSampler = new RandomDateSampler(startDate, endDate, batchSize, seed, weekend, errorFields)
    const initialize = randomDateSampler.init()

    // exit event after unsuccessful initialization
    if (!initialize) return

    const { html_output, dates } = randomDateSampler.createOutput()

    //if (randomDateSampler.error) location.reload()

    // show output field
    if (!randomDateSampler.error || !dates?.length) {
        errorFields.forEach(e => (e.innerHTML = ''))
        outputField.forEach(field => {
            if (field.classList.contains('hidden')) field.classList.remove('hidden')
        })
    }

    outputList.innerHTML = html_output.join(' ')

    // reformat the data for export
    const prepDataExport = dates.map(
        e =>
            `${e.toString().slice(8, 10)}/${monthNumberFromString(e.toString().slice(4, 8))}/${e
                .toString()
                .slice(11, 15)}`
    )

    // different export types
    clipboard.addEventListener('click', async e => {
        e.preventDefault()

        await navigator.clipboard.writeText(prepDataExport.join(',').replace(/,/g, ' '))

        clipboard.innerHTML = 'Copied to clipboard'
    })

    txtBtn.addEventListener('click', e => {
        e.preventDefault()

        saveDataAsTXT('random_dates.txt', prepDataExport.join(',').replaceAll(/,/g, ' '))
    })

    csvBtn.addEventListener('click', e => {
        e.preventDefault()

        saveDataAsCSV('random_dates.csv', prepDataExport.join(',').replaceAll(/,/g, ' '))
    })

    jsonBtn.addEventListener('click', e => {
        e.preventDefault()

        saveDataAsJSON('random_dates.json', JSON.stringify({ dates: prepDataExport }))
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
 * Function to export data as a json file in the browser
 * @param {String[]} data
 */
const saveDataAsJSON = (filename, data) => {
    const blob = new Blob([data], {
        type: 'text/json;charset=utf-8',
    })

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
    } else {
        const tmpAnchor = window.document.createElement('a')
        tmpAnchor.href = window.URL.createObjectURL(blob, {
            oneTimeOnly: true,
        })
        tmpAnchor.download = filename
        tmpAnchor.click()
        URL.revokeObjectURL(tmpAnchor.href)
    }
}

// throws unsafe environment errors
//history.replaceState(null, '', '../index.html')
