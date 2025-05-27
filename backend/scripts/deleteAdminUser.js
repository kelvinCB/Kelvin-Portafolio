// Script to delete the admin user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Function to delete admin user
const deleteAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {});
    
    console.log('Conectado a MongoDB');
    
    // Find and delete the default admin user
    const result = await User.deleteOne({ email: 'admin@example.com' });
    
    if (result.deletedCount > 0) {
      console.log('Usuario administrador eliminado con éxito');
    } else {
      console.log('No se encontró el usuario administrador para eliminar');
    }
    
    // Check if there are any admin users left
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`Usuarios administradores restantes: ${adminCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error al eliminar usuario administrador:', error.message);
    process.exit(1);
  }
};

// Execute the function
deleteAdminUser();
