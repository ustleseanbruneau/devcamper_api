const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
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

// {{URL}}/api/v1/bootcamps?averageCost[gte]=10000&location.city=Boston
// {{URL}}/api/v1/bootcamps?careers[in]=Business

// Select only name,description,housing fields
//  {{URL}}/api/v1/bootcamps?select=name,description,housing

// Select only name,description,housing fields with filter housing=true
//  {{URL}}/api/v1/bootcamps?select=name,description,housing&housing=true

// Sort
// Ascending name
// {{URL}}/api/v1/bootcamps?select=name,description,housing&sort=name

// Decending name
// {{URL}}/api/v1/bootcamps?select=name,description,housing&sort=-name

// Page and Limit
//   {{URL}}/api/v1/bootcamps?page=2&limit=2&select=name

// With limit = 1
//   {{URL}}/api/v1/bootcamps?select=name&page=1

// Next and Prev objects
//   {{URL}}/api/v1/bootcamps?page=2

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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

    //const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    const bootcamp = await Bootcamp.findById(req.params.id)
  
    if(!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    bootcamp.remove();
  
    res.status(200).json({ success: true, data: {} })

}) 

// @desc    Get bootcamp
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
// Test:  http://localhost:5000/api/v1/bootcamps/radius/02118/10
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  //  Earth Radius = 3,963 miles / 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
  })

  res.status(200).json({
    success: true, 
    count: bootcamps.length,
    data: bootcamps
  })


}) 

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if(!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }

  if(!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

  //console.log(req.files)
  const file = req.files.file
  
  // Make sure the image is a photo
  if(!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }

  // Check filesize
  if(file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.error(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name
    })

  })

  //console.log(file.name)

}) 
