import React from 'react';
import styled from 'styled-components';
import { FaExternalLinkAlt } from 'react-icons/fa';

const PortfolioSection = styled.section`
  padding: 3rem 1.5rem;
`;
const Title = styled.h2`
  color: #ffb07c;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;
const Card = styled.div`
  background: #261b47;
  border-radius: 1rem;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.15);
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ProjectImg = styled.img`
  width: 100%;
  border-radius: 0.7rem;
  margin-bottom: 1rem;
`;
const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;
const ProjectDesc = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
`;
const ProjectLink = styled.a`
  color: #ffb07c;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const projects = [
  {
    title: 'Landing Page Moderna',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: 'Sitio de presentación para una agencia digital.',
    link: '#',
  },
  {
    title: 'Dashboard Interactivo',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    desc: 'Panel administrativo con estadísticas y gráficos.',
    link: '#',
  },
  {
    title: 'E-commerce UI',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    desc: 'Interfaz de tienda online moderna y responsiva.',
    link: '#',
  },
];

const Portfolio = () => (
  <PortfolioSection>
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
