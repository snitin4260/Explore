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
app.use(cookieParser())
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
app.use(session({
  store: new MongoStore({
    mongooseConnection: db,
    ttl: 14 * 24 * 60 * 60
  }),
  key: 'userSid',
  secret: 'Akshay13578111851171',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000000, secure: false }
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
    const userName = req.user.name
    const _id = req.user.id
    const user = req.session
    user._id = _id
    // res.cookie('userId', _id, { maxAge: 60000, httpOnly: false })
    res.status(200).send({ userName, _id })
  }
)
// app.use((req, res, next) => {
//   res.locals.currentUser = req.session.userId
//   next()
// })

// app.use((req, res) => {
//   MongoStore.get(req.sessionId, function (err, session) {
//     if (err) return console.log(err)
//     if (session) {
//       console.log('22222' + session)
//     }
//   })
// })

// Endpoint to logout
app.get('/api/logout', (req, res) => {
  req.logout()
  
  // req.session.destroy()
  // res.clearCookie('userId')
  res.status(200).send({ msg: 'user logged Out' })
})

const isLoggedIn = async (req, res, next) => {
  if (req.session.passport !== undefined) {
    return next()
  }
  res.status(404).json({ msg: 'user not found' })
}

app.use('/api', tripRoutes)

// app.use('/api', isLoggedIn, tripRoutes)
app.use('/*', express.static(path.join(__dirname, 'views'), { maxAge: '30 days' }))

server.listen(PORT, () => {
  console.log(`Magic Happening on ${PORT}`)
})
