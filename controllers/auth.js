const User = require('../models/user')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const email = process.env.email
const pass = process.env.password
console.log('env', email)
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
    errorMessage: message
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
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
          req.flash('error', 'Invalid email or password')
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
        req.flash('error', 'This email already exists')
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
          return transporter.sendMail({
            from: '"Usama" shop@node-complete.com>', // sender address
            to: email, // list of receivers
            subject: "Yo qurari Signup succeeded ✔", // Subject line
            text: "There is a new article. It's about sending emails, check it out!", // plain text body
            html: "<h1>You Successfully signedup</h1>", // html body
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}