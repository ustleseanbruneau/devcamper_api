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
  //const bootcamps = await Bootcamp.find()
  //const bootcamps = await Bootcamp.find(req.query)

  //console.log(req.query)

  let query
  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  console.log(reqQuery)

  //let queryStr = JSON.stringify(req.query)
  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr))

  // Select Fields
  if(req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort Fields
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const bootcamps = await query

  // Pagination result
  const pagination = {}

  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if(startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }

  }

  res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps })

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
