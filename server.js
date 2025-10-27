const app = require('./src/index')
require('dotenv').config()

const https = require('https')

const PORT = process.env.PORT || 3055

const server = app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})
