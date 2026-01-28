const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async findOne(filter) {
    const user = await db('users').where(filter).first();
    return user;
  },

  async findById(id) {
    return await db('users').where({ id }).first();
  },

  async create(userData) {
    const { username, email, password, role, active } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin',
      active: active !== undefined ? active : true
    }).returning('*');

    return newUser;
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  async update(id, updates) {
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const [updatedUser] = await db('users')
      .where({ id })
      .update(updates)
      .returning('*');

    return updatedUser;
  }
};

module.exports = User;
