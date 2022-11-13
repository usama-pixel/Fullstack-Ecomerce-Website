const express = require('express')
const { check, body } = require('express-validator')

const router = express.Router()
const User = require('../models/user')
const authController = require('../controllers/auth')

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body(
    'password',
    'Password must only contain numbers and text and at least 5 character'
  )
    .isAlphanumeric()
    .trim()
    .isLength({ min: 5 })
], authController.postLogin)

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email already exists')
            }
          })
      })
      .normalizeEmail(),
    body(
      'password',
      'Password must only contain numbers and text and at least 5 character'
    )
      .isLength({ min: 5 })
      .trim()
      .isAlphanumeric(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match')
        }
        return true
      })
  ],
  authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router