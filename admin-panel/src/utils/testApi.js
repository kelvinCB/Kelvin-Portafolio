import axios from 'axios';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Función que intenta una petición simple al backend
const testApiConnection = async () => {
  try {
    console.log('Probando conexión a la API en:', API_URL);
    
    // Configurar corsOptions en las cabeceras
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: false
    };
    
    // Intentar login con credenciales conocidas
    const response = await axios.post(
      `${API_URL}/users/login`, 
      { 
        email: 'kelvinc0219@gmail.com', 
        password: 'kelvin123456' 
      },
      options
    );
    
    console.log('Conexión exitosa:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    console.error('Detalles:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'Sin respuesta del servidor',
      request: error.request ? 'Solicitud enviada pero sin respuesta' : 'Error antes de enviar la solicitud'
    });
    
    return {
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    };
  }
};

export { testApiConnection };
