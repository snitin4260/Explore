const mongoose = require('mongoose')
const Schema = mongoose.Schema
const inviteSchema = new Schema({
  token: String,
  email: String
})
const invite = mongoose.model('invite', inviteSchema)
module.exports = invite
