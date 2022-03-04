const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
//exports.getBootcamps = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: 'Show all bootcamps', hello: req.hello })
  //res.status(200).json({ success: true, msg: 'Show all bootcamps' })

  /*
  try {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch(err) {
    //res.status(400).json({ success: false })
    next(err)
  }
  */
//} 
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  const bootcamps = await Bootcamp.find()

  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })

})

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
//exports.getBootcamp = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` })
  //if(!bootcamp) {
    //return res.status(400).json({ success: false })
  //}
//}
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: bootcamp })

}) 

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp
    })

}) 

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
  
    if(!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: bootcamp })

}) 

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  
    if(!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
  
    res.status(200).json({ success: true, data: {} })

}) 
