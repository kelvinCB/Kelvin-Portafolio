const nodemailer = require('nodemailer');

/**
 * Service for sending notification emails
 * With improved error handling and flexible configuration
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.configured = false;
    this.configErrors = [];
    this.initialize();
  }

  /**
   * Initializes the nodemailer transporter with credentials
   * @returns {Boolean} true if the configuration was successful
   */
  initialize() {
    try {
      // Get credentials from environment
      const { EMAIL_USER, EMAIL_PASS, NODE_ENV } = process.env;

      if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn('⚠️ [EmailService] Credenciales de email no configuradas');
        this.configErrors.push('Credenciales no configuradas');
        return false;
      }

      console.log(`📧 [EmailService] Configurando transporter con ${EMAIL_USER} en entorno ${NODE_ENV || 'no especificado'}`);

      // Crear transporter para Gmail con opciones extendidas para mejor compatibilidad
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use TLS
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        },
        tls: {
          // Don't fail on invalid certificates
          rejectUnauthorized: false
        },
        debug: NODE_ENV === 'development', // Enable debug logging in development
      });
      
      this.configured = true;
      console.log('✅ [EmailService] Transporter configured successfully');
      
      // Verify that the connection works
      this.verifyConnection();
      
      return true;
    } catch (error) {
      console.error('❌ [EmailService] Error al inicializar transporter:', error);
      this.configErrors.push(`Error de inicialización: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Verifies the connection with the SMTP server
   * @returns {Promise<Boolean>}
   */
  async verifyConnection() {
    if (!this.transporter) {
      console.error('❌ [EmailService] No hay transporter para verificar');
      return false;
    }
    
    try {
      const result = await this.transporter.verify();
      console.log('✅ [EmailService] Conexión verificada:', result);
      return true;
    } catch (error) {
      console.error('❌ [EmailService] Error al verificar conexión:', error);
      this.configErrors.push(`Error de verificación: ${error.message}`);
      return false;
    }
  }

  /**
   * Sends a notification email when a new message is received
   * @param {Object} messageData - Contact message data
   * @returns {Promise<Object>} - Send result with detailed information
   */
  async sendContactNotification(messageData) {
    // Create a result object for detailed tracking
    const result = {
      success: false,
      attempted: false,
      error: null,
      messageId: null,
      timestamp: new Date().toISOString(),
      errorDetails: null,
      configStatus: {
        transporterExists: !!this.transporter,
        configured: this.configured,
        configErrors: this.configErrors
      }
    };

    try {
      // Validate if transporter is available
      if (!this.transporter) {
        const error = 'No se pudo enviar el email: transporter no inicializado';
        console.warn(`⚠️ [EmailService] ${error}`);
        result.error = error;
        return result;
      }
      
      // If credentials are missing, try reinitializing
      if (!this.configured) {
        console.log('🔄 [EmailService] Intentando reinicializar el transporter...');
        this.initialize();
        if (!this.configured) {
          result.error = 'No se pudo configurar el servicio de email';
          return result;
        }
      }

      const { name, email, phone, message } = messageData;

      // Destination email address
      const toAddress = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      console.log(`📧 [EmailService] Preparando correo para: ${toAddress}`);

      // Configure the message with additional metadata for better diagnosis
      const mailOptions = {
        from: {
          name: 'Portafolio Web',
          address: process.env.EMAIL_USER
        },
        to: toAddress,
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: `
          <h1 style="color: #3498db;">¡Nuevo mensaje de contacto!</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          <h2>Mensaje:</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr>
          <p><em>Este mensaje was sent from the contact form of your portfolio.</em></p>
          <p style="color: #7f8c8d; font-size: 12px;">Timestamp: ${result.timestamp}</p>
        `,
        // Include simple text version for better delivery
        text: `NUEVO MENSAJE DE CONTACTO

Nombre: ${name}
Email: ${email}${phone ? '\nTeléfono: ' + phone : ''}

Mensaje:
${message}

Este mensaje fue enviado desde el formulario de contacto de tu portafolio.`
      };

      // Mark as attempted
      result.attempted = true;

      // Send the email with timeout to avoid blocking
      console.log('📤 [EmailService] Intentando enviar email...');
      const sendResult = await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout al enviar email')), 30000))
      ]);
      
      // Register success
      result.success = true;
      result.messageId = sendResult.messageId;
      console.log('✅ [EmailService] Email enviado correctamente:', sendResult.messageId);
      
      return result;
    } catch (error) {
      // Capture and format the error for diagnosis
      console.error('❌ [EmailService] Error al enviar email:', error);
      result.error = error.message;
      result.errorDetails = {
        stack: error.stack,
        code: error.code,
        command: error.command,
        name: error.name
      };
      return result;
    }
  }

  /**
   * Returns the current service status
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      initialized: !!this.transporter,
      configured: this.configured,
      configErrors: this.configErrors,
      configTimestamp: this.configTimestamp,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}*****` : 'no configurado',
      adminEmail: process.env.ADMIN_EMAIL ? `${process.env.ADMIN_EMAIL.substring(0, 3)}*****` : 'no configurado'
    };
  }
}

// Export a singleton instance of the service
module.exports = new EmailService();
