// Wrapper script to initialize environment variables before launching the main app
require('dotenv').config();
console.log('🚀 Starting backend application on Node.js:', process.version);
console.log('📡 Environment:', process.env.NODE_ENV || 'development');

// Verify critical environment variables are loaded
const criticalVars = ['PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET', 'FRONTEND_URL'];
const missingVars = criticalVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file or environment configuration (PostgreSQL expected)');
  process.exit(1);
}

// All is good, launch the main application
console.log('✅ Environment properly configured, launching application...');
require('./index.js');
