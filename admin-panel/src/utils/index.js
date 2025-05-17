import * as config from './config';

// Formatear fechas
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

// Formatear teléfono para enlace de WhatsApp
export const formatWhatsAppLink = (phone, message) => {
  const cleanPhone = phone?.replace(/\D/g, '') || config.WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || config.WHATSAPP_CONFIG.message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Función para truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Formatear URL de correo electrónico
export const formatEmailLink = (email, subject, body) => {
  const encodedSubject = encodeURIComponent(subject || 'RE: Mensaje del portafolio');
  const encodedBody = encodeURIComponent(body || 'Gracias por contactar con nosotros.');
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

// Exportar configuración
export { config };
