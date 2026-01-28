// backend/middleware/security.test.js

// Mock the external libraries
const mockHelmet = jest.fn(() => (req, res, next) => next()); // Returns a mock middleware

jest.mock('helmet', () => mockHelmet);

// Import the functions/middleware to be tested AFTER mocks are set up
const securityMiddleware = require('./security');

// Store original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

describe('Security Middleware', () => {
  beforeEach(() => {
    // Reset mocks and process.env before each test
    jest.clearAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
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
        contentSecurityPolicy: expect.any(Object),
        crossOriginEmbedderPolicy: false,
        hsts: expect.any(Object),
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

  describe('sanitize (simplified passthrough)', () => {
    it('should simply pass through to next()', () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      securityMiddleware.sanitize(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
