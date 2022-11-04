const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false })) // resave: false means that session will
// not be saved on every request that is made by the client, but only when something changes in the session
// saveUninitialize ensures that session is not saved on requests where nothing is changed
app.use((req, res, next) => {
    User.findById('6363f4efd2c4c6e0bf248de7')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb://127.0.0.1:27017/shop')
    .then(result => {
        User.findOne().
            then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Usama',
                        email: 'usama@test.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            })
        console.log('Connected to the database')
        app.listen(3001, () => {
            console.log('listening on 3001')
        })
    })
    .catch(err => console.log(err))