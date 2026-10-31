const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

const VALID_STATUSES = ['New', 'In Progress', 'Resolved'];

/**
 * POST /api/inquiries
 * Creates a new inquiry (public endpoint).
 */
async function createInquiry(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, phone, user_type, category, message } = req.body;

    const result = await pool.query(
      `INSERT INTO inquiries (name, email, phone, user_type, category, message, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'New', NOW(), NOW())
       RETURNING *`,
      [name, email, phone, user_type, category, message]
    );

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inquiries
 * Returns a paginated list of inquiries with optional filters.
 * Query params: category, userType, search, page, limit
 */
async function getInquiries(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const { category, userType, search } = req.query;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    if (userType) {
      conditions.push(`user_type = $${paramIndex++}`);
      values.push(userType);
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex + 1})`);
      values.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM inquiries ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Data query with pagination
    const dataResult = await pool.query(
      `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inquiries/stats
 * Returns counts of inquiries grouped by status.
 */
async function getStats(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)                                          AS total,
        COUNT(*) FILTER (WHERE status = 'New')           AS new,
        COUNT(*) FILTER (WHERE status = 'In Progress')   AS in_progress,
        COUNT(*) FILTER (WHERE status = 'Resolved')      AS resolved
      FROM inquiries
    `);

    const row = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        total: parseInt(row.total, 10),
        new: parseInt(row.new, 10),
        in_progress: parseInt(row.in_progress, 10),
        resolved: parseInt(row.resolved, 10),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inquiries/:id
 * Returns a single inquiry by its ID.
 */
async function getInquiryById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM inquiries WHERE id = $1 LIMIT 1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Inquiry with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/inquiries/:id/status
 * Updates the status of an inquiry.
 */
async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(422).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    const result = await pool.query(
      `UPDATE inquiries
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Inquiry with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInquiry,
  getInquiries,
  getStats,
  getInquiryById,
  updateInquiryStatus,
};
