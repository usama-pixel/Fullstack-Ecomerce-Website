const { ObjectId } = require('mongodb')
const { validationResult } = require('express-validator')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    validationErrors: [],
    errorMessage: null
  })
}

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
      product: { ...req.body }
    })
  }
  const product = new Product({
    ...req.body,
    userId: req.user._id
  }) // conveniently, we can also set userId
  // to simply req.user which is a mongoose object, and mongoose will automatically pick the _id from it.
  product.save()
    .then(result => {
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
        hasError: false,
        errorMessage: '',
        validationErrors: [],
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req)
  const prodId = req.body.productId
  console.log('submit', req.body)
  // console.log(errors.array())
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
      product: { ...req.body, _id: prodId }
    })
  }
  console.log('outside')
  Product.findById(req.body.productId)
    .then(product => {
      console.log('mongo product', product)
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect('/')

      Object.assign(product, req.body)
      return product.save()
        .then(result => {
          console.log('Updated')
          res.redirect('/admin/products')
        })
    })
    .catch(err => console.log(err))
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
  // Product.delete(req.body.productId)
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
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