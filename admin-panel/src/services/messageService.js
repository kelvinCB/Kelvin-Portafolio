import axios from 'axios';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Obtener todos los mensajes con paginación y filtros
export const getMessages = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/messages`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
};

// Obtener un mensaje específico por ID
export const getMessage = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener el mensaje con ID ${id}:`, error);
    throw error;
  }
};

// Marcar un mensaje como leído/no leído
export const updateReadStatus = async (id, read) => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/read`, { read });
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar estado de lectura del mensaje ${id}:`, error);
    throw error;
  }
};

// Marcar un mensaje como destacado/no destacado
export const updateStarredStatus = async (id, starred) => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/star`, { starred });
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar estado destacado del mensaje ${id}:`, error);
    throw error;
  }
};

// Gestionar etiquetas de un mensaje
export const updateTags = async (id, tags, action = 'add') => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/tags`, { 
      tags, 
      action // 'add', 'remove', o 'set'
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar etiquetas del mensaje ${id}:`, error);
    throw error;
  }
};

// Eliminar un mensaje
export const deleteMessage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el mensaje ${id}:`, error);
    throw error;
  }
};

// Obtener URL para exportar mensajes a CSV
export const getExportUrl = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return `${API_URL}/messages/export${queryParams ? `?${queryParams}` : ''}`;
};

// Exportar mensajes a CSV (descarga directa)
export const exportMessagesToCSV = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/messages/export`, {
      params,
      responseType: 'blob' // Importante para descargar archivos
    });
    
    // Crear URL para el blob descargado
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Crear link para descargar
    const link = document.createElement('a');
    link.href = url;
    
    // Generar nombre de archivo con fecha actual
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `mensajes_${date}.csv`);
    
    // Añadir al DOM, hacer clic y limpiar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error al exportar mensajes a CSV:', error);
    throw error;
  }
};
