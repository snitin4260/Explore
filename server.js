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
app.use(passport.initialize())
app.use(passport.session())

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

app.use(function (req, res, next) {
  req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2')
  next()
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})
// passport.serializeUser(function (user, done) {
//   done(null, {
//     _id: user['id'],
//     userName: user['name'],
//     email: user['email']
//   })
// })

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

// var sessions = function (req, res) {
//   var temp = req.session.passport
//   req.session.regenerate(function (err) {
//     if (err) return err
//     // req.session.passport is now undefined
//     req.session.passport = temp
//     req.session.save(function (err) {
//       if (err) return err
//       res.send(200)
//     })
//   })
// }

// var userCookie
app.post('/api/login',
  passport.authenticate('local'),
  (req, res) => {
    // console.log(req)
    const userName = req.user.name
    const _id = req.user.id
    req.session.cookie.userId = _id
    res.status(200).send({ userName, _id })
  }
)

// Endpoint to logout
app.get('/api/logout', (req, res) => {
  req.logout()
  res.clearCookie('user_sid')
  res.status(200).send('user logged Out')
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
  if (req.session.passport !== undefined) {
    return next()
  }
  res.status(401).send('loggin first')
}

app.use('/api', tripRoutes)

// app.use('/api', isLoggedIn, tripRoutes)
app.use('/*', express.static(path.join(__dirname, 'views'), { maxAge: '30 days' }))

server.listen(PORT, () => {
  console.log(`Magic Happening on ${PORT}`)
})
