const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const {
  createInquiry,
  getInquiries,
  getStats,
  getInquiryById,
  updateInquiryStatus,
} = require('../controllers/inquiryController');

const authMiddleware = require('../middleware/authMiddleware');
const { createInquiryValidator } = require('../validators/inquiryValidator');

// Rate limiter for the public submission endpoint: 5 requests per 15 minutes per IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiry submissions from this IP. Please try again after 15 minutes.',
  },
});

// POST /api/inquiries  (public, rate-limited)
router.post('/', submissionLimiter, createInquiryValidator, createInquiry);

// GET /api/inquiries  (protected)
router.get('/', authMiddleware, getInquiries);

// GET /api/inquiries/stats  (protected) — MUST come BEFORE /:id
router.get('/stats', authMiddleware, getStats);

// GET /api/inquiries/:id  (protected)
router.get('/:id', authMiddleware, getInquiryById);

// PATCH /api/inquiries/:id/status  (protected)
router.patch('/:id/status', authMiddleware, updateInquiryStatus);

module.exports = router;
