const fs = require('fs')
const path = require('path')

const Cart = require('./cart')

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)

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
  constructor(book) {
    Object.assign(this, book)
  }
  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString();
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err)
        })
      }
    })
  }
  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id)
      const newProducts = products.filter(prod => prod.id !== id)
      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
        console.log(err)
      })
    })
  }
  static fetchAll(cb) { // static key word here allows us to access this method without creating an object-
    // of the class like 'const p = new Product()', rather, we can access it like Product.fetchAll() 
    getProductsFromFile(cb)
  }
  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
}