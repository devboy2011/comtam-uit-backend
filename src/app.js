require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const eventRoutes = require('./routes/event.routes')
const orderRoutes = require('./routes/order.routes')
const userRoutes = require('./routes/user.routes')
const adminAuthRoutes = require('./routes/admin.auth.routes')
const adminEventRoutes = require('./routes/admin.event.routes')

const app = express()

// const httpsOptions = {
//   key: './cert/cert-key.pem',
//   cert: './cert/cert.pem'
// }

// init middlewares
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      process.env.PORT || 'http://localhost:3055'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// init db
require('./dbs/init.mongodb')

// Define routes
app.use('/api/v0/auth', authRoutes);
app.use('/api/v0/event', eventRoutes);
app.use('/api/v0/order', orderRoutes)
app.use('/api/v0/user', userRoutes);
app.use('/api/v0/admin/auth', adminAuthRoutes);
app.use('/api/v0/admin/event', adminEventRoutes);
app.use('/', require('./routes'))


// handle errors
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500 // error server code
  return res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Internal server error',
  })
})

module.exports = app
