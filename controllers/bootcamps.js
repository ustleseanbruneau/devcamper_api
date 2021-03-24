const Bootcamp = require('../models/Bootcamp')

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: 'Show all bootcamps', hello: req.hello })
  //res.status(200).json({ success: true, msg: 'Show all bootcamps' })

  try {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch(err) {
    res.status(400).json({ success: false })
  }
} 

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  PUBLIC
exports.getBootcamp = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` })

  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ success: false })
  }
} 

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  //console.log(req.body)
  //res.status(200).json({ success: true, msg: 'Create new bootcamp' })

  try {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }

} 

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })

  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
  
    if(!bootcamp) {
      return res.status(400).json({ success: false })
    }
  
    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ success: false })
  }

} 

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  //res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` })

  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  
    if(!bootcamp) {
      return res.status(400).json({ success: false })
    }
  
    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    res.status(400).json({ success: false })
  }

} 
