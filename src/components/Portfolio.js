import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import '../styles/Portfolio.css';

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
  <section id={id} className="portfolio-section">
    <h2 className="section-title">Mi Portafolio</h2>
    <div className="projects-grid">
      {projects.map((proj, idx) => (
        <div key={idx} className="project-card">
          <img className="project-img" src={proj.img} alt={proj.title} />
          <h3 className="project-title">{proj.title}</h3>
          <p className="project-desc">{proj.desc}</p>
          <a className="project-link" href={proj.link} target="_blank" rel="noopener noreferrer">
            Ver proyecto <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Portfolio;
