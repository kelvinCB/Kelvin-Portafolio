// The simplest possible Node.js HTTP server with CORS support
const http = require('http');

const PORT = process.env.PORT || 5000;

// Read request body helper
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Create server
http.createServer(async (req, res) => {
  // Log the request
  console.log(`${req.method} ${req.url}`);
  
  // CORS Headers - Allow any origin to help with debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only handle /contact endpoint
  if (req.url === '/contact' && req.method === 'POST') {
    try {
      const data = await readBody(req);
      console.log('Received data:', data);
      
      // Validate inputs
      if (!data.name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Name is required.' }));
        return;
      }
      
      if (!data.email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Email is required.' }));
        return;
      }
      
      if (!data.message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Message is required.' }));
        return;
      }
      
      // Log the submission
      console.log('Form submission received:', {
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: new Date().toISOString()
      });
      
      // Return success
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Message received successfully.'
      }));
    } catch (err) {
      console.error('Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Server error processing request.'
      }));
    }
    return;
  }
  
  // Health check endpoint
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Server is running' }));
    return;
  }
  
  // Not found for everything else
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Not found' }));
  
}).listen(PORT, () => {
  console.log(`Super simple server running on port ${PORT}`);
  console.log(`CORS is enabled for all origins (*)`);
});
