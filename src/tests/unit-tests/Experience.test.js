import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Experience from '../../components/Experience';

// Updated experience data for comparison
const experiencesData = [
  {
    title: 'Sr QA Automation Engineer',
    company: 'Blizzard Entertainment, Irvine, CA (Remote)',
    period: 'Jul 2024 – Present',
    desc: 'Designed and implemented over 100 automated test scripts for a high-traffic gaming platform, focusing on SOAP and REST API testing. Covered critical backend services including: DirectGrant, SplitPayment, DiscountForTitles, DynamicBundle, RevokeEntitlements, ChargeBack, Refund, and more. Ensured robustness and reliability of core game mechanics and financial transactions through comprehensive automated validation.',
  },
  {
    title: 'QA Automation Engineer (Blockchain)',
    company: 'Taringa, Uruguay (Remote)',
    period: 'Sep 2022 – Apr 2024',
    desc: 'Spearheaded blockchain-oriented test automation, integrating Web3Auth wallets and verifying transactions. Created E2E scripts for AI image generation, crypto economy, user content, and payments, monitoring quality across 10+ mobile devices. Authored documentation and built a multi-platform automation framework.',
  },
  {
    title: 'QA Automation Engineer',
    company: 'Baptist Health, Florida, USA (Remote)',
    period: 'Jul 2022 – Jun 2023',
    desc: 'Optimized QA processes for hospitals and pharmacies with regression, smoke, and sanity testing in an Agile framework. Conducted failure analysis and engaged in the full project lifecycle, from requirements analysis to risk identification, ensuring comprehensive quality.',
  },
  {
    title: 'QA Automation MID',
    company: 'Popular Bank, Dominican Republic (Hybrid)',
    period: 'Apr 2021 – Jul 2022',
    desc: 'Deployed Appium from scratch for native Android/iOS testing, increasing test speed by 4x. Designed and implemented a strategic testing plan, established an integrated QA environment, and implemented a CI system to enhance development pipeline efficiency.',
  },
  {
    title: 'Software Test Engineer',
    company: 'Metaconxept, Dominican Republic (On-Site)',
    period: 'Jul 2019 – Apr 2021',
    desc: 'Implemented a modern, low-code automation tool and migrated old scripts to elevate quality for a banking project. Collaborated with cross-functional teams to review specifications and ensure alignment with requirements and Agile methodologies.',
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
    const jobElements = screen.getAllByRole('article');
    expect(jobElements.length).toBe(experiencesData.length);
  });

  test('renders details for each experience job correctly', () => {
    const jobElements = screen.getAllByRole('article'); 

    expect(jobElements.length).toBe(experiencesData.length);

    experiencesData.forEach((jobData, index) => {
      const jobElement = jobElements[index];
      const utils = within(jobElement);

      expect(utils.getByRole('heading', { name: jobData.title, level: 3 })).toBeInTheDocument();
      expect(utils.getByText(jobData.company)).toBeInTheDocument();
      expect(utils.getByText(jobData.period)).toBeInTheDocument(); // Period is no longer in parentheses
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
