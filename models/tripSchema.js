const mongoose = require('mongoose')
const tripSchema = new mongoose.Schema({

  tripName: {
    type: String,
    defalut: 'none',
    trim: true
  },
  _id: { type: String },

  startDate: {
    type: String,
    defalut: 'none',
    trim: true
  },

  endDate: {
    type: String,
    defalut: 'none',
    trim: true
  },

  days: {
    type: String,
    defalut: 'none',
    trim: true
  },

  itinearary: [],

  members: [],

  createdAt: {
    type: Date,
    default: Date.now
  },

  admin: {
    type: String,
    defalut: 'none',
    trim: true
  }
})
const trips = mongoose.model('trips', tripSchema)
module.exports = trips
