// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log('[AuthMiddleware] No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error('[AuthMiddleware] Token verification failed:', err.message);
      return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }

    // --- IMPORTANT: Ensure 'role' is included in your JWT payload during login ---
    const userInfo = {
        id: decodedPayload.userId, // Or decodedPayload.id
        role: decodedPayload.role  // Make sure 'role' exists in the token payload
    };

    if (!userInfo.role) {
        console.warn('[AuthMiddleware] Token verified, but user role not found in payload.');
        // Decide how to handle this - forbid access or allow but controllers must check role
        // return res.status(403).json({ message: 'Access denied. User role missing.' });
    }


    console.log('[AuthMiddleware] Token verified. User info attached:', userInfo);
    req.user = userInfo;
    next();
  });
};

/**
 * Middleware to check if the authenticated user has the 'Admin' role.
 * Must run *after* authenticateToken.
 */
const isAdmin = (req, res, next) => {
  // Check if req.user was attached by authenticateToken and has the Admin role
  if (req.user && req.user.role === 'Admin') {
    console.log('[AuthMiddleware] Admin role verified.');
    next(); // User is admin, proceed
  } else {
    console.log(`[AuthMiddleware] Admin access denied. User role: ${req.user?.role}`);
    res.status(403).json({ message: 'Forbidden: Admin privileges required.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin // Export isAdmin
};
