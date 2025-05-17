import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedinIn, FaGithub, FaTwitter, FaFacebookF } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ id }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseError, setResponseError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'El email no tiene un formato válido.';
    }
    if (!form.message.trim()) newErrors.message = 'El mensaje es obligatorio.';
    // Validación de teléfono (opcional pero si se llena debe ser válido)
    if (form.phone && form.phone.trim() !== '') {
      const phoneSanitized = form.phone.trim();
      const phoneDigits = phoneSanitized.replace(/\D/g, '');
      if (!/^[+]?\d[\d\s-]{6,}$/.test(phoneSanitized) || phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = 'El teléfono no es válido.';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setResponseError('');
    setSubmitted(false);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setResponseMessage('¡Gracias por tu mensaje! Te contactaré pronto.');
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        const data = await response.json();
        setResponseError(data.error || 'Hubo un error al enviar el mensaje.');
      }
    } catch (error) {
      setResponseError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id={id} className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Contacta <span className="highlight">Conmigo</span></h2>
          <p className="contact-subtitle">¿Tienes algún proyecto en mente o quieres hablar sobre oportunidades de QA Automation? Estoy aquí para ayudarte</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info-column">
            <div className="contact-image-container">
              <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80" 
                alt="Contact" 
                className="contact-image"
              />
            </div>
            
            <div className="contact-info-card">
              <h3>Información de Contacto</h3>
              <p>No dudes en contactarme directamente o llenar el formulario y te responderé a la brevedad</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon"><FaPhoneAlt /></div>
                  <div>
                    <h4>Llámame</h4>
                    <p>+1 829 969 8254</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon"><FaEnvelope /></div>
                  <div>
                    <h4>Email</h4>
                    <p>kelvinr02@hotmail.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon"><FaMapMarkerAlt /></div>
                  <div>
                    <h4>Ubicación</h4>
                    <p>Santo Domingo, República Dominicana</p>
                    <p>Remoto</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-social">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedinIn /></a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaGithub /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaTwitter /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebookF /></a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-column">
            <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
                {/* Campo oculto para evitar bots - funciona mejor que captcha */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  style={{display:'none'}}
                  tabIndex="-1"
                  autoComplete="off"
                />
              <div className="form-header">
                <h3>Envíame un mensaje</h3>
                <p>Completá el formulario y te responderé a la brevedad</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    className="form-input"
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    className="form-input"
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input
                  className="form-input"
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  className="form-textarea"
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              
              {responseMessage && <p className="success-message">{responseMessage}</p>}
              {responseError && <p className="error-message">{responseError}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
