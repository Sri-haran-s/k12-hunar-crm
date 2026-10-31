const { body } = require('express-validator');

const VALID_USER_TYPES = ['Parent', 'Student', 'School'];
const VALID_CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

const createInquiryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .matches(/^[+]?[\d\s\-\(\)]{7,20}$/)
    .withMessage('Phone number must be a valid format (7–20 digits, may include +, spaces, dashes, or parentheses).'),

  body('user_type')
    .trim()
    .notEmpty()
    .withMessage('User type is required.')
    .isIn(VALID_USER_TYPES)
    .withMessage(`User type must be one of: ${VALID_USER_TYPES.join(', ')}.`),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isString()
    .withMessage('Message must be a string.')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters.'),
];

module.exports = { createInquiryValidator };
