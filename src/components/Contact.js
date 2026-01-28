import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ id }) => {
  const initialFormState = { name: '', email: '', phone: '', message: '', honeypot: '' };
  const [form, setForm] = useState(initialFormState);
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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Updated URL construction for simplified backend - Force redeploy
    let directBackendUrl;
    if (process.env.NODE_ENV === 'production') {
      let baseApiUrl = process.env.REACT_APP_API_URL || 'http://86.48.24.125';

      // Remove any trailing slash
      baseApiUrl = baseApiUrl.replace(/\/$/, '');

      // Support both base URL and URL with /api included
      if (baseApiUrl.endsWith('/api')) {
        directBackendUrl = `${baseApiUrl}/contact`;
      } else {
        directBackendUrl = `${baseApiUrl}/api/contact`;
      }

      console.log('Production API URL (original):', process.env.REACT_APP_API_URL);
      console.log('Production API URL (normalized):', baseApiUrl);
      console.log('Constructed URL:', directBackendUrl);
    } else {
      // For development still use the proxy with /api prefix
      directBackendUrl = '/api/contact';
      console.log('Development mode - Using proxy URL:', directBackendUrl);
    }
    console.log('Sending request to:', directBackendUrl);
    console.log('Request payload:', JSON.stringify(form, null, 2));

    // Using XMLHttpRequest for CORS compatibility and test compatibility
    const xhr = new XMLHttpRequest();
    xhr.open('POST', directBackendUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Define what happens on successful data submission
    xhr.onload = function () {
      try {
        const status = xhr.status;
        console.log('Response status:', status);

        if (status >= 200 && status < 300) {
          console.log('Form submitted successfully');
          setResponseMessage('Thank you for your message! I will contact you soon.');
          setSubmitted(true);
          setForm(initialFormState);

          // Reset submitted state after 3 seconds to allow users to submit again
          setTimeout(() => {
            setSubmitted(false);
          }, 3000);
        } else {
          let errorData = { error: 'There was an error sending the message.' };
          try {
            const responseData = JSON.parse(xhr.responseText);
            if (responseData && responseData.error) {
              errorData.error = responseData.error;
            } else if (responseData && responseData.message) {
              // Para compatibilidad con las pruebas que envían el error en message
              errorData.error = responseData.message;
            }
          } catch (e) {
            console.error('Error parsing JSON response:', e);
          }
          console.log('Error response data:', errorData);
          setResponseError(errorData.error);
        }
      } catch (error) {
        console.error('Error in onload handler:', error);
        setResponseError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Define what happens in case of error
    xhr.onerror = function () {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Network error occurred');
      }
      setResponseError('Network error occurred. Please check your connection and try again.');
      setLoading(false);
    };

    // Send the request
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

            <div className="contact-info-card">
              <h3>Contact Information</h3>
              <p>Feel free to contact me directly or fill out the form and I'll get back to you shortly</p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon"><FaPhoneAlt /></div>
                  <div>
                    <h4>Call Me</h4>
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
                    <h4>Location</h4>
                    <p>Santo Domingo, Dominican Republic</p>
                    <p>Remote</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <a href="https://www.linkedin.com/in/kelvin-calcano-qa-automation/" target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedinIn /></a>
                <a href="https://github.com/kelvinCB" target="_blank" rel="noopener noreferrer" className="social-link"><FaGithub /></a>
                <a href="https://instagram.com/kelvinr02" target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram /></a>
              </div>
            </div>
          </div>

          <div className="contact-form-column">
            <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
              {/* Hidden field to prevent bots - works better than captcha */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />
              <div className="form-header">
                <h3>Send Me a Message</h3>
                <p>Complete the form and I'll get back to you shortly</p>
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
