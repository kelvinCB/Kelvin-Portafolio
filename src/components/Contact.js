import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedinIn, FaGithub, FaTwitter, FaFacebookF } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ id }) => {
  const initialFormState = { name: '', email: '', phone: '', message: '', honeypot: '' };
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  /* eslint-disable-next-line no-unused-vars */
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseError, setResponseError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Email format is not valid.';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    // Phone validation (optional but if filled it must be valid)
    if (form.phone && form.phone.trim() !== '') {
      const phoneSanitized = form.phone.trim();
      const phoneDigits = phoneSanitized.replace(/\D/g, '');
      if (!/^[+]?\d[\d\s-]{6,}$/.test(phoneSanitized) || phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = 'Phone number is not valid.';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponseMessage('');
    setResponseError('');
    setSubmitted(false);
    
    // Validate the form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    // Direct backend URL
    const directBackendUrl = '/api/proxy/contact'; // Use Netlify proxy
    console.log('Using direct backend URL:', directBackendUrl);
    console.log('Request payload:', JSON.stringify(form, null, 2));
    
    // Using XMLHttpRequest for maximum compatibility with CORS
    const xhr = new XMLHttpRequest();
    xhr.open('POST', directBackendUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = false; // Important for CORS
    
    xhr.onload = function() {
      setLoading(false);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        // Success case
        console.log('Form submitted successfully');
        setResponseMessage('Thank you for your message! I will contact you soon.');
        setSubmitted(true);
        setForm(initialFormState);
      } else {
        // Error case
        console.error('Server error:', xhr.status, xhr.statusText);
        try {
          const errorData = JSON.parse(xhr.responseText);
          setResponseError(errorData.message || 'Error submitting form. Please try again.');
        } catch (e) {
          setResponseError('Error submitting form. Please try again.');
        }
      }
    };
    
    xhr.onerror = function() {
      console.error('Network error occurred');
      setLoading(false);
      setResponseError('Network error occurred. Please check your connection and try again.');
    };
    
    xhr.send(JSON.stringify(form));
  };

  return (
    <section id={id} className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Contact <span className="highlight">Me</span></h2>
          <p className="contact-subtitle">Do you have a project in mind or want to talk about QA Automation opportunities? I'm here to help</p>
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
            <h3>Contact Information</h3>
            <div className="contact-details">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:kelvinr02@hotmail.com">kelvinr02@hotmail.com</a>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt className="contact-icon" />
                  <a href={`tel:+1 829 969 8254`}>+1 829 969 8254</a>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Santo Domingo, Dominican Republic</span>
                </div>
              </div>

              <div className="social-links">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn className="social-icon" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="social-icon" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="social-icon" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="social-icon" />
                </a>
              </div>

              <a href={`https://wa.me/+1 829 969 8254?text=${encodeURIComponent('Hello, I want to get in touch with you.')}`} 
                className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Make a donation">
                <button className="donate-float" aria-label="Make a donation">Get in touch</button>
              </a>
            </div>

          <div className="contact-form-column">
            <form className={`contact-form ${submitted ? 'success' : ''}`} onSubmit={handleSubmit} autoComplete="off">
                {/* Hidden field to prevent bots - works better than captcha */}
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
                <h2 className="section-title">Send Me a Message</h2>
                <p className="section-subtitle">
                  {submitted 
                    ? 'Thank you for your message! I will get back to you shortly.' 
                    : 'Complete the form and I\'ll get back to you shortly'}
                </p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
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
                <label htmlFor="phone">Phone (optional)</label>
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
                <label htmlFor="message">Message</label>
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
              
              <button className="submit-button" type="submit" disabled={loading || submitted}>
                {loading ? 'Sending...' : 'Send message'}
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
