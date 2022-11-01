const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')
const errorController = require('./controllers/error')

const sequelize = require('./util/database')

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const app = express();
/*
// by default 'layoutsDir' is set to 'views/layout', so setting it to it again is redundant.
app.engine(
    'hbs',
    expressHbs({
        layoutsDir: 'views/layouts',
        defaultLayout: 'main-layout',
        extname: 'hbs', // this key tells the node js handlebars to look for .hbs extension for the layout-
        // and this only applies to handlebars layouts, and not anyother handlebars files
    })
) // whatever name you set here you will have to give that as extension to view folder files
// like if name is han, filename would be home.han.
*/
// app.set('view engine', 'hbs')
/**app.set('view engine', 'pug') // app set allows us to set any values(like this app.set('title','Naruto') )
//globally on our express application express doesnt understand these values and ignores
// them but we can read these values from app using app.get(), so we can share data across app this way as well.
// but there are some keywords (view engine, view etc..) that make the express behave differently.
// view engine tells express that for any dynamic template we are trying to render,
// use the engine we are registering
*/
app.set('view engine', 'ejs')
app.set('views', 'views') // using this line will let express find our views which will be rendered using templating engine
// by default it is set to views folder in the root directory, so there is no need for this line but if the views are in other
// folder, you can use this line like app.set('views', 'templates')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'))) // you can register multiple static folders as well like in comment below
// app.use(express.static(path.join(__dirname, 'folder')))
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            // console.log('user added', req.user.name)
            next()
        })
        .catch(err => console.log(err))
})
User.hasOne(Cart)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)


Product.belongsTo(User, { // this defines the relation that a user created this product
    constraints: true,
    onDelete: 'CASCADE' // CASCADE tells that if a user is deleted, the connected product should also be deleted
})
// instead of above line, we can also define that relation with the following line
User.hasMany(Product)
/** this above line says that a user can have many products, which basically says
the same thing as Product.belongsTo(User) */


// Cart.hasMany(CartItem)


// sync() method looks at all the models defined, which we created using sequelize.define
// in our product.js file in the model folder, and creates tables for them
// sync() also defines relations in our DB, but the problem is if we already have created tables in
// the DB, it will not define the relations in DB that we defined here such as Product.belongsTo(User)
// so we pass { force: true } to forcefully define our relations even after tables are created.
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@gmail.com' })
        }
        return user
    })
    .then(user => {
        return user.createCart()
    })
    .then(cart => {
        app.listen(3001, () => {
            console.log('listening to port 3001')
        })
    })
    .catch(err => console.log(err))