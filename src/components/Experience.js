import React from 'react';
import '../styles/Experience.css';

const experiences = [
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

const Experience = ({ id }) => (
  <section id={id} className="experience-section" aria-labelledby="experience-heading">
    <div className="experience-header">
      <h2 id="experience-heading" className="section-title">My <span className="highlight">Experience</span></h2>
      <p className="experience-subtitle">My professional journey in quality assurance and automation</p>
    </div>
    <div className="experience-timeline">
      {experiences.map((job, idx) => (
        <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`} role="article">
          <div className="timeline-content">
            <h3 className="job-title">{job.title}</h3>
            <p className="company-name">{job.company}</p>
            <p className="job-period">{job.period}</p>
            <p className="job-description">{job.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Experience;
