const Message = require('../models/Message');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const emailService = require('../utils/emailService');

// Save a new contact message
exports.createMessage = async (req, res) => {
  console.log(' [messageController] Recibida solicitud de contacto');
  
  try {
    // Extract form data
    const { name, email, phone = '', message, honeypot } = req.body;
    console.log(` [messageController] Mensaje recibido de: ${name} (${email})`);

    // Spam detection using honeypot
    if (honeypot && honeypot.trim() !== "") {
      console.log(' [messageController] Detección de spam por honeypot');
      return res.status(400).json({ success: false, message: 'Detección de spam.' });
    }

    // Basic field validation
    if (!name || !name.trim()) {
      console.warn(' [messageController] Validation failed: empty name');
      return res.status(400).json({ success: false, message: 'El nombre es obligatorio.' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.warn(' [messageController] Validation failed: invalid email');
      return res.status(400).json({ success: false, message: 'El email no es válido.' });
    }

    if (!message || !message.trim()) {
      console.warn(' [messageController] Validation failed: empty message');
      return res.status(400).json({ success: false, message: 'El mensaje es obligatorio.' });
    }

    // Get IP and User-Agent for spam detection
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create new message
    console.log('💾 [messageController] Creating new message record in the database');
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      date: new Date(),
      read: false
    });

    console.log('💾 [messageController] Guardando mensaje en la base de datos');
    const savedMessage = await newMessage.save();
    console.log(`✅ [messageController] Mensaje guardado con ID: ${savedMessage._id}`);

    // Try to send notification email
    const emailResult = await emailService.sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim()
    });

    // Register email sending result
    if (emailResult.success) {
      console.log(`✅ [messageController] Email enviado correctamente: ${emailResult.messageId}`);
    } else {
      console.warn(`⚠️ [messageController] No se pudo enviar el email: ${emailResult.error || 'Error desconocido'}`);
      // Register additional details for diagnosis but continue with the response
      if (emailResult.errorDetails) {
        console.error('📋 [messageController] Detalles del error de email:', JSON.stringify(emailResult.errorDetails));
      }
      console.log('📋 [messageController] Estado de la configuración del email:', JSON.stringify(emailResult.configStatus));
    }

    // Respond to client (always with success if the message was saved, even if the email fails)
    // This prevents the user from seeing errors even if the message was saved
    return res.status(201).json({ 
      success: true, 
      message: 'Mensaje recibido correctamente.' + (emailResult.success ? '' : ' La notificación por email podría retrasarse.'),
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('❌ [messageController] Error al crear mensaje:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al procesar el mensaje. Por favor, inténtalo de nuevo.' 
    });
  }
};

// Get all messages with pagination and filters
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    //  Filtering options
    const filter = {};
    
    // Filter by read status
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;
    
    // Filter by starred status
    if (req.query.starred === 'true') filter.starred = true;
    if (req.query.starred === 'false') filter.starred = false;
    
    // Filter by tag
    if (req.query.tag) filter.tags = req.query.tag;
    
    // Filter by text (search)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex }
      ];
    }
    
    // Filter by date
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        const dateTo = new Date(req.query.dateTo);
        dateTo.setHours(23, 59, 59, 999); // Hasta el final del día
        filter.createdAt.$lte = dateTo;
      }
    }
    
    // Execute query with pagination
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Count total for pagination
    const total = await Message.countDocuments(filter);
    
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
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error al obtener mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el mensaje.',
      error: error.message
    });
  }
};

// Mark a message as read/unread
exports.updateReadStatus = async (req, res) => {
  try {
    const { read } = req.body;
    
    if (read === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar el estado de lectura'
      });
    }
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error al actualizar estado de lectura:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de lectura.',
      error: error.message
    });
  }
};

// Mark a message as starred/unstarred
exports.updateStarredStatus = async (req, res) => {
  try {
    const { starred } = req.body;
    
    if (starred === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar el estado destacado'
      });
    }
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { starred },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error al actualizar estado destacado:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado destacado.',
      error: error.message
    });
  }
};

// Add or remove tags from a message
exports.updateTags = async (req, res) => {
  try {
    const { tags, action } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un array de etiquetas'
      });
    }
    
    let update;
    
    // Agregar o quitar etiquetas
    if (action === 'add') {
      update = { $addToSet: { tags: { $each: tags } } };
    } else if (action === 'remove') {
      update = { $pull: { tags: { $in: tags } } };
    } else if (action === 'set') {
      update = { $set: { tags } };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Acción no válida. Use "add", "remove" o "set"'
      });
    }
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error al actualizar etiquetas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar las etiquetas.',
      error: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Mensaje eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el mensaje.',
      error: error.message
    });
  }
};

// Export messages to CSV
exports.exportToCSV = async (req, res) => {
  try {
    // Filters similar to getMessages
    const filter = {};
    
    // Apply filters if provided
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;
    if (req.query.starred === 'true') filter.starred = true;
    if (req.query.starred === 'false') filter.starred = false;
    if (req.query.tag) filter.tags = req.query.tag;
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex }
      ];
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        const dateTo = new Date(req.query.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = dateTo;
      }
    }
    
    // Get all messages that match the filter
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    
    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay mensajes para exportar'
      });
    }
    
    // Configure fields for CSV
    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'Nombre', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Teléfono', value: 'phone' },
      { label: 'Mensaje', value: 'message' },
      { label: 'Leído', value: 'read' },
      { label: 'Destacado', value: 'starred' },
      { label: 'Etiquetas', value: (row) => row.tags.join(', ') },
      { label: 'Fecha', value: (row) => new Date(row.createdAt).toLocaleString() }
    ];
    
    // Convert to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(messages);
    
    // Generate file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `mensajes_${timestamp}.csv`;
    const filePath = path.join(__dirname, '..', 'exports', fileName);
    
    // Ensure export directory exists
    const exportDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Save file
    fs.writeFileSync(filePath, csv);
    
    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
      }
      
      // Delete file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error al exportar mensajes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al exportar los mensajes.',
      error: error.message
    });
  }
};
