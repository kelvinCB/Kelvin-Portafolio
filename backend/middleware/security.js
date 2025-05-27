const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Rate limit configuration to prevent brute force attacks
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit of 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});

// Stricter limiter for sensitive routes (login, registration)
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit of 10 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts, please try again later.'
    });
  }
});

// Limiter for the contact form
exports.contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // maximum 5 messages per hour from the same IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'You have sent too many messages. Please wait before sending another one.'
    });
  }
});

// Middleware to sanitize data and prevent NoSQL injection
exports.sanitize = mongoSanitize({
  // Secure configuration for production that avoids query errors
  onSanitize: (req, key) => {
    console.warn(`NoSQL injection attempt detected in field: ${key}`);
  },
  dryRun: process.env.NODE_ENV !== 'production' // Only logs in development, applies in production
});

// Middleware to add security headers
exports.secureHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production', // Enable in production
  crossOriginEmbedderPolicy: false, // To allow loading resources from other sources
  
  // Additional configuration for production
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  } : false,
  
  // Enable referrer policy 
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});
