// Script para crear el primer usuario administrador
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Función para crear usuario administrador
const createAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-contactos', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conectado a MongoDB');
    
    // Verificar si ya existe algún usuario admin
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Ya existe un usuario administrador en el sistema');
      console.log('Usuario:', adminExists.username, '| Email:', adminExists.email);
      process.exit(0);
    }
    
    // Credenciales para el admin inicial
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456', // Cambiar después del primer inicio de sesión
      role: 'admin',
      active: true
    };
    
    // Crear el usuario admin
    const admin = new User(adminData);
    await admin.save();
    
    console.log('¡Usuario administrador creado con éxito!');
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123456');
    console.log('IMPORTANTE: Cambia esta contraseña después del primer inicio de sesión.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
};

// Ejecutar la función
createAdminUser();
