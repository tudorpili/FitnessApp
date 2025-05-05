// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables (especially JWT_SECRET)
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1); // Stop the application if the secret is missing
}

/**
 * Middleware to authenticate requests using a JWT token.
 * Verifies the token from the Authorization header and attaches user info to req.user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header (format: "Bearer TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token part

  // If no token is present, deny access
  if (token == null) {
    console.log('[AuthMiddleware] No token provided.');
    // Use 401 Unauthorized for missing credentials
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error('[AuthMiddleware] Token verification failed:', err.message);
      // Use 403 Forbidden if token is invalid (e.g., expired, wrong signature)
      return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }

    // Token is valid, extract user information from the decoded payload
    // IMPORTANT: Adjust 'userId' based on what you actually store in your JWT payload during login
    const userInfo = {
        id: decodedPayload.userId, // Or decodedPayload.id, etc.
        // You might also include role or username if stored in the token
        // role: decodedPayload.role
    };

    console.log('[AuthMiddleware] Token verified. User info attached:', userInfo);

    // Attach the user information to the request object
    req.user = userInfo;

    // Pass control to the next middleware or route handler
    next();
  });
};

// Optional: Middleware to check for specific roles (e.g., Admin)
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'Admin') {
//     next(); // User is admin, proceed
//   } else {
//     res.status(403).json({ message: 'Access denied. Admin privileges required.' });
//   }
// };

module.exports = {
  authenticateToken,
  // isAdmin // Export if you create the isAdmin middleware
};
