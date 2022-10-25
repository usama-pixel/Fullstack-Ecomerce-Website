const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')

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

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/admin', adminData.routes)
app.use(shopRoutes)

app.use(express.static(path.join(__dirname, 'public'))) // you can register multiple static folders as well like in comment below
// app.use(express.static(path.join(__dirname, 'folder')))

app.use((req, res, next) => { // this middleware will run if no other above middlewares are hit
    /** res.status(404).sendFile(path.join(__dirname, 'views', '404.html')) // you can chain methods like this, but send()
    * // has to be the last one
    */
    res.render('404', { pageTitle: 'Error 404' })
})


app.listen(3001, () => {
    console.log('listening to port 3001')
})
