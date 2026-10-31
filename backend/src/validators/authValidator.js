const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isString()
    .withMessage('Password must be a string.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

module.exports = { loginValidator };
