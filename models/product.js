const Cart = require('./cart')
const db = require('../util/database')

module.exports = class product {
  constructor(book) {
    Object.assign(this, book)
  }
  save() {
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description])
    // we could use the following query instead of above on
    // `INSERT INTO products (title, price, imageUrl, description) VALUES (${this.title}, ${this.price}, this.imageUrl, this.description)`
    // -> but it is prone to SQL Injection attacks, which is why we use the line that we used, which is safe.
  }
  static delete(id) {

  }
  static fetchAll() { // static key word here allows us to access this method without creating an object-
    // of the class like 'const p = new Product()', rather, we can access it like Product.fetchAll() 
    return db.execute('SELECT * FROM products')
  }
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE id = ?', [id])
  }
}