const express = require('express');
const { body } = require('express-validator');
const { 
  markLessonComplete, 
  getCourseProgress,
  getCompletedLessons 
} = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', 
  authenticate,
  [
    body('lesson_id').isInt().withMessage('Valid lesson ID is required.')
  ],
  markLessonComplete
);

router.get('/:course_id', authenticate, getCourseProgress);
router.get('/completed/:course_id', authenticate, getCompletedLessons);

module.exports = router;
