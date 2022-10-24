const path = require('path')

module.exports = path.dirname(require.main.filename) // 'require.main.filename' gives us the path to the file
// that is responsible for running our application, (in this case app.js)
