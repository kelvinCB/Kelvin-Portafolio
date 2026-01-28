const rateLimit = require('express-rate-limit');
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
  max: 10, // Aumentado ligeramente para pruebas
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Has enviado demasiados mensajes. Por favor, espera antes de intentar de nuevo.'
    });
  }
});

// REMOVED: mongoSanitize (No longer needed for PostgreSQL/Knex)
exports.sanitize = (req, res, next) => next();

// Middleware to add security headers
exports.secureHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});
