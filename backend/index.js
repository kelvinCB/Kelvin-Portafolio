// backend/index.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
      success_url: 'http://localhost:3000?success=true',
      cancel_url: 'http://localhost:3000?canceled=true',
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago.' });
  }
});

// Endpoint para recibir mensajes de contacto
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
    await transporter.sendMail({
      from: '"Portafolio Web" <kelvinc0219@gmail.com>', // se usa mi propio correo para evitar el spam y se puede ver el destinatario en el body
      to: 'kelvinc0219@gmail.com',
      subject: '💼 Nuevo mensaje de contacto desde tu portafolio',
      html: htmlContent,
    });
    res.status(200).json({ message: 'Mensaje enviado con éxito.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ message: 'Ocurrió un error al enviar el mensaje.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});