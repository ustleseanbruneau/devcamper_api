const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} 

// file uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//app.use(logger)

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

/*
app.get('/', (req, res) => {
  //res.send('<h1>Hello from express</h1>')
  //res.json({ name: 'LeSean' })
  //res.sendStatus(400)
  //res.status(400).json({ success: false })
  res.status(200).json({ success: true, data: { id: 1 } })
  
})
*/



const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server and exit process
  server.close(() => process.exit(1))
})
