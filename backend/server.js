// Minimal Express server for the contact form only
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(express.json());

// Set up CORS with more detailed configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for now to debug the issue
    // In production, you would restrict this to specific domains
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Contact API is running' });
});

// Contact endpoint (the only one we need)
app.post('/contact', async (req, res) => {
  try {
    console.log('Contact request received:', req.body);
    const { name, email, message, phone } = req.body;
    
    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Email format is not valid.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }
    
    // Log the message instead of saving to database
    console.log('Message details:', {
      name,
      email,
      phone: phone || 'Not provided',
      message,
      timestamp: new Date().toISOString()
    });
    
    // Return success response
    res.status(200).json({ 
      success: true,
      message: 'Message received successfully.' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your message.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Minimal contact server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
