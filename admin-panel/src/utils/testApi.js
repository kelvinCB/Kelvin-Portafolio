import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Function that attempts a simple request to the backend
const testApiConnection = async () => {
  try {
    console.log('Testing API connection at:', API_URL);
    
    // Configure corsOptions in headers
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: false
    };
    
    // Attempt login with known credentials
    const response = await axios.post(
      `${API_URL}/users/login`, 
      { 
        email: 'kelvinc0219@gmail.com', 
        password: 'kelvin123456' 
      },
      options
    );
    
    console.log('Successful connection:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error connecting to the API:', error);
    console.error('Details:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response from server',
      request: error.request ? 'Request sent but no response' : 'Error before sending request'
    });
    
    return {
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    };
  }
};

export { testApiConnection };
