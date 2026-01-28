const User = require('../models/User');
const db = require('../config/database');
require('dotenv').config();

/**
 * Script to delete the admin user (Refactored for PostgreSQL)
 */
const deleteAdminUser = async () => {
  try {
    console.log('🚀 Conectando a PostgreSQL para eliminar usuario...');

    const emailToDelete = process.env.ADMIN_EMAIL || 'admin@example.com';

    // Find user first
    const user = await User.findOne({ email: emailToDelete });

    if (!user) {
      console.log(`ℹ️ No se encontró el usuario administrador con email: ${emailToDelete}`);
    } else {
      // Delete using Knex
      await db('users').where({ id: user.id }).del();
      console.log(`✅ Usuario administrador (${emailToDelete}) eliminado con éxito`);
    }

    // Check remaining admins
    const result = await db('users').where({ role: 'admin' }).count('id as count').first();
    console.log(`📊 Usuarios administradores restantes: ${result.count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al eliminar usuario administrador:', error.message);
    process.exit(1);
  }
};

deleteAdminUser();
