const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuración de la conexión a MongoDB
exports.connectDB = async () => {
  try {
    const dbURI = process.env.NODE_ENV === 'test' 
                  ? process.env.MONGODB_URI_TEST 
                  : process.env.MONGODB_URI;

    if (!dbURI) {
      console.error('Error: MONGODB_URI (or MONGODB_URI_TEST for test environment) is not defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(dbURI);

    console.log(`MongoDB conectado a: ${conn.connection.name} en host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Función para realizar backup de la base de datos
exports.backupDatabase = async () => {
  try {
    // Crear directorio de backups si no existe
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Nombre del archivo de backup con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `mongo-backup-${timestamp}.gz`;
    const backupPath = path.join(backupDir, backupFilename);

    // Comando mongodump para realizar el backup
    const dbName = process.env.DB_NAME || 'portfolio-contactos';
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    
    // Ejecutar mongodump
    const command = `mongodump --uri="${mongoUri}" --db=${dbName} --archive=${backupPath} --gzip`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al realizar backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Base de datos respaldada en: ${backupPath}`);

      // Eliminar backups antiguos (mantener solo los últimos 7)
      cleanOldBackups(backupDir, 7);
    });
  } catch (error) {
    console.error(`Error al iniciar el backup: ${error.message}`);
  }
};

// Función para limpiar backups antiguos
const cleanOldBackups = (backupDir, keepLast) => {
  try {
    // Leer todos los archivos de backup
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('mongo-backup-') && file.endsWith('.gz'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        created: fs.statSync(path.join(backupDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.created - a.created); // Ordenar por fecha (más reciente primero)

    // Eliminar los backups que excedan el número a mantener
    if (files.length > keepLast) {
      files.slice(keepLast).forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`Backup antiguo eliminado: ${file.name}`);
      });
    }
  } catch (error) {
    console.error(`Error al limpiar backups antiguos: ${error.message}`);
  }
};

// Programar backup diario
exports.scheduleBackups = () => {
  // Realizar backup cada 24 horas
  const backupInterval = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  
  // Primer backup después de 1 hora de iniciado el servidor
  setTimeout(() => {
    exports.backupDatabase();
    
    // Configurar el intervalo para los backups siguientes
    setInterval(exports.backupDatabase, backupInterval);
  }, 60 * 60 * 1000); // 1 hora
  
  console.log('Backups automáticos programados');
};
