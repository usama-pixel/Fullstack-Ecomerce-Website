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
  const product = new Product(req.body)
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
  Product.deleteById(prodId)
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
  // Product.delete(req.body.productId)
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}