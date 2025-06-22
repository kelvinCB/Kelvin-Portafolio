import React, { useState, useEffect } from 'react';
import { FaDownload, FaCode, FaBug, FaMobile, FaTools } from 'react-icons/fa';
import '../styles/AboutMe.css';

const AboutMe = ({ id }) => {
  const [showDownloadMsg, setShowDownloadMsg] = useState(false);
  // downloadCV function removed – anchor tag handles download directly

  useEffect(() => {
    if (showDownloadMsg) {
      const timer = setTimeout(() => setShowDownloadMsg(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showDownloadMsg]);

  return (
    <section id={id} className="about-section">
      <div className="about-content">
        <div className="about-text">

          <h2 className="hero-title">Hello! I am <span className="name-highlight">Kelvin Calcaño</span></h2>
          <h3 className="role-title">Senior QA Automation Engineer</h3>
          
          <p className="hero-description">
          With over 5 years of experience in QA Automation, I specialize in <strong>Appium</strong> for mobile testing, and <strong>Selenium</strong> and <strong>Playwright</strong> for web, using <strong>Java</strong> as my primary programming language. I have a deep understanding of <strong>E2E</strong>, <strong>functional</strong> and <strong>API</strong> testing, and I enjoy transforming quality challenges into efficient solutions, ensuring that products not only work but also exceed user expectations.
          </p>
          
          <div className="buttons-container">
            <a
              className="download-cv-btn"
              href="/resources/QA-Automation-Kelvin-Calcano-2025.pdf"
              download
              onClick={() => setShowDownloadMsg(true)}
            >
              <FaDownload /> Download my CV
            </a>
            <a href="#contact" className="contact-btn">Contact me</a>
          </div>
          {showDownloadMsg && (
            <div className="download-toast">
              CV downloaded! Please check your downloads folder.
            </div>
          )}
        </div>
        
        <div className="profile-container">
          <div className="profile-bg"></div>
          <img 
            className="profile-img" 
            src="/resources/slack-profile-picture.jpg" 
            alt="Kelvin Calcaño QA Automation" 
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
