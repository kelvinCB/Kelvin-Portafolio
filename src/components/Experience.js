import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import '../styles/Experience.css';

const experiences = [
  {
    title: 'QA Automation Engineer',
    company: 'Interfell',
    period: '2022 - Present',
    desc: 'Test automation for web and mobile applications using Cypress, Playwright, Selenium, Appium, and Postman. Focused on quality and continuous improvement.',
  },
  {
    title: 'QA Automation Engineer',
    company: 'CENIT',
    period: '2021 - 2022',
    desc: 'Design and execution of automated tests for software projects, ensuring quality in every delivery.',
  },
  {
    title: 'QA Tester',
    company: 'Interfell',
    period: '2020 - 2021',
    desc: 'Execution of functional tests and bug reporting in web and mobile applications.',
  },
];

const Experience = ({ id }) => (
  <section id={id} className="experience-section">
    <div className="experience-header">
      <h2 className="section-title">My <span className="highlight">Experience</span></h2>
      <p className="experience-subtitle">My professional journey in quality assurance and automation</p>
    </div>
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
