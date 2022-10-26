const fs = require('fs')
const path = require('path')


module.exports = class product {
  constructor(title) {
    this.title = title
  }
  save() {
    const p = path.join(
      path.dirname(require.main.filename),
      'data',
      'products.json'
    )
    fs.readFile(p, (err, fileContent) => {
      let products = []
      if (!err) {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }
  static fetchAll(cb) { // static key word here allows us to access this method without creating an object-
    // of the class like 'const p = new Product()', rather, we can access it like Product.fetchAll() 
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([])
      }
      // console.log('fileContent')
      // console.log(fileContent)
      // console.log('fileContent end')
      cb(JSON.parse(fileContent))
    })
  }
}