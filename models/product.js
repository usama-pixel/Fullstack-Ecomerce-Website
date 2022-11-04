const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User' // we use this field to help us distinguish b/w to which document this id belong
    // because as it happens, this userId field could hold I of any document
  }
})
module.exports = mongoose.model('Product', productSchema)

// const { ObjectId } = require('mongodb')
// const { getDb } = require('../util/database')

// class Product {
//   constructor(obj) {
//     Object.assign(this, obj)
//     this._id = this._id ? new ObjectId(this._id) : this._id
//   }
//   save() {
//     const db = getDb()
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//     } else {
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//       .then(result => {
//         console.log(result)
//       })
//       .catch(err => console.log(err))
//   }
//   static fetchAll() {
//     const db = getDb()
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         return products
//       })
//       .catch(err => console.log(err))
//   }
//   static findById(prodId) {
//     const db = getDb()
//     return db.collection('products')
//       .find({ "_id": new ObjectId(prodId) })
//       .next()
//       .then(result => result)
//       .catch(err => console.log(err))
//   }
//   static deleteById(prodId) {
//     const db = getDb()
//     return db
//       .collection('products')
//       .deleteOne({ _id: new ObjectId(prodId) })
//       .then(result => {
//         console.log('Deleted')
//       })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = Product