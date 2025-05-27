// Script to create the first admin user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Function to create admin user
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-contactos', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conectado a MongoDB');
    
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Ya existe un usuario administrador en el sistema');
      console.log('Usuario:', adminExists.username, '| Email:', adminExists.email);
      process.exit(0);
    }
    
    // Credentials for the initial admin
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456', // Change after first login
      role: 'admin',
      active: true
    };
    
    // Create the admin user
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

// Execute the function
createAdminUser();
