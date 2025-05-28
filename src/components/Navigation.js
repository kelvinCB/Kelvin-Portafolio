import React from 'react';
import PropTypes from 'prop-types';

function Navigation({ activeSection, setActiveSection, mobileMenuOpen, toggleMobileMenu, scrollToTop }) {
  return (
    <header className="app-header">
      <div className="logo" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
        <span className="logo-blue">Kelvin</span><span className="logo-purple">QA</span>
      </div>
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        ☰
      </button>
      <nav className={`main-nav ${mobileMenuOpen ? 'menu-open' : ''}`}>
        <a 
          href="#about" 
          className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          About Me
        </a>
        <a 
          href="#portfolio" 
          className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveSection('portfolio')}
        >
          Portfolio
        </a>
        <a 
          href="#experience" 
          className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveSection('experience')}
        >
          Experience
        </a>
        <a 
          href="#contact" 
          className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          Contact Me
        </a>
      </nav>
    </header>
  );
}

Navigation.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  mobileMenuOpen: PropTypes.bool.isRequired,
  toggleMobileMenu: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired,
};

export default Navigation;
