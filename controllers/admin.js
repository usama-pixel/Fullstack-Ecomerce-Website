const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
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
  res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query?.edit // extracting the query parameter, which we get from the url like-
  // 'https://www.usama.com/products/1?edit=true' here everything after ? are the query parameters
  if (!editMode)
    return res.redirect('/')

  Product.findById(req.params.productId, product => {
    if (!product)
      return res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  // const prodId = req.body.productId
  // const updatedTitle = req.body.title
  // const updatedImage = req.body.imageUrl
  // const updatedPrice = req.body.price
  // const updatedDesc = req.body.description
  const obj = {
    id: req.body.productId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  }
  const updatedProduct = new Product(obj)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.deleteProduct = (req, res, next) => {
  console.log(req.body.productId)
  Product.delete(req.body.productId)
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}