import React, { useState } from 'react';
import { FaExternalLinkAlt, FaCode, FaDesktop, FaMobile, FaDatabase, FaChartLine, FaServer } from 'react-icons/fa';
import '../styles/Portfolio.css';

const projects = [
  {
    id: '001',
    title: 'QA Automation Dashboard',
    category: 'Web Automation',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    desc: 'Dashboard for monitoring automated tests with Cypress and Selenium. Visualization of results and trends in real time.',
    link: '#',
    icon: <FaChartLine />
  },
  {
    id: '002',
    title: 'Mobile Testing Framework',
    category: 'Mobile Testing',
    img: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1000&q=80',
    desc: 'Complete framework for test automation on iOS and Android devices, using Appium and generating visual reports.',
    link: '#',
    icon: <FaMobile />
  },
  {
    id: '003',
    title: 'API Testing Pipeline',
    category: 'API Testing',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    desc: 'Integration of automated API tests in CI/CD pipelines with Postman, Newman and Playwright.',
    link: '#',
    icon: <FaServer />
  },
  {
    id: '004',
    title: 'Test Data Generator',
    category: 'Testing Tools',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    desc: 'Tool to generate realistic test data for different testing scenarios, supporting multiple formats.',
    link: '#',
    icon: <FaDatabase />
  },
  {
    id: '005',
    title: 'E2E Testing Suite',
    category: 'Web Automation',
    img: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=1000&q=80',
    desc: 'Complete end-to-end testing suite for SPA web applications, using Cypress with GitHub Actions integration.',
    link: '#',
    icon: <FaDesktop />
  },
  {
    id: '006',
    title: 'Test Script Generator',
    category: 'Testing Tools',
    img: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1000&q=80',
    desc: 'Application to generate test scripts from requirements specifications using artificial intelligence.',
    link: '#',
    icon: <FaCode />
  },
];

const Portfolio = ({ id }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Web Automation', name: 'Web' },
    { id: 'Mobile Testing', name: 'Mobile' },
    { id: 'API Testing', name: 'API' },
    { id: 'Testing Tools', name: 'Tools' }
  ];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id={id} className="portfolio-section">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2 className="section-title">My <span className="highlight">Portfolio</span></h2>
          <p className="portfolio-subtitle">A selection of my most recent and noteworthy automation projects</p>
        </div>
        
        <div className="portfolio-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-img-container">
                <div className="project-category">{project.category}</div>
                <img className="project-img" src={project.img} alt={project.title} />
                <div className="project-overlay">
                  <a href={project.link} className="view-project-btn" target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </div>
              </div>
              <div className="project-content">
                <div className="project-icon">{project.icon}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                  Details <FaExternalLinkAlt style={{ marginLeft: '5px', fontSize: '0.8rem' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
