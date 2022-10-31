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
  req.user.createProduct(req.body)
    .then(result => {
      console.log(result)
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
  // Product.create(product)

}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query?.edit // extracting the query parameter, which we get from the url like-
  // 'https://www.usama.com/products/1?edit=true' here everything after ? are the query parameters
  if (!editMode)
    return res.redirect('/')
  const prodId = req.params.productId
  req.user
    .getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0]
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
  const obj = {
    id: req.body.productId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  }
  Product.findByPk(obj.id)
    .then(product => {
      Object.assign(product, obj)
      return product.save()
    }).then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

  // const updatedProduct = new Product(obj)
  // updatedProduct.save()
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.destroy({ where: { id: prodId } })
    .then(result => {
      res.redirect('/admin/products')
    }).catch(err => console.log(err))
  // Product.delete(req.body.productId)
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}