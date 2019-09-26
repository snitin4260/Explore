const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  text: { type: String },

  createdAt: {
    type: Date,
    default: Date.now
  },
  trip: {
    type: String
  },
  user: {
    type: String
  }
})
const todo = mongoose.model('todo', todoSchema)
module.exports = todo
