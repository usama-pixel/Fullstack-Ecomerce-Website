const express = require('express')
const path = require('path')

const adminController = require('../controllers/admin')

const router = express.Router()


// /admin/add-product => get 
router.get('/add-product', adminController.getAddProduct)
// /admin/products => get 
router.get('/products', adminController.getProducts)

// // /admin/add-product => post
router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)

// exports.routes = router
// exports.products = products;
module.exports = router;