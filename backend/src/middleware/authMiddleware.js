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
    console.log('[AuthMiddleware] Strict: No token provided.');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error('[AuthMiddleware] Strict: Token verification failed:', err.message);
      return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }
    
    const userInfo = {
        id: decodedPayload.userId, 
        username: decodedPayload.username, // Added username to req.user
        role: decodedPayload.role  
    };

    if (!userInfo.role) {
        console.warn('[AuthMiddleware] Strict: Token verified, but user role not found in payload.');
    }

    console.log('[AuthMiddleware] Strict: Token verified. User info attached:', userInfo);
    req.user = userInfo;
    next();
  });
};

// --- NEW: Optional Authentication Middleware ---
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // No token provided, proceed without setting req.user
    // The controller will handle logic for unauthenticated users
    console.log('[AuthMiddleware] Optional: No token provided. Proceeding as guest.');
    return next(); 
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      // Token is present but invalid (e.g., expired, malformed)
      // For optional auth, we might still proceed as guest, or treat as error.
      // For simplicity here, we'll proceed as guest if token is invalid.
      // If strict invalid token handling is needed even for optional, return 403.
      console.warn('[AuthMiddleware] Optional: Invalid token provided. Proceeding as guest.', err.message);
      return next(); 
    }

    // Token is valid, populate req.user
    const userInfo = {
        id: decodedPayload.userId,
        username: decodedPayload.username, // Ensure username is in payload
        role: decodedPayload.role
    };
    
    if (!userInfo.role) {
        console.warn('[AuthMiddleware] Optional: Token verified, but user role not found in payload.');
    }

    console.log('[AuthMiddleware] Optional: Token verified. User info attached:', userInfo);
    req.user = userInfo;
    next();
  });
};
// --- END NEW ---


const isAdmin = (req, res, next) => {
  // Ensure req.user exists before checking role
  if (req.user && req.user.role === 'Admin') {
    console.log('[AuthMiddleware] Admin role verified.');
    next(); 
  } else {
    console.log(`[AuthMiddleware] Admin access denied. User role: ${req.user?.role || 'Guest/Unknown'}`);
    res.status(403).json({ message: 'Forbidden: Admin privileges required.' });
  }
};

module.exports = {
  authenticateToken,
  optionalAuthenticateToken, // Export the new middleware
  isAdmin 
};
