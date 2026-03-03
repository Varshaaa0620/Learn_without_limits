const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const signupValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('full_name').trim().notEmpty().withMessage('Full name is required.')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);

module.exports = router;
