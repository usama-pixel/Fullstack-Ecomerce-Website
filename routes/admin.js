const express = require('express')
const path = require('path')

const adminController = require('../controllers/admin')
const isAuth = require('../middlewares/is-auth')
const router = express.Router()


// /admin/add-product => get 
router.get('/add-product', isAuth, adminController.getAddProduct)

// /admin/products => get 
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => post
router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.deleteProduct)

module.exports = router;