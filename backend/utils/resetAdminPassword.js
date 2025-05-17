const User = require('../models/User');
require('dotenv').config();

/**
 * Restablece la contraseña del usuario administrador
 */
const resetAdminPassword = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el archivo .env');
      return;
    }

    // Buscar el usuario por email
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.error('Usuario administrador no encontrado:', adminEmail);
      return;
    }

    // Actualizar la contraseña
    admin.password = adminPassword;
    await admin.save();
    
    console.log('Contraseña de administrador restablecida exitosamente para:', adminEmail);
  } catch (error) {
    console.error('Error al restablecer la contraseña de administrador:', error);
  }
};

// Ejecutar la función
resetAdminPassword().then(() => {
  console.log('Proceso completado');
  process.exit(0);
}).catch(err => {
  console.error('Error en el proceso:', err);
  process.exit(1);
});
