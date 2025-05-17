import React from 'react';
import { FaDownload, FaCode, FaBug, FaMobile, FaTools } from 'react-icons/fa';
import '../styles/AboutMe.css';

const AboutMe = ({ id }) => {
  const downloadCV = () => {
    // En un caso real, esto apuntaría a un PDF real
    alert('CV descargado (simulación)');
    // Alternativa: window.open('/path-to-your-cv.pdf', '_blank');
  };

  return (
    <section id={id} className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h1 className="welcome-text">BIENVENIDO A MI MUNDO</h1>
          <h2 className="hero-title">¡Hola! Soy <span className="name-highlight">Kelvin Calcano</span></h2>
          <h3 className="role-title">QA Automation Engineer & ISTQB Certified</h3>
          
          <p className="hero-description">
            Ingeniero especializado en automatización de pruebas para aplicaciones web y móviles, 
            con experiencia en Cypress, Playwright, Selenium, Appium y Postman. 
            Apasionado por la calidad y la mejora continua de procesos.
          </p>
          
          <div className="buttons-container">
            <button className="download-cv-btn" onClick={downloadCV}>
              <FaDownload /> Descargar mi CV
            </button>
            <a href="#contact" className="contact-btn">Contáctame</a>
          </div>
        </div>
        
        <div className="profile-container">
          <div className="profile-bg"></div>
          <img 
            className="profile-img" 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" 
            alt="Kelvin Calcano QA Automation" 
          />
        </div>
      </div>
      
      <div className="skills-highlights">
        <div className="skill-card">
          <div className="skill-icon"><FaCode /></div>
          <h3>Automation Scripts</h3>
          <p>Desarrollo de scripts efectivos para pruebas automatizadas</p>
        </div>
        <div className="skill-card">
          <div className="skill-icon"><FaBug /></div>
          <h3>Bug Detection</h3>
          <p>Identificación proactiva de errores y problemas de calidad</p>
        </div>
        <div className="skill-card">
          <div className="skill-icon"><FaMobile /></div>
          <h3>Mobile Testing</h3>
          <p>Pruebas exhaustivas en aplicaciones iOS y Android</p>
        </div>
        <div className="skill-card">
          <div className="skill-icon"><FaTools /></div>
          <h3>CI/CD Pipeline</h3>
          <p>Integración de pruebas en flujos de integración continua</p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
