const fs = require('fs')
const path = require('path')


const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty += 1
        cart.products = [...cart.products] // we are copying this array to itself here because mutating(which we-
        // will do in the line below) may cause some issues if we have used the original array somewhere else in-
        // the project
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +productPrice
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err)
        return;
      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.find(prod => prod.id === id)
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
      updatedCart.totalPrice -= productPrice * product.qty
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err)
      })
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err)
        return cb(null)
      cb(cart)
    })
  }

}