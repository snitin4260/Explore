const mongoose = require('mongoose')
require('dotenv').config()
const trips = require('./tripSchema')
mongoose.set('debug', true)
const connection = mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true }, (err) => {
// const connection = mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log('connection successfull')
  } else {
    console.log('error is ===' + err)
  }
})

module.exports = { connection, trips }
