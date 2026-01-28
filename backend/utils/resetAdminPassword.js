const User = require('../models/User');
const db = require('../config/database');
require('dotenv').config();

/**
 * Restablece la contraseña del usuario administrador (Refactored for PostgreSQL)
 */
const resetAdminPassword = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ ERROR: ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el archivo .env');
      return;
    }

    // Find the user by email (using refactored User model)
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.error('❌ ERROR: Usuario administrador no encontrado:', adminEmail);
      return;
    }

    // Update the password using the model's update method (which handles hashing)
    await User.update(admin.id, { password: adminPassword });

    console.log('✅ ÉXITO: Contraseña de administrador restablecida para:', adminEmail);
  } catch (error) {
    console.error('❌ ERROR al restablecer la contraseña:', error.message);
  } finally {
    // Ensure we close the DB connection
    process.exit(0);
  }
};

resetAdminPassword();
