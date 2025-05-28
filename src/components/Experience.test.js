import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Experience from './Experience';

// Datos de experiencia definidos en el componente, para comparación
const experiencesData = [
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

describe('Experience Component', () => {
  const testId = 'my-experience-section';

  beforeEach(() => {
    render(<Experience id={testId} />);
  });

  test('renders the main section with correct id and class', () => {
    const sectionElement = screen.getByRole('region', { name: /my experience/i });
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement).toHaveAttribute('id', testId);
    expect(sectionElement).toHaveClass('experience-section');
  });

  test('renders the section title and subtitle', () => {
    expect(screen.getByRole('heading', { name: /my experience/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/my professional journey in quality assurance and automation/i)).toBeInTheDocument();
  });

  test('renders the correct number of experience jobs', () => {
    const jobElements = screen.getAllByRole('heading', { level: 3 });
    // Cada 'experience-job' tiene un h3 para el título del trabajo
    expect(jobElements.length).toBe(experiencesData.length);
  });

  test('renders details for each experience job correctly', () => {
    const jobElements = screen.getAllByRole('article'); 

    expect(jobElements.length).toBe(experiencesData.length);

    experiencesData.forEach((jobData, index) => {
      const jobElement = jobElements[index];
      const utils = within(jobElement);

      expect(utils.getByRole('heading', { name: jobData.title })).toBeInTheDocument();
      expect(utils.getByText(jobData.company)).toBeInTheDocument();
      expect(utils.getByText(`(${jobData.period})`)).toBeInTheDocument();
      expect(utils.getByText(jobData.desc)).toBeInTheDocument();
    });
  });

  test('highlight in title is present', () => {
    const title = screen.getByRole('heading', { name: /my experience/i, level: 2 });
    const highlightSpan = title.querySelector('span.highlight');
    expect(highlightSpan).toBeInTheDocument();
    expect(highlightSpan).toHaveTextContent('Experience');
  });
});
