// backend/index.js
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const expressMongoSanitize = require('express-mongo-sanitize');

// Importación de utilidades y configuraciones
require('dotenv').config();
const { connectDB, scheduleBackups } = require('./config/database');
const { apiLimiter, secureHeaders } = require('./middleware/security');
const setupAdmin = require('./utils/setupAdmin');

// Routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad y formateo
app.use(cors());
app.use(express.json());

app.use(secureHeaders); // Security headers

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

// MongoDB connection
connectDB()
  .then(() => {
    // Schedule daily backups only if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      scheduleBackups();
    }

    // Create export directory if it doesn't exist
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Setup initial admin user
    setupAdmin();
  })
  .catch(err => {
    console.error('Error al inicializar MongoDB:', err);
  });

// API routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Maintain the original endpoint for compatibility (redirects to the new route)
app.post('/api/contact', async (req, res) => {
  req.body = expressMongoSanitize.sanitize(req.body);
  console.log('BODY RECIBIDO (después de sanitizar):', req.body);
  const { name, email, phone, message, honeypot, captcha } = req.body;

  // Anti-spam protection: honeypot
  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({ message: 'Detección de spam.' });
  }

  // Basic field validation
  if (!name || !name.trim()) return res.status(400).json({ message: 'El nombre es obligatorio.' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'El email no es válido.' });
  if (!message || !message.trim()) return res.status(400).json({ message: 'El mensaje es obligatorio.' });

  // Phone validation (only if provided)
  let phoneValid = false;
  let phoneSanitized = '';
  if (phone && phone.trim() !== "") {
    // Allows +, digits and spaces, minimum 7 real digits
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

  // Configure your email account (can be Gmail, Outlook, etc.)
  // If you use Gmail, enable "Less secure app access" or use an App Password
  const transporter = nodemailer.createTransport({
    // --- Configuration for Gmail + App Password ---
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail account
      pass: process.env.EMAIL_PASS,  // Your App Password for Gmail
    },
    // --- End Gmail + App Password configuration ---

    /*
    // --- Alternative configuration: Gmail with OAuth2 ---
    // For more information and steps: https://nodemailer.com/usage/using-gmail/
    // Uncomment and complete the data if you want to use OAuth2 in the future
    auth: {
      type: 'OAuth2',
      user: 'kelvinc0219@gmail.com',
      clientId: 'TU_CLIENT_ID',
      clientSecret: 'TU_CLIENT_SECRET',
      refreshToken: 'TU_REFRESH_TOKEN',
      accessToken: 'TU_ACCESS_TOKEN', // Optional
    },
    // --- End Gmail OAuth2 configuration ---
    */
  });

  // HTML template for the email
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
      <small style="color: #888;">This message was sent from the contact form of your portfolio.</small>
    </div>
  `;
  console.log('¿Se incluirá teléfono en el email?', phoneValid ? phoneSanitized : 'NO');

  try {
    // 1. Save in database (calls the message controller)
    // Get IP and User-Agent for registration
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Create message in MongoDB
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
    console.log('Mensaje guardado con ID:', newMessage._id);
    
    // 2. Send by email
    await transporter.sendMail({
      from: '"Portafolio Web" <kelvinc0219@gmail.com>', // Use my own email to avoid spam and the recipient can be seen in the body
      to: 'kelvinc0219@gmail.com',
      subject: '💼 New contact message from your portfolio',
      html: htmlContent,
    });
    
    res.status(200).json({ message: 'Mensaje guardado y enviado con éxito.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ message: 'Ocurrió un error al enviar el mensaje.' });
  }
});

// Serve admin panel in production
if (process.env.NODE_ENV === 'production') {
  // Serve static frontend files
  app.use(express.static(path.join(__dirname, '../build')));
  
  // For any undefined route, serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export test app
const server = app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };
