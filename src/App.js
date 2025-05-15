import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Experience from './components/Experience';
import Contact from './components/Contact';

const GlobalStyle = createGlobalStyle`
  body {
    background: #0a1b2a;
    margin: 0;
    font-family: 'Poppins', Arial, sans-serif;
  }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1b2a 0%, #121f3d 100%);
  color: #fff;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(10, 27, 42, 0.9);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #98ca3f;
  display: flex;
  align-items: center;
  
  span {
    color: #fff;
    margin-left: 5px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #0a1b2a;
    padding: 1rem;
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  color: ${({ active }) => (active ? '#98ca3f' : '#fff')};
  text-decoration: none;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 2px;
    background-color: #98ca3f;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #98ca3f;
    
    &:after {
      width: 100%;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <MainContainer>
      <GlobalStyle />
      <Header>
        <Logo>
          KC<span>Dev</span>
        </Logo>
        <MobileMenuButton onClick={toggleMobileMenu}>
          ☰
        </MobileMenuButton>
        <Nav isOpen={mobileMenuOpen}>
          <NavLink 
            href="#about" 
            active={activeSection === 'about'}
            onClick={() => setActiveSection('about')}
          >
            About Me
          </NavLink>
          <NavLink 
            href="#experience" 
            active={activeSection === 'experience'}
            onClick={() => setActiveSection('experience')}
          >
            Experience
          </NavLink>
          <NavLink 
            href="#portfolio" 
            active={activeSection === 'portfolio'}
            onClick={() => setActiveSection('portfolio')}
          >
            Portfolio
          </NavLink>
          <NavLink 
            href="#contact" 
            active={activeSection === 'contact'}
            onClick={() => setActiveSection('contact')}
          >
            Contact Me
          </NavLink>
        </Nav>
      </Header>
      <AboutMe id="about" />
      <Experience id="experience" />
      <Portfolio id="portfolio" />
      <Contact id="contact" />
    </MainContainer>
  );
}

export default App;
