import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import '../styles/Experience.css';

const experiences = [
  {
    title: 'QA Automation Engineer',
    company: 'Interfell',
    period: '2022 - Actualidad',
    desc: 'Automatización de pruebas para aplicaciones web y móviles usando Cypress, Playwright, Selenium, Appium y Postman. Enfoque en calidad y mejora continua.',
  },
  {
    title: 'QA Automation Engineer',
    company: 'CENIT',
    period: '2021 - 2022',
    desc: 'Diseño y ejecución de pruebas automatizadas para proyectos de software, asegurando la calidad en cada entrega.',
  },
  {
    title: 'QA Tester',
    company: 'Interfell',
    period: '2020 - 2021',
    desc: 'Ejecución de pruebas funcionales y reporte de bugs en aplicaciones web y móviles.',
  },
];

const Experience = ({ id }) => (
  <section id={id} className="experience-section">
    <h2 className="section-title">
      <FaBriefcase style={{ marginRight: '10px' }} /> Experience
    </h2>
    <div className="experience-timeline">
      {experiences.map((job, idx) => (
        <div key={idx} className="experience-job">
          <h3 className="job-title">{job.title}</h3>
          <span className="company-name">{job.company}</span> 
          <span className="job-period">({job.period})</span>
          <p className="job-description">{job.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Experience;
