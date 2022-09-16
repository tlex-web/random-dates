
const form = document.querySelector('form')

form.addEventListener('submit', e => {

    e.preventDefault()

    const {startDate, endDate} = e.target

    if (!startDate || !endDate) throw new Error('Provide a date')

    if (endDate > startDate) throw new Error('The end date needs to be before the start date')

    if (startDate === endDate) throw new Error('You defined no valid range')

    console.log(startDate, endDate)
})