// Global application configuration

// API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Contact
export const CONTACT_PHONE = process.env.REACT_APP_CONTACT_PHONE || '18299698254';
export const DEFAULT_WHATSAPP_MESSAGE = process.env.REACT_APP_DEFAULT_WHATSAPP_MESSAGE || 'Hello, thank you for contacting us.';

// WhatsApp configurations (based on project memory)
export const WHATSAPP_CONFIG = {
  phoneNumber: '18299698254',
  message: 'Hello, I saw your portfolio and would like to talk with you',
  position: 'bottom-right'
};

// Pagination configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50]
};

// Themes and colors
export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

// Application routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MESSAGES: '/messages',
  MESSAGE_DETAIL: (id) => `/messages/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  EXPORT: '/export'
};

// Common texts and labels
export const LABELS = {
  appName: 'Admin Panel - Portfolio',
  dashboard: 'Dashboard',
  messages: 'Messages',
  unread: 'Unread',
  starred: 'Starred',
  profile: 'Profile',
  settings: 'Settings',
  export: 'Export',
  logout: 'Logout'
};
