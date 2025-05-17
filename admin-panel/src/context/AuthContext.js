import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar el interceptor de Axios para incluir el token en las peticiones
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar el token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        // Verificar si el token ha expirado
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expirado
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        } else {
          // Token válido, obtener información del usuario
          const response = await axios.get(`${API_URL}/users/profile`);
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error('Error al verificar el token:', err);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setError('Error de autenticación. Por favor, inicia sesión de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      
      const { token: newToken, user } = response.data;
      
      // Guardar el token en localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(
        err.response?.data?.message || 
        'Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Función para cambiar la contraseña
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.put(`${API_URL}/users/password`, { 
        currentPassword, 
        newPassword 
      });
      return true;
    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);
      setError(
        err.response?.data?.message || 
        'Error al cambiar la contraseña. Verifica la contraseña actual e intenta de nuevo.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    logout,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
