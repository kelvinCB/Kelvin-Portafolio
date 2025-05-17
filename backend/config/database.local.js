/**
 * Configuración alternativa para usar MongoDB local en lugar de Atlas
 * 
 * Instrucciones:
 * 1. Asegúrate de tener MongoDB instalado localmente
 * 2. MongoDB debe estar corriendo en localhost:27017
 * 3. Usa este archivo para pruebas locales
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Base de datos local en lugar de Atlas
const connectDB = async () => {
  try {
    // Utiliza la base de datos local
    const localDB = 'mongodb://localhost:27017/portfolio-contactos';
    
    await mongoose.connect(localDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB local conectado en localhost:27017');
    return mongoose.connection;
  } catch (error) {
    console.error('Error al conectar con MongoDB local:', error.message);
    process.exit(1);
  }
};

// Función para programar backups (simulada para entorno local)
const scheduleBackups = () => {
  console.log('Backups automáticos simulados para entorno local');
  // Aquí no realizamos backups reales en el entorno local
};

module.exports = {
  connectDB,
  scheduleBackups
};
