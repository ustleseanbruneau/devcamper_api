const express = require('express')
const { 
  getCourses,
  getCourse,
  addCourse 
 } = require('../controllers/courses')

const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)
//router.route('/:id').get(getCourse)
router.route('/').get(getCourse).post(addCourse)

module.exports = router
