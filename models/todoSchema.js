const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  text: { type: String },

  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String
  }
  // trip: {
  //   type: Schema.ObjectId,
  //   ref: 'tripSchema'
  // }

})
const todo = mongoose.model('todo', todoSchema)
module.exports = todo
