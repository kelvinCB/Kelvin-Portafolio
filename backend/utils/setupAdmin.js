const User = require('../models/User');
require('dotenv').config();

/**
 * Create an admin user if it doesn't exist
 */
const setupAdmin = async () => {
  try {
    // Check if there is an admin user with the email defined in the .env file
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el archivo .env');
      return;
    }

    // Verify if it already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Usuario administrador ya existe:', adminEmail);
      return;
    }

    // Create the admin user
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
