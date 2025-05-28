// Simple Express server for Render deployment
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Simple routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend API is running', 
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Import user routes (without the problematic routes)
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Simple login route
app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    console.log(`User ${email} logged in successfully`);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simple message listing route with authentication
app.get('/api/messages', async (req, res) => {
  try {
    // Basic authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get messages from database
    const Message = require('./models/Message');
    const messages = await Message.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    
    // Basic validation
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required.' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Email format is not valid.' });
    if (!message || !message.trim()) return res.status(400).json({ message: 'Message is required.' });
    
    // Save to database if Message model exists
    try {
      const Message = require('./models/Message');
      const newMessage = new Message({
        name,
        email,
        phone: phone || '',
        message,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });
      
      await newMessage.save();
      console.log('Message saved with ID:', newMessage._id);
    } catch (dbError) {
      console.error('Error saving message to database:', dbError);
      // Continue even if DB save fails
    }
    
    // Return success response
    res.status(200).json({ message: 'Message received successfully.' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ message: 'An error occurred while processing your message.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
