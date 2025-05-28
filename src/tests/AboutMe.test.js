import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AboutMe from '../components/AboutMe';

describe('AboutMe Component', () => {
  it('renders main titles, description, and profile image', () => {
    render(<AboutMe />);
    expect(screen.getByText(/WELCOME TO MY WORLD/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am/i)).toBeInTheDocument();
    expect(screen.getByText(/QA Automation Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineer specialized in automation/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Kelvin Calcano QA Automation/i)).toBeInTheDocument();
  });

  it('renders Download CV button and simulates click', () => {
    window.alert = jest.fn();
    render(<AboutMe />);
    const downloadBtn = screen.getByRole('button', { name: /Download my CV/i });
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/CV downloaded/i));
  });

  it('renders Contact me button with anchor', () => {
    render(<AboutMe />);
    const contactBtn = screen.getByRole('link', { name: /Contact me/i });
    expect(contactBtn).toBeInTheDocument();
    expect(contactBtn).toHaveAttribute('href', '#contact');
  });

  it('renders all skill cards with icons and titles', () => {
    const { container } = render(<AboutMe />);
    expect(screen.getByText(/Automation Scripts/i)).toBeInTheDocument();
    expect(screen.getByText(/Bug Detection/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/CI\/CD Pipeline/i)).toBeInTheDocument();
    // Check for the skill-card divs directly
    const skillCards = container.querySelectorAll('.skill-card');
    expect(skillCards.length).toBe(4);
  });
});
