const express = require('express');
const { body } = require('express-validator');
const { 
  getAllCourses, 
  getCourseById, 
  getCourseLessons,
  createCourse 
} = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.get('/:id/lessons', authenticate, getCourseLessons);
router.post('/', 
  authenticate, 
  checkRole(['instructor', 'admin']),
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').optional().trim()
  ],
  createCourse
);

module.exports = router;
