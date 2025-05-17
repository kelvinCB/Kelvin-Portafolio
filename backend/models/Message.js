const mongoose = require('mongoose');
const crypto = require('crypto-js');

// Función para encriptar datos sensibles
function encrypt(text) {
  if (!text) return text;
  const SECRET_KEY = process.env.ENCRYPTION_KEY || 'mi_clave_secreta_temporal';
  return crypto.AES.encrypt(text, SECRET_KEY).toString();
}

// Función para desencriptar datos
function decrypt(ciphertext) {
  if (!ciphertext) return ciphertext;
  const SECRET_KEY = process.env.ENCRYPTION_KEY || 'mi_clave_secreta_temporal';
  const bytes = crypto.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

const messageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    set: encrypt,
    get: decrypt
  },
  phone: { 
    type: String,
    set: encrypt,
    get: decrypt
  },
  message: { 
    type: String, 
    required: true,
    set: encrypt,
    get: decrypt
  },
  ipAddress: {
    type: String,
    set: encrypt,
    get: decrypt
  },
  userAgent: String,
  read: { 
    type: Boolean, 
    default: false 
  },
  starred: { 
    type: Boolean, 
    default: false 
  },
  tags: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Índices para búsqueda y paginación eficiente
messageSchema.index({ createdAt: -1 });
messageSchema.index({ read: 1 });
messageSchema.index({ starred: 1 });
messageSchema.index({ tags: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
