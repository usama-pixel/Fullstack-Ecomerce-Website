const Product = require('../models/product')
const Order = require('../models/order')
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products)
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId // we used productId here because we used it in our route like
  // /product/:productId
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(({ cart: { items } }) => {
      console.log(items)
      // res.redirect('/')
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: items,
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  console.log('api hit')
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  console.log('api hit')
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } } // if we simply 
        // assign i.productId to product, then only the _id will be assigned, not the whole data
        // because it contains alot of metadata that we can see from console.log. But the '_doc' 
        // gives us just the data that we want(no metadat), so now it works
      })
      console.log('products', products)
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}