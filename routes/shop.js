const express = require('express')
const path = require('path')

const shopController = require('../controllers/shop')

const router = express.Router()

router.get('/', shopController.getIndex)// we can also use app.use, app.use doesnt do exact matching of routes
// like if we sent a get request for '/product', and there is also a route like '/', 
// and it is defined first in the code, then '/' route will be executed.
// but 'get()' does exact matching. a get request for '/products' WILL hit '/products' route, not the '/' route

router.get('/products', shopController.getProducts)
router.get('/cart', shopController.getCart)
router.get('/checkout', shopController.getCheckout)

module.exports = router;