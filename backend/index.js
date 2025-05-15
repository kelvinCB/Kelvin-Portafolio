// backend/index.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para recibir mensajes de contacto
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Configura tu cuenta de correo (puede ser Gmail, Outlook, etc.)
  // Si usas Gmail, activa "Acceso de apps menos seguras" o usa una App Password
  const transporter = nodemailer.createTransport({
    // --- Configuración para Gmail + App Password ---
    service: 'gmail',
    auth: {
      user: 'kelvinc0219@gmail.com', // Tu correo de Gmail
      pass: 'tnnt kpdf ofhx erty',  // Tu App Password de Gmail
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
      <p><strong>Mensaje:</strong></p>
      <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
        ${message}
      </div>
      <hr>
      <small style="color: #888;">Este mensaje fue enviado desde el formulario de tu portafolio.</small>
    </div>
  `;

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