const express = require('express')
const path = require('path')

const productsController = require('../controllers/products')

const router = express.Router()

router.get('/', productsController.getProducts)// we can also use app.use, app.use doesnt do exact matching of routes
// like if we sent a get request for '/product', and there is also a route like '/', 
// and it is defined first in the code, then '/' route will be executed.
// but 'get()' does exact matching. a get request for '/products' WILL hit '/products' route, not the '/' route


module.exports = router;