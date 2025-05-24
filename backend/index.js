// backend/index.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importación de utilidades y configuraciones
require('dotenv').config();
const { connectDB, scheduleBackups } = require('./config/database');
const { apiLimiter, sanitize, secureHeaders } = require('./middleware/security');
const setupAdmin = require('./utils/setupAdmin');

// Rutas
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad y formateo
app.use(cors());
app.use(express.json());
app.use(sanitize); // Protección contra inyección NoSQL - Configuración segura
app.use(secureHeaders); // Headers de seguridad

// Endpoint para donaciones con Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donación',
              description: 'Gracias por tu apoyo',
            },
            unit_amount: Math.round(amount * 100), // Stripe espera centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || 'http://localhost:3000?success=true',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3000?canceled=true',
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago.' });
  }
});

// Conexión a MongoDB
connectDB()
  .then(() => {
    // Programar backups diarios
    scheduleBackups();

    // Crear directorio de exportaciones si no existe
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Crear directorio de backups si no existe
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Configurar usuario administrador inicial
    setupAdmin();
  })
  .catch(err => {
    console.error('Error al inicializar MongoDB:', err);
  });

// Rutas de API
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Mantener el endpoint original para compatibilidad (redirige a la nueva ruta)
app.post('/api/contact', async (req, res) => {
  console.log('BODY RECIBIDO:', req.body);
  const { name, email, phone, message, honeypot, captcha } = req.body;

  // Protección anti-spam: honeypot
  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({ message: 'Detección de spam.' });
  }

  // Validación básica de campos
  if (!name || !name.trim()) return res.status(400).json({ message: 'El nombre es obligatorio.' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'El email no es válido.' });
  if (!message || !message.trim()) return res.status(400).json({ message: 'El mensaje es obligatorio.' });

  // Validación de teléfono (solo si se proporciona)
  let phoneValid = false;
  let phoneSanitized = '';
  if (phone && phone.trim() !== "") {
    // Permite +, dígitos y espacios, mínimo 7 dígitos reales
    const phoneDigits = phone.replace(/\D/g, '');
    phoneSanitized = phone.trim();
    if (/^[+]?\d[\d\s-]{6,}$/.test(phoneSanitized) && phoneDigits.length >= 7 && phoneDigits.length <= 15) {
      phoneValid = true;
      console.log('Teléfono válido recibido:', phoneSanitized);
    } else {
      console.log('Teléfono inválido recibido:', phone);
      return res.status(400).json({ message: 'El teléfono no es válido.' });
    }
  } else {
    console.log('No se recibió teléfono o está vacío.');
  }

  // Configura tu cuenta de correo (puede ser Gmail, Outlook, etc.)
  // Si usas Gmail, activa "Acceso de apps menos seguras" o usa una App Password
  const transporter = nodemailer.createTransport({
    // --- Configuración para Gmail + App Password ---
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Tu correo de Gmail
      pass: process.env.EMAIL_PASS,  // Tu App Password de Gmail
    },
    // --- Fin configuración Gmail + App Password ---

    /*
    // --- Configuración alternativa: Gmail con OAuth2 ---
    // Para más información y pasos: https://nodemailer.com/usage/using-gmail/
    // Descomenta y completa los datos si quieres usar OAuth2 en el futuro
    auth: {
      type: 'OAuth2',
      user: 'kelvinc0219@gmail.com',
      clientId: 'TU_CLIENT_ID',
      clientSecret: 'TU_CLIENT_SECRET',
      refreshToken: 'TU_REFRESH_TOKEN',
      accessToken: 'TU_ACCESS_TOKEN', // Opcional
    },
    // --- Fin configuración Gmail OAuth2 ---
    */
  });

  // Plantilla HTML bonita para el correo
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #fafafa; border-radius: 8px;">
      <h2 style="color: #0078d7;">¡Nuevo mensaje de contacto!</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phoneValid ? `<p><strong>Teléfono:</strong> ${phoneSanitized}</p>` : '<!-- Teléfono no proporcionado o inválido -->'}
      <p><strong>Mensaje:</strong></p>
      <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
        ${message}
      </div>
      <hr>
      <small style="color: #888;">Este mensaje fue enviado desde el formulario de tu portafolio.</small>
    </div>
  `;
  console.log('¿Se incluirá teléfono en el email?', phoneValid ? phoneSanitized : 'NO');

  try {
    // 1. Guardar en base de datos (llama al controlador de mensajes)
    // Obtenemos la IP y User-Agent para el registro
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Crear el mensaje en MongoDB
    const Message = require('./models/Message');
    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      message,
      ipAddress,
      userAgent
    });
    
    await newMessage.save();
    
    // 2. Enviar por correo
    await transporter.sendMail({
      from: '"Portafolio Web" <kelvinc0219@gmail.com>', // se usa mi propio correo para evitar el spam y se puede ver el destinatario en el body
      to: 'kelvinc0219@gmail.com',
      subject: '💼 Nuevo mensaje de contacto desde tu portafolio',
      html: htmlContent,
    });
    
    res.status(200).json({ message: 'Mensaje guardado y enviado con éxito.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ message: 'Ocurrió un error al enviar el mensaje.' });
  }
});

// Servir el panel de administración en producción
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos del frontend
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Para cualquier ruta no definida, servir el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});