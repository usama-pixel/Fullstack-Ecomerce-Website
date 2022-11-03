const { getDb } = require('../util/database')
const { ObjectId } = require('mongodb')

class User {
  constructor(user) {
    Object.assign(this, user)
  }
  save() {
    const db = getDb()
    return db.collection('users')
      .insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart?.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updatedCart = {
      items: updatedCartItems
    }
    const db = getDb()
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(i => i.productId)
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => (
          {
            ...p,
            quantity: this.cart.items
              .find(i => i.productId.toString() === p._id.toString())
              .quantity
          }
        ))
      })
  }

  deleteItemFromCart(prodId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString()
    })
    const db = getDb()
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
  }
}

module.exports = User