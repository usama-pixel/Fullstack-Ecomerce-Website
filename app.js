const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const dotenv = require('dotenv')

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb://127.0.0.1:27017/shop'

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})
const csrfProtection = csrf()

dotenv.config()
app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })) // resave: false means that session will not be saved on every request that is made by the client,
// but only when something changes in the session saveUninitialize ensures that session is not saved on requests where nothing is changed

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user
            next()
        })
        .catch(err => {
            throw new Error(err)
        })
})
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.get('/500', errorController.get500)

app.use(errorController.get404)

app.use((error, req, res, next) => {
    res.redirect('/500')
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3001, () => {
            console.log('listening on 3001')
        })
    })
    .catch(err => console.log(err))