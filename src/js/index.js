// JavaScript driver code to create a random sample batch of dates
// within a range of two dates

'use-strict'

const form = document.querySelector('form')
const outputList = document.querySelector('.output-list')
const copyBtn = document.querySelector('.copy')
const submitBtn = document.querySelector('button')

const outputField = document.querySelectorAll('.hidden')

const errorFields = document.querySelectorAll('.error')

copyBtn.addEventListener('click', async e => {
    e.preventDefault()

    await navigator.clipboard.writeText('ffff')
})

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
    console.log(initialize)

    if (!initialize) return

    const output = randomDate.createOutput()

    if (randomDate.error) location.reload()

    console.log(output)
    if (!randomDate.error || !output?.length) {
        outputField.forEach(field => {
            if (field.classList.contains('hidden'))
                field.classList.remove('hidden')
        })
    }

    outputList.innerHTML = output.join(' ')
})

//history.replaceState(null, '', '../index.html')
