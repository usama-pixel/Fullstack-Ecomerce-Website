const express = require('express')
const path = require('path')

const shopController = require('../controllers/shop')
const isAuth = require('../middlewares/is-auth')

const router = express.Router()

router.get('/', shopController.getIndex)// we can also use app.use, app.use doesnt do exact matching of routes
// like if we sent a get request for '/product', and there is also a route like '/', 
// and it is defined first in the code, then '/' route will be executed.
// but 'get()' does exact matching. a get request for '/products' WILL hit '/products' route, not the '/' route

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct) // here :productId lets us extract this data.
// but if you have a route like '/products/delete after this route, then that will never execute
// so always place these(/product/:productId) kinds of routes after the general routes(/product/delete)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders)

router.get('/orders/:orderId', isAuth, shopController.getInvoice)

module.exports = router;