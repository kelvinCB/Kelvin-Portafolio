import React from 'react';
import { render, screen } from '@testing-library/react';
import BackgroundElements from '../../components/BackgroundElements';

describe('BackgroundElements Component', () => {
  test('renders the main background-elements container', () => {
    const { container } = render(<BackgroundElements />);
    expect(container.firstChild).toHaveClass('background-elements');
  });

  test('renders all triangle elements', () => {
    const { container } = render(<BackgroundElements />);
    const triangles = container.querySelectorAll('.triangle');
    expect(triangles.length).toBe(3);
  });

  test('renders all dots-group elements and their dots', () => {
    const { container } = render(<BackgroundElements />);
    const dotsGroups = container.querySelectorAll('.dots-group');
    expect(dotsGroups.length).toBe(2);
    dotsGroups.forEach(group => {
      const dots = group.querySelectorAll('.dot');
      expect(dots.length).toBe(9);
    });
  });

  test('renders decorative shape elements', () => {
    const { container } = render(<BackgroundElements />);
    const circleShape = container.querySelector('.shape.circle');
    const ringShape = container.querySelector('.shape.ring');
    expect(circleShape).toBeInTheDocument();
    expect(ringShape).toBeInTheDocument();
  });

  test('renders line elements', () => {
    const { container } = render(<BackgroundElements />);
    const lines = container.querySelectorAll('.line');
    expect(lines.length).toBe(2);
  });
});
