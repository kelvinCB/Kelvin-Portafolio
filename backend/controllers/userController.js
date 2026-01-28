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

    // Verificar si el usuario ya existe (Knex refactor)
    const existingUser = await User.findOne(function () {
      this.where({ email }).orWhere({ username });
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya está registrado'
      });
    }

    // Crear nuevo usuario usando el modelo refactorizado
    await User.create({
      username,
      email,
      password,
      role: role || 'admin'
    });

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Falta email o contraseña'
      });
    }

    // Buscar usuario (En Postgres devuelve todos los campos, incluyendo password)
    const user = await User.findOne({ email });

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas o usuario inactivo'
      });
    }

    // Verificar contraseña usando el método del modelo
    const isMatch = await User.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar última conexión
    await User.update(user.id, { last_login: new Date() });

    // Generar token (Usando .id del objeto Postgres)
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('ERROR EN LOGIN:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener perfil del usuario actual (req.user viene del middleware auth)
exports.getProfile = async (req, res) => {
  try {
    // req.user ya está poblado por el middleware protect
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.last_login,
        createdAt: user.created_at
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
    const user = await User.findById(req.user.id);

    // Verificar contraseña actual
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña (el modelo se encarga del hashing)
    await User.update(user.id, { password: newPassword });

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
    // Usamos el driver directo de Knex para simplificar el listado sin password
    const db = require('../config/database');
    const users = await db('users').select('id', 'username', 'email', 'role', 'active', 'last_login', 'created_at');

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
