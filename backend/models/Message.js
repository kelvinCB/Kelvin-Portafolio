const mongoose = require('mongoose');
const crypto = require('crypto-js');

// Function to encrypt sensitive data
function encrypt(text) {
  if (!text) return text;
  const SECRET_KEY = process.env.ENCRYPTION_KEY || 'my_temporary_secret_key';
  return crypto.AES.encrypt(text, SECRET_KEY).toString();
}

// Function to decrypt data
function decrypt(ciphertext) {
  if (!ciphertext) return ciphertext;
  const SECRET_KEY = process.env.ENCRYPTION_KEY || 'my_temporary_secret_key';
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

// Indexes for efficient search and pagination
messageSchema.index({ createdAt: -1 });
messageSchema.index({ read: 1 });
messageSchema.index({ starred: 1 });
messageSchema.index({ tags: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
