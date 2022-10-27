const Product = require('../models/product')
exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render(
    'admin/add-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
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

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}