const User = require('../models/user')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            console.log('domatch', doMatch)
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) => {
              // we are writing res.redirect inside this function because if we redirect it outside it, it may happend that the data may take a little time
              // to be saved into the database, which may cause some bugs. but save ensures that the data is written to the database, and then this callback runs
              console.log(err)
              res.redirect('/')
            })
          }
          return res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
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
        })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}