const db = require('../config/database');
const crypto = require('crypto-js');

// Helper to encrypt sensitive data
function encrypt(text) {
  if (!text) return text;
  const SECRET_KEY = process.env.ENCRYPTION_KEY || 'my_temporary_secret_key';
  return crypto.AES.encrypt(text, SECRET_KEY).toString();
}

// Helper to decrypt data
function decrypt(ciphertext) {
  if (!ciphertext) return ciphertext;
  try {
    const SECRET_KEY = process.env.ENCRYPTION_KEY || 'my_temporary_secret_key';
    const bytes = crypto.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(crypto.enc.Utf8);
    return decrypted || ciphertext; // Fallback if decryption fails
  } catch (e) {
    return ciphertext;
  }
}

const Message = {
  async create(data) {
    const { name, email, phone, message, ipAddress, userAgent, tags } = data;

    const [newMessage] = await db('messages').insert({
      name,
      email: encrypt(email),
      phone: encrypt(phone),
      message: encrypt(message),
      ip_address: encrypt(ipAddress),
      user_agent: userAgent,
      tags: tags || [],
    }).returning('*');

    return this._processMessage(newMessage);
  },

  async find(filter = {}, sort = { created_at: 'desc' }, limit = 50, offset = 0) {
    const rows = await db('messages')
      .where(filter)
      .orderBy(Object.keys(sort)[0], Object.values(sort)[0])
      .limit(limit)
      .offset(offset);

    return rows.map(row => this._processMessage(row));
  },

  async findById(id) {
    const row = await db('messages').where({ id }).first();
    return row ? this._processMessage(row) : null;
  },

  async count(filter = {}) {
    const result = await db('messages').where(filter).count('id as count').first();
    return parseInt(result.count);
  },

  async update(id, updates) {
    const [updatedRow] = await db('messages')
      .where({ id })
      .update(updates)
      .returning('*');

    return updatedRow ? this._processMessage(updatedRow) : null;
  },

  async delete(id) {
    return await db('messages').where({ id }).del();
  },

  // Helper to decrypt fields before returning to controller
  _processMessage(msg) {
    if (!msg) return msg;
    return {
      ...msg,
      email: decrypt(msg.email),
      phone: decrypt(msg.phone),
      message: decrypt(msg.message),
      ipAddress: decrypt(msg.ip_address)
    };
  }
};

module.exports = Message;
