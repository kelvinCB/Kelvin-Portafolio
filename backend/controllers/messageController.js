const Message = require('../models/Message');
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const emailService = require('../utils/emailService');

// Save a new contact message
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone = '', message, honeypot } = req.body;

    if (honeypot && honeypot.trim() !== "") {
      return res.status(400).json({ success: false, message: 'Detección de spam.' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'El nombre es obligatorio.' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'El email no es válido.' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'El mensaje es obligatorio.' });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create new message using refactored model
    const savedMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      read: false
    });

    // Try to send notification email
    const emailResult = await emailService.sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Mensaje recibido correctamente.' + (emailResult.success ? '' : ' La notificación por email podría retrasarse.'),
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Error al crear mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el mensaje. Por favor, inténtalo de nuevo.'
    });
  }
};

// Get all messages with pagination and filters (Refactorizado para Knex)
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = db('messages');

    // Filtering options
    if (req.query.read === 'true') query = query.where('read', true);
    if (req.query.read === 'false') query = query.where('read', false);
    if (req.query.starred === 'true') query = query.where('starred', true);
    if (req.query.starred === 'false') query = query.where('starred', false);

    // Filter by tag (en Postgres tags es un array)
    if (req.query.tag) {
      query = query.whereRaw('? = ANY(tags)', [req.query.tag]);
    }

    // Filter by text (search) - SQL LIKE
    if (req.query.search) {
      const search = `%${req.query.search}%`;
      query = query.where(function () {
        this.where('name', 'ILIKE', search)
          .orWhere('email', 'ILIKE', search) // Note: Email is encrypted in DB, search might not work on encrypted fields
          .orWhere('phone', 'ILIKE', search) // Same here
          .orWhere('message', 'ILIKE', search);
      });
    }

    // Filter by date
    if (req.query.dateFrom) {
      query = query.where('created_at', '>=', new Date(req.query.dateFrom));
    }
    if (req.query.dateTo) {
      const dateTo = new Date(req.query.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      query = query.where('created_at', '<=', dateTo);
    }

    // Count total for pagination
    const totalResult = await query.clone().count('id as count').first();
    const total = parseInt(totalResult.count);

    // Execute query with pagination and sort
    const rows = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const messages = rows.map(row => Message._processMessage(row));

    return res.status(200).json({
      success: true,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      count: messages.length,
      total,
      data: messages
    });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los mensajes.',
      error: error.message
    });
  }
};

// Get a specific message by ID
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('Error al obtener mensaje:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener el mensaje.' });
  }
};

// Update status (Read/Starred)
exports.updateReadStatus = async (req, res) => {
  try {
    const { read } = req.body;
    const message = await Message.update(req.params.id, { read });
    if (!message) return res.status(404).json({ success: false, message: 'No encontrado' });
    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error de servidor' });
  }
};

exports.updateStarredStatus = async (req, res) => {
  try {
    const { starred } = req.body;
    const message = await Message.update(req.params.id, { starred });
    if (!message) return res.status(404).json({ success: false, message: 'No encontrado' });
    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error de servidor' });
  }
};

// Add or remove tags
exports.updateTags = async (req, res) => {
  try {
    const { tags, action } = req.body;
    const currentMsg = await db('messages').where({ id: req.params.id }).first();

    if (!currentMsg) return res.status(404).json({ success: false, message: 'No encontrado' });

    let newTags = currentMsg.tags || [];

    if (action === 'add') {
      newTags = [...new Set([...newTags, ...tags])];
    } else if (action === 'remove') {
      newTags = newTags.filter(t => !tags.includes(t));
    } else if (action === 'set') {
      newTags = tags;
    }

    const updated = await Message.update(req.params.id, { tags: newTags });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar etiquetas' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    return res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};

// Export to CSV (Refactorizado)
exports.exportToCSV = async (req, res) => {
  try {
    let query = db('messages');

    // Apply same filters
    if (req.query.read === 'true') query = query.where('read', true);
    if (req.query.read === 'false') query = query.where('read', false);
    if (req.query.starred === 'true') query = query.where('starred', true);
    if (req.query.starred === 'false') query = query.where('starred', false);
    if (req.query.tag) query = query.whereRaw('? = ANY(tags)', [req.query.tag]);

    const rows = await query.orderBy('created_at', 'desc');
    const messages = rows.map(row => Message._processMessage(row));

    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: 'No hay datos para exportar' });
    }

    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Nombre', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Teléfono', value: 'phone' },
      { label: 'Mensaje', value: 'message' },
      { label: 'Leído', value: 'read' },
      { label: 'Destacado', value: 'starred' },
      { label: 'Etiquetas', value: (row) => (row.tags || []).join(', ') },
      { label: 'Fecha', value: (row) => new Date(row.created_at).toLocaleString() }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(messages);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `mensajes_${timestamp}.csv`;
    const exportDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, fileName);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, fileName, (err) => {
      if (!err) fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error al exportar:', error);
    return res.status(500).json({ success: false, message: 'Error al exportar' });
  }
};
