import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer', () => {
  it('renders the footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the logo with Kelvin and QA', () => {
    render(<Footer />);
    expect(screen.getByText('Kelvin')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
  });

  it('renders all social links with correct hrefs', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(link => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://facebook.com',
        'https://twitter.com',
        'https://linkedin.com',
        'https://instagram.com',
        'https://github.com'
      ])
    );
  });

  it('shows the current year in the copyright', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
    expect(screen.getByText(/Kelvin Calcaño/)).toBeInTheDocument();
  });
});
