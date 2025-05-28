// Ultra-minimal Node.js HTTP server for contact form only
// No dependencies on Express or routing libraries to avoid path-to-regexp errors
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Explicitly allow the Netlify origin
const ALLOWED_ORIGINS = [
  'https://kelvin-portafolio.netlify.app',
  'http://localhost:3000'
];

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

// CORS handler function
function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;
  console.log('Request from origin:', requestOrigin);
  
  // Set CORS headers
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  } else {
    // Fallback to the first allowed origin if origin not in allowed list
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // For preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true; // Return true to indicate the response has been sent
  }
  return false; // Return false to indicate the response has not been sent
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Log all requests
  console.log(`${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  
  // Handle CORS preflight requests first
  if (setCorsHeaders(req, res)) {
    return; // Response already sent for OPTIONS
  }
  
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Contact API is running' }));
    return;
  }
  
  // Contact form endpoint
  if (req.method === 'POST' && req.url === '/contact') {
    try {
      // Read request body
      const body = await readRequestBody(req);
      console.log('Received body:', body);
      const data = parseJSON(body);
      
      if (!data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }));
        return;
      }
      
      console.log('Contact request received:', data);
      const { name, email, message, phone } = data;
      
      // Basic validation
      if (!name || !name.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Name is required.' }));
        return;
      }
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Email format is not valid.' }));
        return;
      }
      
      if (!message || !message.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
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
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Message received successfully.'
      }));
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        message: 'An error occurred while processing your message.'
      }));
    }
    return;
  }
  
  // Handle not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Not Found' }));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Ultra-minimal HTTP server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
