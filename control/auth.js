const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

const register = async (req, res) => {
  console.log('im inside')
  const password = req.body.password
  if (password) {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    const user = await User.createUser(newUser, function (err, user) {
      if (err) throw err
      console.log(err)
      // res.send(user).end()
      res.status(201).send({ msg: 'Account Created Successfully' })
    })
  } else {
    res.status(500).send("{errors: \"Passwords don't match\"}").end()
  }
}

passport.use(new LocalStrategy({
  usernameField: 'email'
},
async (email, password, done) => {
  // console.log('email' + email)
  User.getUserByEmail(email, (err, user) => {
    if (err) throw err
    if (!user) {
      return done(null, false, { msg: 'Unknown User' })
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, { status: 401, msg: 'Invalid password' })
      }
    })
  })
}
))

module.exports = { register }
