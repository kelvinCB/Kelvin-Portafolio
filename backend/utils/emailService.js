const nodemailer = require('nodemailer');

/**
 * Servicio para enviar emails de notificación
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  /**
   * Inicializa el transporter de nodemailer con las credenciales
   */
  initialize() {
    // Obtener credenciales del entorno
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('Advertencia: Credenciales de email no configuradas');
      return;
    }

    // Crear transporter para Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Cambia esto si usas otro proveedor
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }

  /**
   * Envía un email de notificación cuando se recibe un nuevo mensaje
   * @param {Object} messageData - Datos del mensaje de contacto
   * @returns {Promise} - Resultado del envío
   */
  async sendContactNotification(messageData) {
    try {
      if (!this.transporter) {
        console.warn('No se pudo enviar el email: transporter no inicializado');
        return false;
      }

      const { name, email, phone, message } = messageData;

      // Configurar el mensaje
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: `
          <h1>Has recibido un nuevo mensaje de contacto</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          <h2>Mensaje:</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Este es un mensaje automático enviado desde tu formulario de contacto.</em></p>
        `
      };

      // Enviar el email
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('Email de notificación enviado:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error al enviar email de notificación:', error);
      return false;
    }
  }
}

// Exportar una instancia singleton del servicio
module.exports = new EmailService();
