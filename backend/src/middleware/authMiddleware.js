const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT.
 * Accepts token from Authorization header (Bearer) or httpOnly cookie 'auth_token'.
 */
function authMiddleware(req, res, next) {
  let token = null;

  // 1. Try Authorization header first
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. Fall back to httpOnly cookie
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}

module.exports = authMiddleware;
