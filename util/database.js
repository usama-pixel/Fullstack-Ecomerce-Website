const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'jvwf7013', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize;