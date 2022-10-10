// JavaScript driver code to create a random sample batch of dates
// within a range of two dates

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

submitBtn.addEventListener('click', e => {
    outputField.forEach(field => {
        if (field.classList.contains('hidden')) field.classList.remove('hidden')
    })
})

form.addEventListener('submit', e => {
    e.preventDefault()

    const { startDate, endDate, batchSize, weekend } = e.target

    console.log(startDate, endDate, batchSize, weekend)

    const randomDate = new randomDateSampler(
        startDate,
        endDate,
        batchSize,
        weekend,
        errorFields
    )

    randomDate.checkInput()

    randomDate.createOutput()

    outputList.innerHTML = output.join(' ')
})
