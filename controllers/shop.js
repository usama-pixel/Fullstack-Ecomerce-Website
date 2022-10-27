const Product = require('../models/product')
exports.getProducts = (req, res, next) => {
  /** res.sendFile('/views/shop.html') */ // this line does not work because we need absolute path, and that can be done
  // using path module

  /** res.sendFile(path.join(__dirname, 'views', 'shop.html')) */ // this line should work but it doesnt, because we expect
  // __dirname to point to the main project but it points till folder where the current file is, the routes folder
  // in this case. (__dirname gives us the path to the file we are using it so here the path would be 
  // something like 'D:\My Data\Study\Online Course Work\project\controller' ) so the above line would give us path like
  //  'D:\My Data\Study\Online Course Work\project\routes\views\shop.html' which doesnt exist and gives an error.

  // to solve this, we use following line,
  /**
    res.sendFile(path.join(rootDir, 'views', 'shop.html')); // '../' means go up one level, we can also use '..'
   // instead of '../'
  */
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      // the handlebars will automatically use the default layout, you can disable it using a special key here-
      // layout: false,-
      // like the above line.
    }) // products will be available in shop.pug file through its key 'prods',
    // you can also pass multiple fields here like {prods: products, docTitle: 'shop' }
    // adminData.products.forEach(itm => console.log(itm.title))
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}