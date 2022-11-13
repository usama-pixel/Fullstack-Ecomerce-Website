const { ObjectId } = require('mongodb')
const { validationResult } = require('express-validator')
const Product = require('../models/product')
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {
  // console.log('session data', req.session.user)
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
  const image = req.file
  // console.log(image)
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { ...req.body },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    })
  }
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

  const imageUrl = image.path

  const product = new Product({
    ...req.body,
    imageUrl,
    userId: req.user._id
  }) // conveniently, we can also set userId
  // to simply req.user which is a mongoose object, and mongoose will automatically pick the _id from it.
  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log('error has happend')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req)
  const prodId = req.body.productId
  const image = req.file

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

  Product.findById(req.body.productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect('/')

      Object.assign(product, req.body)
      if (image) {
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = image.path
      }
      return product.save()
        .then(result => {
          console.log('Updated')
          res.redirect('/admin/products')
        })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found'))
      }
      fileHelper.deleteFile(product.imageUrl)
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
      res.status(200).json({ message: 'Success!' })
    }).catch(err => {
      res.status(500).json({ message: 'Deleting product failed.' })
    })
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
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}