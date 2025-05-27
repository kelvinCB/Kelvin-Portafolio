import * as config from './config';

// Format dates
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

// Format phone for WhatsApp link
export const formatWhatsAppLink = (phone, message) => {
  const cleanPhone = phone?.replace(/\D/g, '') || config.WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || config.WHATSAPP_CONFIG.message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Function to truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Format email URL
export const formatEmailLink = (email, subject, body) => {
  const encodedSubject = encodeURIComponent(subject || 'RE: Portfolio message');
  const encodedBody = encodeURIComponent(body || 'Thank you for contacting us.');
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

// Export configuration
export { config };
