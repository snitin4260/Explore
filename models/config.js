const mongoose = require('mongoose')
require('dotenv').config()
const trips = require('./tripSchema')
mongoose.set('debug', true)
mongoose.Promise = require('bluebird')
var db
const connection = mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true }, (err, dataBase) => {
// const connection = mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
  db = dataBase
  if (!err) {
    console.log('connection successfull')
  } else {
    console.log('error is ===' + err)
  }
})
db = mongoose.connection
module.exports = { db, connection, trips }
