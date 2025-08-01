const app = require('./src/app')
require('dotenv').config()

const fs = require('fs')
const https = require('https')

const PORT = process.env.PORT || 3055
const HTTPS_PORT = 443

// const httpsOptions = {
//   key: fs.readFileSync('./src/cert/cert-key.pem'),
//   cert: fs.readFileSync('./src/cert/cert.pem'),
// }

const server = app.listen(PORT, () => {
  console.log(`Server start with port ${PORT}`)
})

// https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
//   console.log(`HTTPS server is running on port ${HTTPS_PORT}`)
// })

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})
