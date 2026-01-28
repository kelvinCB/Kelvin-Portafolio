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
// Limiter for the contact form
exports.contactFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Has enviado demasiados mensajes en poco tiempo. Por favor, espera unos minutos.'
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json(options.message);
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
