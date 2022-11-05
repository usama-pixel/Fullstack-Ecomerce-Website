exports.get404 = (req, res, next) => { // this middleware will run if no other above middlewares are hit
  /** res.status(404).sendFile(path.join(__dirname, 'views', '404.html')) // you can chain methods like this, but send()
  * // has to be the last one
  */
  res.render('404', { pageTitle: 'Error 404', path: '/404', isAuthenticated: req.session.isLoggedIn })
}