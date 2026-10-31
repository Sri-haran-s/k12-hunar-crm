const express = require('express');
const router = express.Router();

const { login, me, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginValidator } = require('../validators/authValidator');

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me  (protected)
router.get('/me', authMiddleware, me);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
