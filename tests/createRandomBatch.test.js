const assert = require('assert')

// Test `createRandomSampleBatch` function
// weird behavior regarding the batch size

const createRandomSampleBatch = (dates, n) => {
    let batch = []
    let seeds = []
    let availableDates = dates.length

    for (let i = 1; i <= availableDates; ++i) {
        const seed = this.getRandomInteger(0, availableDates)

        // Check if the index of the date has already been picked,
        // since the filtering for dates is a unreliable
        if (!seeds.includes(seed)) batch.push(dates[seed])

        if (batch.length === n) break

        seeds.push(seed)
    }

    return batch
}

assert.deepStrictEqual(createRandomSampleBatch())
