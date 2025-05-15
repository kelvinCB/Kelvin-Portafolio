import React from 'react';
import styled from 'styled-components';
import { FaExternalLinkAlt } from 'react-icons/fa';

const PortfolioSection = styled.section`
  padding: 3rem 1.5rem;
`;
const Title = styled.h2`
  color: #98ca3f;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;
const Card = styled.div`
  background: rgba(18, 31, 61, 0.7);
  border-radius: 1rem;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.3);
  }
`;
const ProjectImg = styled.img`
  width: 100%;
  border-radius: 0.7rem;
  margin-bottom: 1rem;
  border: 2px solid #98ca3f;
  object-fit: cover;
  height: 160px;
`;
const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #98ca3f;
`;
const ProjectDesc = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;
const ProjectLink = styled.a`
  color: #98ca3f;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: auto;
  &:hover { text-decoration: underline; }
`;

const projects = [
  {
    title: 'QA Automation Dashboard',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    desc: 'Dashboard para monitoreo de pruebas automatizadas con Cypress y Selenium.',
    link: '#',
  },
  {
    title: 'Mobile Testing Suite',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    desc: 'Automatización de pruebas móviles usando Appium y reportes visuales.',
    link: '#',
  },
  {
    title: 'API Automation CI/CD',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    desc: 'Integración de pruebas automáticas de API en pipelines CI/CD con Postman y Playwright.',
    link: '#',
  },
];

const Portfolio = ({ id }) => (
  <PortfolioSection id={id}>
    <Title>Mi Portafolio</Title>
    <ProjectsGrid>
      {projects.map((proj, idx) => (
        <Card key={idx}>
          <ProjectImg src={proj.img} alt={proj.title} />
          <ProjectTitle>{proj.title}</ProjectTitle>
          <ProjectDesc>{proj.desc}</ProjectDesc>
          <ProjectLink href={proj.link} target="_blank" rel="noopener noreferrer">
            Ver proyecto <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
          </ProjectLink>
        </Card>
      ))}
    </ProjectsGrid>
  </PortfolioSection>
);

export default Portfolio;
