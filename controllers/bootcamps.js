
// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = (req, res, next) => {
  //res.status(200).json({ success: true, msg: 'Show all bootcamps', hello: req.hello })
  res.status(200).json({ success: true, msg: 'Show all bootcamps' })
} 

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` })
} 

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamp' })
} 

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })
} 

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` })
} 
