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
