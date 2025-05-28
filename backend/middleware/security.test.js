// backend/middleware/security.test.js

// Mock the external libraries
const mockHelmet = jest.fn(() => (req, res, next) => next()); // Returns a mock middleware
const mockMongoSanitize = jest.fn(() => (req, res, next) => next()); // Returns a mock middleware

jest.mock('helmet', () => mockHelmet);
jest.mock('express-mongo-sanitize', () => mockMongoSanitize);

// Import the functions/middleware to be tested AFTER mocks are set up
const securityMiddleware = require('./security');

// Store original NODE_ENV and console.warn
const originalNodeEnv = process.env.NODE_ENV;
const originalConsoleWarn = console.warn;

describe('Security Middleware', () => {
  beforeEach(() => {
    // Reset mocks and process.env before each test
    jest.clearAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
    console.warn = jest.fn(); // Mock console.warn for tests
  });

  afterAll(() => {
    // Restore original console.warn
    console.warn = originalConsoleWarn;
  });

  describe('secureHeaders (helmet configuration)', () => {
        it('should configure helmet for production when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      // Re-require or re-evaluate the module to pick up new NODE_ENV for helmet config
      jest.isolateModules(() => {
        const freshSecurityMiddleware = require('./security');
        // Accessing the middleware will trigger its instantiation with helmet()
        const _ = freshSecurityMiddleware.secureHeaders;
      });

      expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining({
        contentSecurityPolicy: true,
        crossOriginEmbedderPolicy: false,
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        },
        referrerPolicy: {
          policy: 'strict-origin-when-cross-origin'
        }
      }));
    });

    it('should configure helmet for development when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'development';
      jest.isolateModules(() => {
        const freshSecurityMiddleware = require('./security');
        const _ = freshSecurityMiddleware.secureHeaders;
      });

      expect(mockHelmet).toHaveBeenCalledWith(expect.objectContaining({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        hsts: false,
        referrerPolicy: {
          policy: 'strict-origin-when-cross-origin'
        }
      }));
    });
  });

  describe('sanitize (mongoSanitize configuration)', () => {
        it('should configure mongoSanitize for production (dryRun: false) when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      jest.isolateModules(() => {
        const freshSecurityMiddleware = require('./security');
        const _ = freshSecurityMiddleware.sanitize;
      });

      // The actual mongoSanitize function is the mockMongoSanitize itself
      // We need to check the arguments it was called with when securityMiddleware.sanitize was defined
      // This requires a bit of a workaround if the middleware is just an instance.
      // Let's assume the module exports the result of mongoSanitize directly.
      // If securityMiddleware.sanitize is the *result* of mongoSanitize(), we check mockMongoSanitize.mock.calls
      expect(mockMongoSanitize).toHaveBeenCalledWith(expect.objectContaining({
        dryRun: false
      }));
    });

    it('should configure mongoSanitize for development (dryRun: true) when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'development';
      jest.isolateModules(() => {
        const freshSecurityMiddleware = require('./security');
        const _ = freshSecurityMiddleware.sanitize;
      });
      
      expect(mockMongoSanitize).toHaveBeenCalledWith(expect.objectContaining({
        dryRun: true
      }));
    });

    it('onSanitize callback should call console.warn with the correct message', () => {
      // To test onSanitize, we need to get the options object passed to mongoSanitize
      // and then call the onSanitize function from it.
      process.env.NODE_ENV = 'development'; // or production, doesn't matter for onSanitize itself
      jest.isolateModules(() => {
        const freshSecurityMiddleware = require('./security');
        const _ = freshSecurityMiddleware.sanitize; // This ensures mongoSanitize is called
      });

      // Get the options passed to mongoSanitize in its last call
      const sanitizeOptions = mockMongoSanitize.mock.calls[mockMongoSanitize.mock.calls.length - 1][0];
      
      const mockReq = {}; // Dummy req object
      const testKey = 'testField';
      sanitizeOptions.onSanitize(mockReq, testKey);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(`NoSQL injection attempt detected in field: ${testKey}`);
    });
  });

});
