const products = [];

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render(
    'add-product',
    {
      pageTitle: 'Add Product',
      path: 'admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    }
  )
}

exports.postAddProduct = (req, res, next) => {
  console.log(req.body)
  products.push({ title: req.body.title })
  res.redirect('/')
}

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
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    // the handlebars will automatically use the default layout, you can disable it using a special key here-
    // layout: false,-
    // like the above line.
  }) // products will be available in shop.pug file through its key 'prods',
  // you can also pass multiple fields here like {prods: products, docTitle: 'shop' }
  // adminData.products.forEach(itm => console.log(itm.title))
}