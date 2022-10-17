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
