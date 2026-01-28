// backend/index.js
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importación de utilidades y configuraciones
require('dotenv').config();
const db = require('./config/database');
const { apiLimiter, secureHeaders, contactFormLimiter } = require('./middleware/security');
const setupAdmin = require('./utils/setupAdmin');

// Routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Initialize app
const app = express();
app.set('trust proxy', 1); // Trust Nginx/Netlify proxy for correct IP rate limiting
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// Middlewares de seguridad y formateo
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://kelvin-portafolio.netlify.app', 'https://portfolio-admin-kelvin.netlify.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(secureHeaders); // Security headers

// Stripe (para donaciones)
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
            unit_amount: Math.round(amount * 100),
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

// Inicialización de directorios y Admin
(async () => {
  // Crear directorios si no existen
  const dirs = ['exports', 'backups', 'logs'];
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Configurar admin inicial después de que la DB esté lista
  try {
    await setupAdmin();
  } catch (err) {
    console.error('Error configurando admin inicial:', err.message);
  }
})();

// API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV, timestamp: new Date() });
});
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Endpoint de contacto (Migrado a Postgres)
app.post('/api/contact', contactFormLimiter, async (req, res) => {
  const { name, email, phone, message, honeypot } = req.body;

  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({ message: 'Detección de spam.' });
  }

  if (!name || !name.trim()) return res.status(400).json({ message: 'El nombre es obligatorio.' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'El email no es válido.' });
  if (!message || !message.trim()) return res.status(400).json({ message: 'El mensaje es obligatorio.' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #fafafa; border-radius: 8px;">
      <h2 style="color: #0078d7;">¡Nuevo mensaje de contacto!</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
        ${message}
      </div>
    </div>
  `;

  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Guardar en Postgres usando el modelo refactorizado
    const Message = require('./models/Message');
    await Message.create({
      name,
      email,
      phone: phone || '',
      message,
      ipAddress,
      userAgent
    });

    // Enviar email
    await transporter.sendMail({
      from: `"Portafolio Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '💼 Nuevo mensaje de contacto',
      html: htmlContent,
    });

    res.status(200).json({ message: 'Mensaje enviado con éxito.' });
  } catch (error) {
    console.error('Error procesando contacto:', error);
    res.status(500).json({ message: 'Ocurrió un error al procesar tu solicitud.' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Server Listen
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`📡 Modo: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = { app };
