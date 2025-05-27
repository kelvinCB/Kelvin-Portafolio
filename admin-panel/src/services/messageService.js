import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all messages with pagination and filters
export const getMessages = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/messages`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Get a specific message by ID
export const getMessage = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting message with ID ${id}:`, error);
    throw error;
  }
};

// Mark a message as read/unread
export const updateReadStatus = async (id, read) => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/read`, { read });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating read status of message ${id}:`, error);
    throw error;
  }
};

// Mark a message as starred/unstarred
export const updateStarredStatus = async (id, starred) => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/star`, { starred });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating starred status of message ${id}:`, error);
    throw error;
  }
};

// Manage message tags
export const updateTags = async (id, tags, action = 'add') => {
  try {
    const response = await axios.patch(`${API_URL}/messages/${id}/tags`, { 
      tags, 
      action // 'add', 'remove', or 'set'
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating tags of message ${id}:`, error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/messages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw error;
  }
};

// Get export URL for CSV
export const getExportUrl = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return `${API_URL}/messages/export${queryParams ? `?${queryParams}` : ''}`;
};

// Export messages to CSV (direct download)
export const exportMessagesToCSV = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/messages/export`, {
      params,
      responseType: 'blob' // Important for downloading files
    });
    
    // Create URL for the downloaded blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `messages_${date}.csv`);
    
    // Add to DOM, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting messages to CSV:', error);
    throw error;
  }
};
