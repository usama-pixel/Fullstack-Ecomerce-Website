const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

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