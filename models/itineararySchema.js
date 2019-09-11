const mongoose = require('mongoose')
const itineararySchema = new mongoose.Schema({
  day: { type: Number },
  _id: { type: String },
  date: { type: String },
  location: { type: String },
  activity: [],
  tripId: { type: String }
})
const itinerary = mongoose.model('itinearary', itineararySchema)
module.exports = itinerary
