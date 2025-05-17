const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Configuración de rate limit para prevenir ataques de fuerza bruta
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde.'
    });
  }
});

// Limitador más estricto para rutas sensibles (login, registro)
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // límite de 10 intentos por hora
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Demasiados intentos, por favor intenta de nuevo más tarde.'
    });
  }
});

// Limitador para el formulario de contacto
exports.contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 mensajes por hora desde la misma IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Has enviado demasiados mensajes. Por favor, espera antes de enviar otro.'
    });
  }
});

// Middleware para sanitizar datos y prevenir inyección NoSQL
exports.sanitize = mongoSanitize();

// Middleware para añadir headers de seguridad
exports.secureHeaders = helmet({
  contentSecurityPolicy: false, // Deshabilitado para desarrollo, habilitar en producción
  crossOriginEmbedderPolicy: false // Para permitir cargar recursos de otras fuentes
});
