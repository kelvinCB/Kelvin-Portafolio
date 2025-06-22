import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AboutMe from '../../components/AboutMe';

describe('AboutMe Component', () => {
  it('renders main titles, description, and profile image', () => {
    render(<AboutMe />);
    expect(screen.getByText(/Hello! I am/i)).toBeInTheDocument();
    expect(screen.getByText(/QA Automation Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/With over 5 years of experience in QA Automation/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Kelvin Calcaño QA Automation/i)).toBeInTheDocument();
  });

  it('renders Download CV link with correct attributes', () => {
    render(<AboutMe />);
    const downloadLink = screen.getByRole('link', { name: /Download my CV/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/resources/QA-Automation-Kelvin-Calcano-2025.pdf');
    expect(downloadLink).toHaveAttribute('download');
  });

  it('shows and hides the download toast message on click', async () => {
    jest.useFakeTimers();
    render(<AboutMe />);
    const downloadLink = screen.getByRole('link', { name: /Download my CV/i });

    fireEvent.click(downloadLink);

    // Check if the toast message appears
    let toast = await screen.findByText(/CV downloaded! Please check your downloads folder./i);
    expect(toast).toBeInTheDocument();

    // Fast-forward time by 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Check if the toast message disappears
    expect(screen.queryByText(/CV downloaded! Please check your downloads folder./i)).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('renders Contact me button with anchor', () => {
    render(<AboutMe />);
    const contactBtn = screen.getByRole('link', { name: /Contact me/i });
    expect(contactBtn).toBeInTheDocument();
    expect(contactBtn).toHaveAttribute('href', '#contact');
  });

  it('renders all skill cards with icons and titles', () => {
    const { container } = render(<AboutMe />);
    expect(screen.getByRole('heading', { name: /Automation Scripts/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Bug Detection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mobile Testing/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /CI\/CD Pipeline/i })).toBeInTheDocument();
    // Check for the skill-card divs directly
    const skillCards = container.querySelectorAll('.skill-card');
    expect(skillCards.length).toBe(4);
  });
});
