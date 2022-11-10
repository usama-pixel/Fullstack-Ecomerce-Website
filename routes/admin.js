const express = require('express')
const { body } = require('express-validator')
const path = require('path')

const adminController = require('../controllers/admin')
const isAuth = require('../middlewares/is-auth')
const router = express.Router()


// /admin/add-product => get 
router.get('/add-product', isAuth, adminController.getAddProduct)

// /admin/products => get 
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => post
router.post(
  '/add-product',
  isAuth,
  [
    body('title', 'Title must contain characters and numbers')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price')
      .isFloat({ min: 0.0001 })
      .withMessage('Your price must be greater than 0'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  adminController.postAddProduct
)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
  '/edit-product',
  isAuth,
  [
    body('title', 'Title must contain characters and numbers')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price')
      .isFloat({ min: 0.0001 })
      .withMessage('Your price must be greater than 0'),
    body('description',)
      .isLength({ min: 5, max: 400 })
      .withMessage('A description of at least 5 characters must be provided')
      .trim()
  ],
  adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.deleteProduct)

module.exports = router;