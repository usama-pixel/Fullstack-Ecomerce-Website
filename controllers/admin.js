const { ObjectId } = require('mongodb')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  // const { title, imageUrl, price, description } = req.body /**this line is used in the video */
  // const product = new Product(title, imageUrl, price, description) /**this line is used in video */
  const product = new Product({ ...req.body, userId: req.user._id }) // conveniently, we can also set userId
  // to simply req.user which is a mongoose object, and mongoose will automatically pick the _id from it.
  product.save()
    .then(result => {
      console.log('result', result)
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query?.edit // extracting the query parameter, which we get from the url like-
  // 'https://www.usama.com/products/1?edit=true' here everything after ? are the query parameters
  if (!editMode)
    return res.redirect('/')
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product)
        return res.redirect('/')
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  // const obj = {
  //   _id: req.body.productId,
  //   title: req.body.title,
  //   price: req.body.price,
  //   imageUrl: req.body.imageUrl,
  //   description: req.body.description,
  // }
  Product.findById(req.body.productId)
    .then(product => {
      Object.assign(product, req.body)
      // product = { ...product, ...req.body }
      return product.save()
    })
    .then(result => {
      console.log('Updated')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
  // Product.delete(req.body.productId)
}

exports.getProducts = (req, res, next) => {
  Product.find()
    /** .select('title price -_id') // this method allows use to select specific properties from retrieved data to show, and if you dont want a 
     * certain field you just put the minus sign infront of it like we did here
     */
    /** .populate('userId') // this method allows us to retrieve data for a property from the document where is is defined into the current document
     * like here in product document we have reference property of 'userId' from 'User' document, and to get the data of that user we would have
     * to run a different query and match the current id to all the users. But through populate, we don't have to do that, we just pass it the
     * property name and it finds for us and gives it to us.
     */
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}