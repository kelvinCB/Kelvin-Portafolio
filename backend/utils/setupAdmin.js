const User = require('../models/User');
require('dotenv').config();

/**
 * Crea un usuario administrador inicial si no existe
 */
const setupAdmin = async () => {
  try {
    // Comprueba si existe un usuario administrador con el email definido en el archivo .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el archivo .env');
      return;
    }

    // Verifica si ya existe
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Usuario administrador ya existe:', adminEmail);
      return;
    }

    // Crea el usuario administrador
    const admin = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      active: true
    });

    await admin.save();
    console.log('Usuario administrador creado exitosamente:', adminEmail);
  } catch (error) {
    console.error('Error al configurar usuario administrador:', error);
  }
};

module.exports = setupAdmin;
