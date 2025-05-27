const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from "Authorization" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_temporary_jwt_secret');
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or deactivated user' 
      });
    }
    
    // Attach user to the request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Middleware to verify roles
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (roleArray.length > 0 && !roleArray.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to access this resource' 
      });
    }
    
    next();
  };
};
