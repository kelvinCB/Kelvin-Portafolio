import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../../components/Navigation';

describe('Navigation', () => {
  const mockSetActiveSection = jest.fn();
  const mockToggleMobileMenu = jest.fn();
  const mockScrollToTop = jest.fn();

  const setup = (activeSection = 'about', mobileMenuOpen = false) => {
    render(
      <Navigation
        activeSection={activeSection}
        setActiveSection={mockSetActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={mockToggleMobileMenu}
        scrollToTop={mockScrollToTop}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo with correct text', () => {
    setup();
    expect(screen.getByText('Kelvin')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
    expect(screen.getByText('Kelvin')).toHaveClass('logo-blue');
    expect(screen.getByText('QA')).toHaveClass('logo-purple');
  });

  it('calls scrollToTop when clicking the logo', () => {
    setup();
    fireEvent.click(screen.getByText('Kelvin'));
    expect(mockScrollToTop).toHaveBeenCalled();
  });

  it('renders all navigation links', () => {
    setup();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Contact Me')).toBeInTheDocument();
  });

  it('highlights the active section', () => {
    setup('portfolio');
    expect(screen.getByText('Portfolio')).toHaveClass('active');
    expect(screen.getByText('About Me')).not.toHaveClass('active');
  });

  it('calls setActiveSection when clicking a nav link', () => {
    setup();
    fireEvent.click(screen.getByText('Portfolio'));
    expect(mockSetActiveSection).toHaveBeenCalledWith('portfolio');
  });

  it('renders and triggers the mobile menu button', () => {
    setup();
    const menuButton = screen.getByRole('button', { name: /☰/ });
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(mockToggleMobileMenu).toHaveBeenCalled();
  });

  it('applies menu-open class when mobileMenuOpen is true', () => {
    setup('about', true);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toMatch(/menu-open/);
  });
});
