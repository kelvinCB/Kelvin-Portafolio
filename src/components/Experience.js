import React from 'react';
import styled from 'styled-components';
import { FaBriefcase } from 'react-icons/fa';

const Section = styled.section`
  padding: 3rem 1.5rem;
`;
const Title = styled.h2`
  color: #ffb07c;
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
  background: #261b47;
  border-radius: 1rem;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.15);
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
`;
const JobTitle = styled.h3`
  color: #ffb07c;
  margin-bottom: 0.2rem;
`;
const Company = styled.span`
  font-weight: bold;
  color: #fff;
`;
const Period = styled.span`
  color: #ffb07c;
  font-size: 0.95rem;
`;
const Description = styled.p`
  margin: 0.5rem 0 0 0;
`;

const experiences = [
  {
    title: 'Senior Frontend Developer',
    company: 'Awesome Tech Inc.',
    period: '2023 - Present',
    desc: 'Leading the frontend team and building modern web applications with React and TypeScript.',
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    period: '2021 - 2023',
    desc: 'Designed user interfaces and improved user experience for various digital products.',
  },
  {
    title: 'Junior Web Developer',
    company: 'Startup Hub',
    period: '2019 - 2021',
    desc: 'Developed and maintained websites and landing pages using HTML, CSS, and JavaScript.',
  },
];

const Experience = () => (
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
