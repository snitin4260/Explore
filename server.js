const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const User = require('./models/user')
const tripRoutes = require('./routes/route')
require('dotenv').config()
// const PORT = process.env.PORT || 3002
const PORT = 3002
const dbConn = require('./models/config')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const staticify = require('staticify')(path.join(__dirname, 'views'))
app.use(bodyParser.json())
// app.use(function (req, res, next) {
//   // console.log(req)
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', '*')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   next()
// })
const db = dbConn.db
app.use(bodyParser.urlencoded({ extended: true }))
app.use(staticify.middleware)
app.use(cookieParser())

app.use(session({
  store: new MongoStore({
    mongooseConnection: db
  }),
  key: 'user_sid',
  secret: 'Akshay13578111851171',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2')
  next()
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

// var userCookie
app.post('/api/login',
  passport.authenticate('local'),
  (req, res) => {
    // console.log(req)
    if (req.user) {
      const userName = req.user.name
      const _id = req.user.id
      req.session['userId'] = _id
      res.cookie('userId', _id, { maxAge: 60000, httpOnly: true })
      res.status(200).send({ userName, _id })
    }
    res.status(401).json({ msg: 'invalid password' })
  }
)

// Endpoint to logout
app.get('/logout', (req, res) => {
  res.clearCookie('user_sid', 'userId')
  // res.clearCookie('userId')
  req.logout()
  res.status(200).send({ msg: 'user logged Out' })
})

app.get('/api/trip/count', (req, res) => {
  console.log(req.session)
  res.status(200).send({ tripCount: 2 })
})
// app.use(function (req, res, next) {
//   console.log(req.session)
//   console.log('===================')
//   // console.log(req.user)
//   console.log('+++' + req.headers.cookie)
// })

const isLoggedIn = async (req, res, next) => {
  // if (req.session.passport !== undefined) {
  //   return next()
  // }
  // res.status(401).send('User Not Logged In')
  if (req.cookies.userId !== undefined) {
    const currentUser = User.findById(req.cookies.userId)
    if (currentUser.length !== 0) { return res.status(200).json({ userName: currentUser.name }) }
  }
  res.status(401).json({ msg: 'user not found' })
}

app.use('/api', tripRoutes)

// app.use('/api', isLoggedIn, tripRoutes)
app.use('/*', express.static(path.join(__dirname, 'views'), { maxAge: '30 days' }))

server.listen(PORT, () => {
  console.log(`Magic Happening on ${PORT}`)
})
