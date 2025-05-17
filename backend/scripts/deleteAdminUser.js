// Script para eliminar el usuario administrador
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Función para eliminar usuario administrador
const deleteAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {});
    
    console.log('Conectado a MongoDB');
    
    // Buscar y eliminar el usuario admin por defecto
    const result = await User.deleteOne({ email: 'admin@example.com' });
    
    if (result.deletedCount > 0) {
      console.log('Usuario administrador eliminado con éxito');
    } else {
      console.log('No se encontró el usuario administrador para eliminar');
    }
    
    // Verificar si quedan usuarios admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`Usuarios administradores restantes: ${adminCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error al eliminar usuario administrador:', error.message);
    process.exit(1);
  }
};

// Ejecutar la función
deleteAdminUser();
