const express = require('express');
const { body } = require('express-validator');
const { 
  enrollInCourse, 
  getMyEnrollments, 
  checkEnrollment 
} = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', 
  authenticate,
  [
    body('course_id').isInt().withMessage('Valid course ID is required.')
  ],
  enrollInCourse
);

router.get('/my-courses', authenticate, getMyEnrollments);
router.get('/check/:course_id', authenticate, checkEnrollment);

module.exports = router;
