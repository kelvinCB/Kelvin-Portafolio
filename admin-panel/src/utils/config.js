// Configuración global de la aplicación

// API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Contacto
export const CONTACT_PHONE = process.env.REACT_APP_CONTACT_PHONE || '18299698254';
export const DEFAULT_WHATSAPP_MESSAGE = process.env.REACT_APP_DEFAULT_WHATSAPP_MESSAGE || 'Hola, gracias por contactar con nosotros.';

// Configuraciones de WhatsApp (basado en memoria del proyecto)
export const WHATSAPP_CONFIG = {
  phoneNumber: '18299698254',
  message: 'Hola, vi tu portafolio y me gustaria hablar contigo',
  position: 'bottom-right'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50]
};

// Temas y colores
export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MESSAGES: '/messages',
  MESSAGE_DETAIL: (id) => `/messages/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  EXPORT: '/export'
};

// Textos y etiquetas comunes
export const LABELS = {
  appName: 'Panel de Administración - Portafolio',
  dashboard: 'Dashboard',
  messages: 'Mensajes',
  unread: 'No leídos',
  starred: 'Destacados',
  profile: 'Perfil',
  settings: 'Configuración',
  export: 'Exportar',
  logout: 'Cerrar sesión'
};
