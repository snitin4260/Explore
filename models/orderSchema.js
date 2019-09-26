const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
  todo: {
    taskIds: [{ type: String }]
  },
  inprogress: {
    taskIds: [{ type: String }]
  },
  done: {
    taskIds: [{ type: String }]
  },
  columnOrder: [{ type: String }],
  user: {
    type: String
  },
  trip: {
    type: String
  }

})
const order = mongoose.model('order', orderSchema)
module.exports = order
