const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'mi_jwt_secret_temporal',
    { expiresIn: '24h' }
  );
};

// Registrar un nuevo usuario (solo admins pueden crear nuevos usuarios)
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password,
      role: role || 'admin'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error.message
    });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    console.log('INICIO DE SESIÓN: Recibida solicitud de login');
    console.log('BODY:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('ERROR: Falta email o password en la solicitud');
      return res.status(400).json({
        success: false,
        message: 'Falta email o contraseña'
      });
    }
    
    console.log('BUSCANDO USUARIO:', email);
    
    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');
    console.log('USUARIO ENCONTRADO:', user ? 'SI' : 'NO');
    
    if (!user || !user.active) {
      console.log('ERROR: Usuario no encontrado o inactivo');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas o usuario inactivo'
      });
    }

    console.log('VERIFICANDO CONTRASEÑA');
    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    console.log('CONTRASEÑA CORRECTA:', isMatch ? 'SI' : 'NO');
    
    if (!isMatch) {
      console.log('ERROR: Contraseña incorrecta');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar última conexión
    console.log('ACTUALIZANDO ÚLTIMA CONEXIÓN');
    user.lastLogin = Date.now();
    await user.save();

    // Generar token
    console.log('GENERANDO TOKEN');
    const token = generateToken(user._id);

    console.log('LOGIN EXITOSO');
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('ERROR EN LOGIN:', error);
    console.error('STACK:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener perfil del usuario actual
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message
    });
  }
};

// Actualizar contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la contraseña',
      error: error.message
    });
  }
};

// Obtener lista de usuarios (solo para admins)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de usuarios',
      error: error.message
    });
  }
};
