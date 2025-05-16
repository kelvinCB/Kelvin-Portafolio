import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ id }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
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
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-textarea"
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button className="submit-button" type="submit">Send Message</button>
      </form>
      {submitted && <p className="success-message">Thank you for your message!</p>}
    </section>
  );
};

export default Contact;
