const fs = require('fs')
const path = require('path')

let outputDir = 'js/main.js'

// IIFE
;(() => {
    fs.readdir(path.join(__dirname, '/js'), (err, files) => {
        if (err) throw err

        files.sort((a, b) => {
            return a.slice(0, 1) - b.slice(0, 1)
        })

        files.forEach(file => {
            if (file.startsWith('-', 1) && file.split('.')[1] === 'js') {
                console.log(file)
                fs.readFile(path.join(__dirname, `js/${file}`), (err, data) => {
                    if (err) throw err

                    fs.writeFile(outputDir, data, err => {
                        if (err) throw err
                    })
                    const stream = fs.createWriteStream(outputDir, {
                        flags: 'w',
                    })

                    stream.on('error', err => {
                        throw err
                    })
                })
            }
        })
    })
})()
