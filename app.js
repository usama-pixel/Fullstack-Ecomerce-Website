const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
// const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     User.findById('63636b1489198e2083f4a312')
//         .then(user => {
//             req.user = new User(user)
//             next()
//         })
//         .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb://127.0.0.1:27017/shop')
    .then(result => {
        console.log('Connected to the database')
        app.listen(3001, () => {
            console.log('listening on 3001')
        })
    })
    .catch(err => console.log(err))