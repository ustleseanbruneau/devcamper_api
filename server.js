const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')


// Route files
const bootcamps = require('./routes/bootcamps')

// Load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} 

app.use(logger)

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

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

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
