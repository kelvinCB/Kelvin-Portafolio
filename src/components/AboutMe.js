import React from 'react';
import { FaDownload, FaCode, FaBug, FaMobile, FaTools } from 'react-icons/fa';
import '../styles/AboutMe.css';

const AboutMe = ({ id }) => {
  const downloadCV = () => {
    // In a real scenario, this would point to an actual PDF
    alert('CV downloaded (simulation)');
    // Alternative: window.open('/path-to-your-cv.pdf', '_blank');
  };

  return (
    <section id={id} className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h1 className="welcome-text">WELCOME TO MY WORLD</h1>
          <h2 className="hero-title">Hello! I am <span className="name-highlight">Kelvin Calcano</span></h2>
          <h3 className="role-title">QA Automation Engineer & ISTQB Certified</h3>
          
          <p className="hero-description">
            Engineer specialized in automation testing for web and mobile applications, 
            with experience in Cypress, Playwright, Selenium, Appium, and Postman. 
            Passionate about quality and continuous process improvement.
          </p>
          
          <div className="buttons-container">
            <button className="download-cv-btn" onClick={downloadCV}>
              <FaDownload /> Download my CV
            </button>
            <a href="#contact" className="contact-btn">Contact me</a>
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
            <p>Development of effective scripts for automated testing</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><FaBug /></div>
            <h3>Bug Detection</h3>
            <p>Proactive identification of bugs and quality issues</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><FaMobile /></div>
            <h3>Mobile Testing</h3>
            <p>Thorough testing on iOS and Android applications</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><FaTools /></div>
            <h3>CI/CD Pipeline</h3>
            <p>Test integration in continuous integration pipelines</p>
          </div>
        </div>
    </section>
  );
};

export default AboutMe;
