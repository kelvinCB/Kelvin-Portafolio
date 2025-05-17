const Message = require('../models/Message');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

// Guardar un nuevo mensaje de contacto
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, message, honeypot } = req.body;

    // Protección anti-spam: honeypot
    if (honeypot && honeypot.trim() !== "") {
      return res.status(400).json({ 
        success: false,
        message: 'Detección de spam.' 
      });
    }

    // Validación básica de campos
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'El nombre es obligatorio.' 
      });
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'El email no es válido.' 
      });
    }
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'El mensaje es obligatorio.' 
      });
    }

    // Validación de teléfono (solo si se proporciona)
    if (phone && phone.trim() !== "") {
      const phoneDigits = phone.replace(/\D/g, '');
      const phoneSanitized = phone.trim();
      
      if (!/^[+]?\d[\d\s-]{6,}$/.test(phoneSanitized) || phoneDigits.length < 7 || phoneDigits.length > 15) {
        return res.status(400).json({ 
          success: false,
          message: 'El teléfono no es válido.' 
        });
      }
    }

    // Obtener IP y User-Agent para detectar spam/abusos
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Crear nuevo mensaje
    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      message,
      ipAddress,
      userAgent
    });

    await newMessage.save();

    return res.status(201).json({
      success: true,
      message: 'Mensaje recibido correctamente.'
    });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el mensaje.',
      error: error.message
    });
  }
};

// Obtener todos los mensajes con paginación y filtros
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Opciones de filtrado
    const filter = {};
    
    // Filtro por estado de lectura
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;
    
    // Filtro por estado destacado
    if (req.query.starred === 'true') filter.starred = true;
    if (req.query.starred === 'false') filter.starred = false;
    
    // Filtro por etiquetas
    if (req.query.tag) filter.tags = req.query.tag;
    
    // Filtro por texto (búsqueda)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex }
      ];
    }
    
    // Filtro por fecha
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
    
    // Ejecutar consulta con paginación
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Contar total para la paginación
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

// Obtener un mensaje específico por ID
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

// Marcar un mensaje como leído/no leído
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

// Destacar/quitar destacado de un mensaje
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

// Agregar o quitar etiquetas a un mensaje
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

// Eliminar un mensaje
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

// Exportar mensajes a CSV
exports.exportToCSV = async (req, res) => {
  try {
    // Filtros similares a getMessages
    const filter = {};
    
    // Aplicar filtros si se proporcionan
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
    
    // Obtener todos los mensajes que coincidan con el filtro
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    
    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay mensajes para exportar'
      });
    }
    
    // Configurar los campos para el CSV
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
    
    // Convertir a CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(messages);
    
    // Generar nombre de archivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `mensajes_${timestamp}.csv`;
    const filePath = path.join(__dirname, '..', 'exports', fileName);
    
    // Asegurar que el directorio de exportación existe
    const exportDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Guardar archivo
    fs.writeFileSync(filePath, csv);
    
    // Enviar archivo
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
      }
      
      // Eliminar archivo después de la descarga
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
