const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render(
    'admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  }
  )
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
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode
  })
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