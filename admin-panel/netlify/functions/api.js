const axios = require('axios');

// Backend URL (adjust according to the environment)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

exports.handler = async (event, context) => {
  // Configure CORS to allow requests from the frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  };

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  try {
    // Extract API path and other request data
    const path = event.path.replace('/.netlify/functions/api', '');
    const queryParams = event.queryStringParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Extract authorization headers
    let authHeader = event.headers.authorization || event.headers.Authorization;
    const requestHeaders = {};
    
    if (authHeader) {
      requestHeaders.Authorization = authHeader;
    }

    // Build the complete URL for the request to the backend
    const url = `${BACKEND_URL}${path}`;

    // Make the request to the API backend
    const response = await axios({
      method: event.httpMethod,
      url,
      headers: {
        ...requestHeaders,
        'Content-Type': 'application/json',
      },
      params: queryParams,
      data: body,
    });

    // Return the response to the client
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error in API proxy:', error);

    // Get the status code if available
    const statusCode = error.response ? error.response.status : 500;
    
    // Get error data if available
    const errorData = error.response ? error.response.data : { message: error.message };

    return {
      statusCode,
      headers,
      body: JSON.stringify(errorData),
    };
  }
};
