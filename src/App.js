import React, { useState } from 'react';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Contact from './components/Contact';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="main-container">
      <header className="app-header">
        <div className="logo">
          KC<span>Dev</span>
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
            href="#experience" 
            className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveSection('experience')}
          >
            Experience
          </a>
          <a 
            href="#portfolio" 
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveSection('portfolio')}
          >
            Portfolio
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
      <AboutMe id="about" />
      <Experience id="experience" />
      <Portfolio id="portfolio" />
      <Contact id="contact" />
    </div>
  );
}

export default App;
