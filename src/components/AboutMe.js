import React from 'react';
import styled from 'styled-components';

const AboutWrapper = styled.section`
  background: linear-gradient(135deg, #121f3d 0%, #0a1b2a 100%);
  color: #fff;
  padding: 3rem 1.5rem;
  border-radius: 1.5rem;
  margin: 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid #98ca3f;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #98ca3f;
`;

const Description = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
`;

const AboutMe = ({ id }) => (
  <AboutWrapper id={id}>
    <ProfileImg src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Kelvin Calcano QA Automation" />
    <Title>¡Hola! Soy Kelvin Calcano</Title>
    <Description>
      QA Automation Engineer | ISTQB Certified | Cypress | Playwright | Selenium | API Testing | Web & Mobile<br/><br/>
      Ingeniero QA Automation con experiencia en automatización de pruebas para aplicaciones web y móviles, utilizando Cypress, Playwright, Selenium, Appium y Postman. Fuerte enfoque en calidad, buenas prácticas y mejora continua.
    </Description>
  </AboutWrapper>
);

export default AboutMe;
