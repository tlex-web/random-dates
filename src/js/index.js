const form = document.querySelector('form')

form.addEventListener('submit', e => {

  e.preventDefault()

  const errorFields = document.querySelectorAll('.error')

  const { startDate, endDate, count } = e.target

  const start = startDate.value.length !== 0 ? new Date(String(startDate.value)) : null
  const end = endDate.value.length !== 0 ? new Date(String(endDate.value)) : null
  const n = +count.value

  // check if the dates have been provided
  if (!start) errorFields[0].innerHTML = 'Provide a date'
  if (!end) errorFields[1].innerHTML = 'Provide a date'

  // check if the end date is greater than the start date
  if (start.valueOf() > end.valueOf()) errorFields[2].innerHTML = `${end} needs to be greater than ${start}`

  // check if the dates have the same value
  if (+start === +end) errorFields.forEach(el => el.innerHTML = 'Define a valid range')

  // check if n > 0
  if (n <= 0) errorFields[2].innerHTML = 'Sample needs to be greater than 0'

})


const getDatesinRange = (start, end, n) => {

  if (typeof (start) !== 'object') throw new Error('DateType')
  if (typeof (end) !== 'object') throw new Error('DateType')
  if (typeof (n) !== 'number') throw new Error('DateType')

  const arr = []

  for (dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {

    arr.push(new Date(dt))
  }

  console.log(arr)
}



getDatesinRange(new Date('2022.09.01'), new Date('2022.09.10'), 5)