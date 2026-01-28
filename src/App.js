import React, { useState, useRef } from 'react';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundElements from './components/BackgroundElements';
import WhatsAppButton from './components/WhatsAppButton';
import Navigation from './components/Navigation';
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

  // My scrollspy implementation - check if there's any delay on mobile
  React.useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'portfolio', 'experience', 'contact'];
      const offset = 130; // NOTE: adjusted this for the header size, don't change
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
    handleScroll(); // initialize when page loads
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main-container" ref={topRef}>
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        scrollToTop={scrollToTop}
      />
      <BackgroundElements />
      <AboutMe id="about" />
      <Portfolio id="portfolio" />
      <Experience id="experience" />
      <Contact id="contact" />
      <Footer />
      <WhatsAppButton
        phoneNumber="18299698254"
        message="Hello, I saw your portfolio and would like to talk with you"
      />
    </div>
  );
}

export default App;
