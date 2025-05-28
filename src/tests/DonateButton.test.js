import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DonateButton from '../components/DonateButton';

// Mockear window.alert
global.alert = jest.fn();

// Mockear window.location.href
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { ...originalLocation, href: '' };
});

afterAll(() => {
  window.location = originalLocation;
});

// Mockear fetch
global.fetch = jest.fn();

// Mockear el módulo de imagen para que Jest no intente cargarlo
jest.mock('../resources/donation.png', () => 'donation.png');

describe('DonateButton Component', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    global.alert.mockClear();
    global.fetch.mockClear();
    window.location.href = ''; // Resetear href
  });

  describe('Floating Button and Initial State', () => {
    test('renders the floating donate button', () => {
      render(<DonateButton />);
      const floatButton = screen.getByRole('button', { name: /make a donation/i });
      expect(floatButton).toBeInTheDocument();
      const img = screen.getByAltText('Donate');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'donation.png'); // Verifica el mock
    });

    test('modal is initially closed', () => {
      render(<DonateButton />);
      expect(screen.queryByText(/support my work!/i)).not.toBeInTheDocument();
    });
  });

  describe('Modal Interaction (Open/Close)', () => {
    test('opens the modal on floating button click', () => {
      render(<DonateButton />);
      const floatButton = screen.getByRole('button', { name: /make a donation/i });
      fireEvent.click(floatButton);
      expect(screen.getByText(/support my work!/i)).toBeInTheDocument();
    });

    test('closes the modal on close button click', () => {
      render(<DonateButton />);
      const floatButton = screen.getByRole('button', { name: /make a donation/i });
      fireEvent.click(floatButton); // Abrir modal

      const closeButton = screen.getByRole('button', { name: /×/i });
      fireEvent.click(closeButton);
      expect(screen.queryByText(/support my work!/i)).not.toBeInTheDocument();
    });
  });

  describe('Modal Content (When Open)', () => {
    let container;
    beforeEach(() => {
      // Abrir el modal para estas pruebas
      const renderResult = render(<DonateButton />);
      container = renderResult.container; // Hacer container disponible
      const floatButton = screen.getByRole('button', { name: /make a donation/i });
      fireEvent.click(floatButton);
    });

    test('renders modal title and introductory text', () => {
      expect(screen.getByRole('heading', { name: /support my work!/i })).toBeInTheDocument();
      expect(screen.getByText(/thank you for considering a donation/i)).toBeInTheDocument();
    });

    describe('PayPal Section', () => {
      test('renders PayPal donation section correctly', () => {
        // container ya está disponible desde el beforeEach
        expect(screen.getByRole('heading', { name: /donate with paypal/i })).toBeInTheDocument();
        // Use a more specific selector for the form if getByRole('form') is problematic
        const paypalOptionDiv = screen.getByRole('heading', { name: /donate with paypal/i }).closest('.paypal-option');
        const paypalForm = paypalOptionDiv.querySelector('form'); // O container.querySelector('.paypal-option form');
        expect(paypalForm).toBeInTheDocument();
        expect(paypalForm).toHaveAttribute('action', 'https://www.paypal.com/donate');
        expect(screen.getByDisplayValue('kelvinr02@hotmail.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
        expect(screen.getByAltText('Donate with PayPal button')).toBeInTheDocument();
      });
    });

    describe('Stripe Section', () => {
      test('renders Stripe donation section correctly', () => {
        expect(screen.getByRole('heading', { name: /donate with card/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^\$5$/i })).toBeInTheDocument(); // Exact match for $5
        expect(screen.getByRole('button', { name: /\$10/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\$20/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\$50/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/other amount:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /donate with card/i })).toBeInTheDocument();
      });

      test('$5 amount button is active by default', () => {
        const fiveDollarButton = screen.getByRole('button', { name: /^\$5$/i }); // Exact match for $5
        expect(fiveDollarButton).toHaveClass('active');
      });

      test('clicking amount buttons updates selection and active class', () => {
        const tenDollarButton = screen.getByRole('button', { name: /^\$10$/i }); // Exact match for $10
        fireEvent.click(tenDollarButton);
        expect(tenDollarButton).toHaveClass('active');
        expect(screen.getByRole('button', { name: /^\$5$/i })).not.toHaveClass('active'); // Exact match for $5
      });

      test('custom amount input updates amount', () => {
        const customAmountInput = screen.getByLabelText(/other amount:/i);
        fireEvent.change(customAmountInput, { target: { value: '15' } });
        expect(customAmountInput.value).toBe('15');
        // El botón de Stripe debería reflejar que ahora se puede donar 15
        // (indirectamente, el estado 'amount' se actualiza)
      });

      test('Stripe donate button is disabled if amount is less than 1', () => {
        const customAmountInput = screen.getByLabelText(/other amount:/i);
        fireEvent.change(customAmountInput, { target: { value: '0' } });
        const stripeButton = screen.getByRole('button', { name: /donate with card/i });
        expect(stripeButton).toBeDisabled();
      });
    });

    test('renders additional donation message', () => {
      expect(screen.getByText(/you can also contact me directly/i)).toBeInTheDocument();
    });
  });

  describe('Stripe Donation Logic (handleStripeDonate)', () => {
    beforeEach(() => {
      // Abrir el modal para estas pruebas
      render(<DonateButton />);
      const floatButton = screen.getByRole('button', { name: /make a donation/i });
      fireEvent.click(floatButton);
    });

    test('handles successful Stripe donation and redirects', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://stripe.com/checkout/session_123' }),
      });

      const stripeButton = screen.getByRole('button', { name: /donate with card/i });
      fireEvent.click(stripeButton); // Default amount is $5

      expect(stripeButton).toBeDisabled(); // Should be loading
      expect(stripeButton).toHaveTextContent('Redirecting...');

      await waitFor(() => expect(window.location.href).toBe('https://stripe.com/checkout/session_123'));
      expect(fetch).toHaveBeenCalledWith('/api/create-checkout-session', expect.any(Object));
      expect(stripeButton).not.toBeDisabled(); // Loading finished
    });

    test('handles Stripe API error (no URL in response)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: 'Session creation failed' }),
      });

      const stripeButton = screen.getByRole('button', { name: /donate with card/i });
      fireEvent.click(stripeButton);

      await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Error creating payment session.'));
      expect(window.location.href).toBe(''); // No redirection
    });

    test('handles fetch/network error for Stripe', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const stripeButton = screen.getByRole('button', { name: /donate with card/i });
      fireEvent.click(stripeButton);

      await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Error connecting to Stripe.'));
      expect(window.location.href).toBe(''); // No redirection
    });

    test('does not proceed with Stripe donation if amount is invalid', async () => {
      const customAmountInput = screen.getByLabelText(/other amount:/i);
      fireEvent.change(customAmountInput, { target: { value: '0' } });
      
      const stripeButton = screen.getByRole('button', { name: /donate with card/i });
      expect(stripeButton).toBeDisabled();
      fireEvent.click(stripeButton); // Intenta hacer clic aunque esté deshabilitado

      expect(fetch).not.toHaveBeenCalled();
      expect(global.alert).not.toHaveBeenCalled();
    });
  });
});
