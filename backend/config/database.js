const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Variable for tracking if we're in a Jest test environment
const isJestTest = process.env.NODE_ENV === 'test' && process.env.JEST_WORKER_ID;

// Mock for MongoDB connection in Jest test environment
const mockMongoDBConnection = () => {
  // Return a mock of the Mongoose connection object
  return {
    connection: {
      name: 'mock-db-test',
      host: 'localhost',
      readyState: 1, // 1 = connected
      db: {
        collection: () => ({
          // Methods mocked for collections
          find: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockReturnThis(),
          deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId' }),
          updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
        })
      },
    },
    model: jest.fn().mockImplementation((modelName, schema) => {
      // Mock for basic Mongoose models
      return function(data) {
        this._id = 'mock_' + Math.random().toString(36).substring(7);
        this.save = jest.fn().mockResolvedValue(this);
        this.toObject = jest.fn().mockReturnValue(this);
        Object.assign(this, data);
        return this;
      };
    }),
  };
};

// Configuration for connecting to MongoDB
exports.connectDB = async () => {
  try {
    // If we're in a Jest test environment, use the mock instead of the real connection
    if (isJestTest) {
      console.log('Jest test environment detected, using mocked MongoDB connection');
      // Mock for Mongoose connection
      if (!mongoose.connection.readyState === 1) {
        // Mock Mongoose methods only if they haven't been mocked yet
        mongoose.connect = jest.fn();
        mongoose.connection = mockMongoDBConnection().connection;
      }
      return { connection: mongoose.connection };
    }
    
    // If we're not in a Jest test environment, use the real connection
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

// Function for performing database backup
exports.backupDatabase = async () => {
  try {
    // Create backup directory if it doesn't exist
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

// Function to clean old backups
const cleanOldBackups = (backupDir, keepLast) => {
  try {
    // Read all backup files
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

// Function to schedule daily backups
exports.scheduleBackups = () => {
  // Perform backup every 24 hours
  const backupInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // First backup after 1 hour of server startup
  setTimeout(() => {
    exports.backupDatabase();
    
    // Configure interval for subsequent backups
    setInterval(exports.backupDatabase, backupInterval);
  }, 60 * 60 * 1000); // 1 hour
  
  console.log('Backups automáticos programados');
};
