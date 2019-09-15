const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function (newUser, callback) {
  bcrypt.hash(newUser.password, 10, function (err, hash) {
    if (err) throw err
    newUser.password = hash
    newUser.save(callback)
  })
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email }
  User.findOne(query, callback)
}

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}
