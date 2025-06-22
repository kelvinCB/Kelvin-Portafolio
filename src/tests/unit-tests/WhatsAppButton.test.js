import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WhatsAppButton from '../../components/WhatsAppButton';

describe('WhatsAppButton Component', () => {
  const mockPhoneNumber = '1234567890';

  test('renders an anchor tag', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
  });

  test('constructs correct href with only phone number', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', `https://wa.me/${mockPhoneNumber}`);
  });

  test('constructs correct href with phone number and message', () => {
    const mockMessage = 'Hello there!';
    const encodedMessage = encodeURIComponent(mockMessage);
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} message={mockMessage} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', `https://wa.me/${mockPhoneNumber}?text=${encodedMessage}`);
  });

  test('has correct target, rel, and aria-label attributes', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkElement).toHaveAttribute('aria-label', 'Chat on WhatsApp');
  });

  test('renders an image inside the link', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const linkElement = screen.getByRole('link');
    const imgElement = screen.getByRole('img');
    expect(linkElement).toContainElement(imgElement);
  });

  test('image has correct src and alt attributes', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg');
    expect(imgElement).toHaveAttribute('alt', 'WhatsApp');
  });

  test('applies the correct className to the anchor tag', () => {
    render(<WhatsAppButton phoneNumber={mockPhoneNumber} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('whatsapp-float');
  });
});
