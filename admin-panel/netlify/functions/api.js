const axios = require('axios');

// URL del backend (ajustar según el entorno)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

exports.handler = async (event, context) => {
  // Configurar CORS para permitir solicitudes del frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  };

  // Manejar solicitudes preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  try {
    // Extraer el path de la API y otros datos de la solicitud
    const path = event.path.replace('/.netlify/functions/api', '');
    const queryParams = event.queryStringParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Extraer headers de autorización
    let authHeader = event.headers.authorization || event.headers.Authorization;
    const requestHeaders = {};
    
    if (authHeader) {
      requestHeaders.Authorization = authHeader;
    }

    // Construir la URL completa para la solicitud al backend
    const url = `${BACKEND_URL}${path}`;

    // Hacer la solicitud a la API backend
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

    // Devolver la respuesta al cliente
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error en proxy de API:', error);

    // Obtener el código de estado si está disponible
    const statusCode = error.response ? error.response.status : 500;
    
    // Obtener los datos de error si están disponibles
    const errorData = error.response ? error.response.data : { message: error.message };

    return {
      statusCode,
      headers,
      body: JSON.stringify(errorData),
    };
  }
};
