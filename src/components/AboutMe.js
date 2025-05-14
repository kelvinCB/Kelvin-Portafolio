import React from 'react';
import styled from 'styled-components';

const AboutWrapper = styled.section`
  background: linear-gradient(135deg, #2e2257 60%, #ffb07c 100%);
  color: #fff;
  padding: 3rem 1.5rem;
  border-radius: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
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
  border: 4px solid #ffb07c;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ffb07c;
`;

const Description = styled.p`
  font-size: 1.1rem;
  max-width: 500px;
  text-align: center;
`;

const AboutMe = () => (
  <AboutWrapper>
    <ProfileImg src="https://randomuser.me/api/portraits/men/32.jpg" alt="Tu Foto" />
    <Title>¡Hola! Soy [Tu Nombre]</Title>
    <Description>
      Soy desarrollador/a web especializado/a en Front-End y UI/UX. Me apasiona crear experiencias digitales atractivas y funcionales. ¡Bienvenido/a a mi portafolio!
    </Description>
  </AboutWrapper>
);

export default AboutMe;
