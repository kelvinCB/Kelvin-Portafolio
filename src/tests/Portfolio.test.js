import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Portfolio from '../components/Portfolio';

describe('Portfolio', () => {
  it('renders the portfolio section and title', () => {
    render(<Portfolio />);
    // Use getByText for the title since region has no accessible name
    expect(screen.getByText(/My/)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio/)).toBeInTheDocument();
  });

  it('renders all category filter buttons', () => {
    render(<Portfolio />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('renders all projects by default (All filter)', () => {
    render(<Portfolio />);
    // There are 6 projects in the array
    expect(screen.getAllByText(/View Project/).length).toBe(6);
  });

  it('filters projects by category', () => {
    render(<Portfolio />);
    fireEvent.click(screen.getByText('Mobile'));
    // Only 1 project with category 'Mobile Testing'
    expect(screen.getAllByText(/View Project/).length).toBe(1);
    expect(screen.getByText('Mobile Testing')).toBeInTheDocument();
  });

  it('renders project details: title, category, description, and links', () => {
    render(<Portfolio />);
    expect(screen.getByText('QA Automation Dashboard')).toBeInTheDocument();
    // There may be multiple 'Web Automation' categories, check that at least one exists
    expect(screen.getAllByText('Web Automation').length).toBeGreaterThan(0);
    expect(screen.getByText(/Dashboard for monitoring automated tests/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /View Project/ })[0]).toHaveAttribute('target', '_blank');
    expect(screen.getAllByRole('link', { name: /Details/ })[0]).toHaveAttribute('target', '_blank');
  });
});
