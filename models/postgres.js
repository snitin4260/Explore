
const { Client } = require('pg')

const client = new Client({
  user: process.env.DB_USER,
  hostname: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
})

client.connect((err) => {
  if (err) return console.log('connection Error', err.stack)
  return console.log(' postgres Db Connected')
})

module.exports = client

