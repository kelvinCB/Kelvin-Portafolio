const knex = require('knex');
require('dotenv').config();

const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn, done) => {
      console.log('📦 Nueva conexión establecida con PostgreSQL');
      done();
    }
  },
  acquireConnectionTimeout: 10000
};

const db = knex(dbConfig);

// Función para probar la conexión inmediatamente
async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Conexión a PostgreSQL establecida exitosamente.');
  } catch (err) {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

testConnection();

module.exports = db;
