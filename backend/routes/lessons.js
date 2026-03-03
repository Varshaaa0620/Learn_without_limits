const express = require('express');
const { getLessonById, getAdjacentLessons } = require('../controllers/lessonController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', authenticate, getLessonById);
router.get('/:id/adjacent', authenticate, getAdjacentLessons);

module.exports = router;
