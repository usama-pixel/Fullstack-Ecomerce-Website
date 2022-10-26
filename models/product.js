const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    // console.log('fileContent')
    // console.log(fileContent)
    // console.log('fileContent end')
    cb(JSON.parse(fileContent))
  })
}
module.exports = class product {
  constructor(title) {
    this.title = title
  }
  save() {
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }
  static fetchAll(cb) { // static key word here allows us to access this method without creating an object-
    // of the class like 'const p = new Product()', rather, we can access it like Product.fetchAll() 
    getProductsFromFile(cb)
  }
}