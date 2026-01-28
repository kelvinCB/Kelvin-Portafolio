const User = require('../models/User');
require('dotenv').config();

/**
 * Create an admin user if it doesn't exist (Refactorizado para PostgreSQL)
 */
const setupAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('⚠️ ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el archivo .env');
      return;
    }

    // Verificar si ya existe usando el modelo refactorizado (Knex)
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Usuario administrador ya existe:', adminEmail);
      return;
    }

    // Crear el usuario administrador
    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      active: true
    });

    console.log('✅ Usuario administrador creado exitosamente:', adminEmail);
  } catch (error) {
    if (error.code === '42P01') {
      console.error('⚠️ Las tablas aún no han sido creadas. Ejecuta "node scripts/init-db.js" en el VPS.');
    } else {
      console.error('❌ Error al configurar usuario administrador:', error.message);
    }
  }
};

module.exports = setupAdmin;
