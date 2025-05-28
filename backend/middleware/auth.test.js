// backend/middleware/auth.test.js

const { authenticate } = require('./auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mocking external dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/User');

// Mock process.env.JWT_SECRET
const MOCK_JWT_SECRET = 'test_secret';
process.env.JWT_SECRET = MOCK_JWT_SECRET;

describe('Auth Middleware - authenticate', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(), // Allows chaining .json(), .send() etc.
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

    it('should call next() and attach user to req if token is valid and user is active', async () => {
    const mockUser = { _id: 'userId123', active: true, role: 'user' };
    const mockToken = 'valid.token.here';
    mockReq.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockReturnValue({ userId: mockUser._id });
    User.findById.mockResolvedValue(mockUser);

    await authenticate(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, MOCK_JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied. No token provided.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is not Bearer token', async () => {
    mockReq.headers.authorization = 'InvalidTokenFormat';
    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied. No token provided.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired (jwt.verify throws error)', async () => {
    const mockToken = 'invalid.or.expired.token';
    mockReq.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockImplementation(() => {
      throw new Error('jwt error');
    });

    await authenticate(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, MOCK_JWT_SECRET);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    const mockToken = 'valid.token.unknown.user';
    mockReq.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockReturnValue({ userId: 'unknownUserId' });
    User.findById.mockResolvedValue(null); // User not found

    await authenticate(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, MOCK_JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith('unknownUserId');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token or deactivated user',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if user is found but inactive', async () => {
    const mockUser = { _id: 'userId123', active: false, role: 'user' }; // User is inactive
    const mockToken = 'valid.token.inactive.user';
    mockReq.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockReturnValue({ userId: mockUser._id });
    User.findById.mockResolvedValue(mockUser);

    await authenticate(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, MOCK_JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token or deactivated user',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

});

const { authorize } = require('./auth'); // Ensure authorize is also imported

describe('Auth Middleware - authorize', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      headers: {},
      // user will be set in individual tests
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() if no specific roles are required and user is authenticated', () => {
    mockReq.user = { _id: 'userId123', role: 'user' };
    const authorizeMiddleware = authorize(); // No roles specified
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next() if user has one of the required roles (roles as array)', () => {
    mockReq.user = { _id: 'userId123', role: 'admin' };
    const authorizeMiddleware = authorize(['admin', 'editor']);
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next() if user has the required role (roles as string)', () => {
    mockReq.user = { _id: 'userId123', role: 'editor' };
    const authorizeMiddleware = authorize('editor');
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    // mockReq.user is not set
    const authorizeMiddleware = authorize(['admin']);
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not authenticated',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have any of the required roles (roles as array)', () => {
    mockReq.user = { _id: 'userId123', role: 'user' };
    const authorizeMiddleware = authorize(['admin', 'editor']);
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'You do not have permission to access this resource',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have the required role (roles as string)', () => {
    mockReq.user = { _id: 'userId123', role: 'user' };
    const authorizeMiddleware = authorize('admin');
    authorizeMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'You do not have permission to access this resource',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
