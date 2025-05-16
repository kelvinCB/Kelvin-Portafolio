import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ id }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
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
        setResponseMessage('¡Gracias por tu mensaje!');
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
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
      <h2 className="section-title">Contact Me</h2>
      <div className="contact-info">
        <div className="contact-item"><FaEnvelope /> kelvin.calcano@example.com</div>
        <div className="contact-item"><FaPhoneAlt /> +1 809 123 4567</div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
        <textarea
          className="form-textarea"
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {responseError && <p className="error-message">{responseError}</p>}
    </section>
  );
};

export default Contact;
