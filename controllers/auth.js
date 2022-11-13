const crypto = require('crypto')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')

const email = process.env.email
const pass = process.env.password

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: email,
    pass: pass
  }
})

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    })
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: { email, password },
          validationErrors: []
        })
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            // console.log('user saved in session', req.session.user)
            return req.session.save((err) => {
              // we are writing res.redirect inside this function because if we redirect it outside it, it may happend that the data may take a little time
              // to be saved into the database, which may cause some bugs. but save ensures that the data is written to the database, and then this callback runs
              console.log(err)
              res.redirect('/')
            })
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: { email, password },
            validationErrors: []
          })
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  // console.log('errors', errors.array())
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password, confirmPassword },
        validationErrors: errors.array()
      })
  }
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
      return transporter.sendMail({
        from: '"Usama" shop@node-complete.com>', // sender address
        to: email, // list of receivers
        subject: "Signup succeeded ✔", // Subject line
        text: "Your Account was created on Usama's Ecomerce site!", // plain text body
        html: "<h1>You Successfully signed up</h1>", // html body
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      // console.log('res 1')
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found')
          // console.log('res 2')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
          .then(result => {
            res.redirect('/')
            transporter.sendMail({
              to: req.body.email,
              from: 'shop@node-complete.com',
              subject: 'Password Reset',
              html: `
              <p> You requested a password reset</p>
              <p>Click this <a href="http://localhost:3001/reset/${token}"> link to set a new password</p>
            `
            })
          })
      })
      .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  // console.log('api hit')
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error')
      message = message.length > 0 ? message[0] : null
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then(result => {
      res.redirect('/login')
      transporter.sendMail({
        to: resetUser.email,
        from: 'shop@node-complete.com',
        subject: 'Password reset successful',
        html: `
          <p>Dear Customer, your password was reset successfully</p>
        `
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

}