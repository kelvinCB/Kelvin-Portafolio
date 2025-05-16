import React from 'react';
import '../styles/AboutMe.css';

const AboutMe = ({ id }) => (
  <section id={id} className="about-wrapper">
    <img 
      className="profile-img" 
      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" 
      alt="Kelvin Calcano QA Automation" 
    />
    <h2 className="section-title">¡Hola! Soy Kelvin Calcano</h2>
    <p className="section-description">
      QA Automation Engineer | ISTQB Certified | Cypress | Playwright | Selenium | API Testing | Web & Mobile<br/><br/>
      Ingeniero QA Automation con experiencia en automatización de pruebas para aplicaciones web y móviles, utilizando Cypress, Playwright, Selenium, Appium y Postman. Fuerte enfoque en calidad, buenas prácticas y mejora continua.
    </p>
  </section>
);

export default AboutMe;
