const express = require('express')
const path = require('path')

const shopController = require('../controllers/shop')

const router = express.Router()

router.get('/', shopController.getIndex)// we can also use app.use, app.use doesnt do exact matching of routes
// like if we sent a get request for '/product', and there is also a route like '/', 
// and it is defined first in the code, then '/' route will be executed.
// but 'get()' does exact matching. a get request for '/products' WILL hit '/products' route, not the '/' route

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct) // here :productId lets us extract this data.
// but if you have a route like '/products/delete after this route, then that will never execute
// so always place these(/product/:productId) kinds of routes after the general routes(/product/delete)

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

router.post('/cart-delete-item', shopController.postCartDeleteProduct)

router.post('/create-order', shopController.postOrder)

router.get('/orders', shopController.getOrders)

// router.get('/checkout', shopController.getCheckout)


module.exports = router;