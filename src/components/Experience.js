import React from 'react';
import styled from 'styled-components';
import { FaBriefcase } from 'react-icons/fa';

const Section = styled.section`
  padding: 3rem 1.5rem;
`;
const Title = styled.h2`
  color: #98ca3f;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 700px;
  margin: 0 auto;
`;
const Job = styled.div`
  background: rgba(18, 31, 61, 0.7);
  border-radius: 1rem;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  border-left: 4px solid #98ca3f;
`;
const JobTitle = styled.h3`
  color: #98ca3f;
  margin-bottom: 0.2rem;
`;
const Company = styled.span`
  font-weight: bold;
  color: #fff;
`;
const Period = styled.span`
  color: #98ca3f;
  font-size: 0.95rem;
  opacity: 0.9;
`;
const Description = styled.p`
  margin: 0.5rem 0 0 0;
`;

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
  <Section id="experience">
    <Title><FaBriefcase style={{ marginRight: '10px' }} /> Experience</Title>
    <Timeline>
      {experiences.map((job, idx) => (
        <Job key={idx}>
          <JobTitle>{job.title}</JobTitle>
          <Company>{job.company}</Company> <Period>({job.period})</Period>
          <Description>{job.desc}</Description>
        </Job>
      ))}
    </Timeline>
  </Section>
);

export default Experience;
