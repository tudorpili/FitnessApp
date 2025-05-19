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

    
    const userInfo = {
        id: decodedPayload.userId, 
        role: decodedPayload.role  
    };

    if (!userInfo.role) {
        console.warn('[AuthMiddleware] Token verified, but user role not found in payload.');
        
        
    }


    console.log('[AuthMiddleware] Token verified. User info attached:', userInfo);
    req.user = userInfo;
    next();
  });
};


const isAdmin = (req, res, next) => {
  
  if (req.user && req.user.role === 'Admin') {
    console.log('[AuthMiddleware] Admin role verified.');
    next(); 
  } else {
    console.log(`[AuthMiddleware] Admin access denied. User role: ${req.user?.role}`);
    res.status(403).json({ message: 'Forbidden: Admin privileges required.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin 
};
