import React from 'react';
import {FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo" style={{ cursor: 'pointer' }}>
          <span className="logo-blue">Kelvin</span><span className="logo-purple">QA</span>
        </div>
        

        <div className="social-links">
          <a href="https://linkedin.com/in/kelvin-calcano-qa-automation/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedinIn />
          </a>
          <a href="https://github.com/kelvinCB" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub />
          </a>
          <a href="https://instagram.com/kelvinr02" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kelvin Calcaño. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
