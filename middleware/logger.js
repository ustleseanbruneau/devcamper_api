// @desc  Logs requests to console

const logger = (req, res, next) => {
  //req.hello = 'Hello World'
  //console.log('Middle ran')
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
}

module.exports = logger;