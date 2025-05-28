// Ultra-minimal Node.js HTTP server for contact form only
// No dependencies on Express or routing libraries to avoid path-to-regexp errors
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Simple function to parse JSON safely
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

// Helper to read the request body
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const bodyParts = [];
    req.on('data', (chunk) => {
      bodyParts.push(chunk);
    });
    req.on('end', () => {
      const body = Buffer.concat(bodyParts).toString();
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No content
    res.end();
    return;
  }
  
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', message: 'Contact API is running' }));
    return;
  }
  
  // Contact form endpoint
  if (req.method === 'POST' && req.url === '/contact') {
    try {
      // Read request body
      const body = await readRequestBody(req);
      const data = parseJSON(body);
      
      if (!data) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }));
        return;
      }
      
      console.log('Contact request received:', data);
      const { name, email, message, phone } = data;
      
      // Basic validation
      if (!name || !name.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Name is required.' }));
        return;
      }
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Email format is not valid.' }));
        return;
      }
      
      if (!message || !message.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Message is required.' }));
        return;
      }
      
      // Log the message
      console.log('Message details:', {
        name,
        email,
        phone: phone || 'Not provided',
        message,
        timestamp: new Date().toISOString()
      });
      
      // Return success response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Message received successfully.'
      }));
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: false, 
        message: 'An error occurred while processing your message.'
      }));
    }
    return;
  }
  
  // Handle not found
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: false, message: 'Not Found' }));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Ultra-minimal HTTP server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
