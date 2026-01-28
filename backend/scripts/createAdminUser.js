const User = require('../models/User');
const db = require('../config/database');
require('dotenv').config();

/**
 * Script to create the first admin user (Refactored for PostgreSQL)
 */
const createAdminUser = async () => {
  try {
    console.log('🚀 Iniciando creación de usuario administrador...');

    // Wait for DB initialization (just in case)
    await db.raw('SELECT 1');

    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('ℹ️ Ya existe un usuario administrador en el sistema');
      console.log(`👤 Usuario: ${adminExists.username} | Email: ${adminExists.email}`);
      process.exit(0);
    }

    // Credentials for the initial admin
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      active: true
    };

    // Create the admin user (User.create handles hashing)
    await User.create(adminData);

    console.log('✅ ¡Usuario administrador creado con éxito!');
    console.log(`📌 Username: ${adminData.username}`);
    console.log(`📌 Email: ${adminData.email}`);
    console.log('📌 Password: (el que definiste en tu .env)');

    process.exit(0);
  } catch (error) {
    if (error.code === '42P01') {
      console.error('❌ ERROR: La tabla "users" no existe. Ejecuta "node scripts/init-db.js" primero.');
    } else {
      console.error('❌ Error al crear usuario administrador:', error.message);
    }
    process.exit(1);
  }
};

createAdminUser();
