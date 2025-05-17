const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Obtener token del header "Authorization"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_jwt_secret_temporal');
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o usuario desactivado' 
      });
    }
    
    // Adjuntar el usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

// Middleware para verificar roles
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autenticado' 
      });
    }
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (roleArray.length > 0 && !roleArray.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para acceder a este recurso' 
      });
    }
    
    next();
  };
};
