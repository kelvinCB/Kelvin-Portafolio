import React, { useState, useRef } from 'react';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundElements from './components/BackgroundElements';
import WhatsAppButton from './components/WhatsAppButton';
import DonateButton from './components/DonateButton';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const topRef = useRef(null);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Mi implementación del scrollspy - revisar si hay delay en móviles
  React.useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'portfolio', 'experience', 'contact'];
      const offset = 130; // OJO: ajusté esto por el tamaño del header, no cambiar
      let current = 'about';
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - offset <= 0) {
            current = sectionIds[i];
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // inicializa al cargar la página
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main-container" ref={topRef}>
      <header className="app-header">
        <div className="logo" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
  <span className="logo-blue">KC</span><span className="logo-purple">Dev</span>
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
      <BackgroundElements />
      <AboutMe id="about" />
      <Portfolio id="portfolio" />
      <Experience id="experience" />
      <Contact id="contact" />
      <Footer />
      <WhatsAppButton 
        phoneNumber="18299698254" 
        message="Hola, vi tu portafolio y me gustaria hablar contigo" 
      />
      <DonateButton />
    </div>
  );
}

export default App;
