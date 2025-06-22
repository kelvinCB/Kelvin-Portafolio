// Declare mockXHR variable that will hold the mock instance for each test
let mockXHR_instance;

// Mock XMLHttpRequest constructor at the VERY TOP, before any other imports
global.XMLHttpRequest = jest.fn(() => mockXHR_instance);

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Contact from '../../components/Contact';

describe('Contact Component', () => {
  beforeEach(() => {
    // Re-initialize mockXHR_instance in beforeEach
    mockXHR_instance = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      responseText: '',
      status: 200,
      onload: null,
      onerror: null,
    };
    global.XMLHttpRequest.mockImplementationOnce(() => mockXHR_instance);
    mockXHR_instance.open.mockClear();
    mockXHR_instance.send.mockClear();
    mockXHR_instance.setRequestHeader.mockClear();
    mockXHR_instance.onload = null;
    mockXHR_instance.onerror = null;
    mockXHR_instance.status = 200;
    mockXHR_instance.responseText = JSON.stringify({}); // Default success payload
  });

  it('renders all form fields and contact info', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument();
    // expect(screen.getByText(/Call Me/i)).toBeInTheDocument(); // OLD - Corrected based on DOM output
    expect(screen.getByText(/\+1 829 969 8254/i)).toBeInTheDocument(); // NEW
    // Email aparece múltiples veces (label y h4), usamos getAllByText
    expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Santo Domingo, Dominican Republic/i)).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty or invalid', async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Message is required/i)).toBeInTheDocument();
    // Invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));
    expect(await screen.findByText(/Email format is not valid/i)).toBeInTheDocument();
  });

  it('shows phone validation error for invalid phone', async () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));
    expect(await screen.findByText(/Phone number is not valid/i)).toBeInTheDocument();
  });

  it('submits the form and shows success message', async () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));
    
    // Simulate successful XHR response by setting status and responseText
    mockXHR_instance.status = 200;
    mockXHR_instance.responseText = JSON.stringify({ message: 'Thank you for your message! I will contact you soon.' });

    // Manually trigger the onload handler that Contact.js should have set, wrapped in act
    if (typeof mockXHR_instance.onload === 'function') {
      act(() => {
        mockXHR_instance.onload();
      });
    } else {
      throw new Error('mockXHR_instance.onload was not set by the component or is not a function');
    }

    await waitFor(() => {
      expect(screen.getByText(/Thank you for your message! I will contact you soon./i)).toBeInTheDocument();
      // Debug: log the button's HTML to inspect its state
      const button = screen.getByRole('button', { name: /Send message/i });
      // eslint-disable-next-line no-console
      console.log('Button after submit:', button.outerHTML, 'disabled:', button.disabled);
      expect(button).toBeDisabled();
    }, { timeout: 2000 }); // Increased timeout to 2 seconds
    expect(mockXHR_instance.send).toHaveBeenCalledTimes(1);
    // Form fields should also be cleared after successful submission
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
  });

  it('shows error message if XHR request fails (server error)', async () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

    // Simulate XHR server error
    mockXHR_instance.status = 500;
    const serverErrorMessage = 'Internal Server Error from test';
    mockXHR_instance.responseText = JSON.stringify({ message: serverErrorMessage });

    // Manually trigger the onload handler that Contact.js should have set, wrapped in act
    if (typeof mockXHR_instance.onload === 'function') {
      act(() => {
        mockXHR_instance.onload();
      });
    } else {
      throw new Error('mockXHR_instance.onload was not set by the component or is not a function');
    }

    await waitFor(() => {
      expect(screen.getByText(serverErrorMessage)).toBeInTheDocument();
    });
    expect(mockXHR_instance.send).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Send message/i })).not.toBeDisabled();
  });

  it('shows error message if XHR request fails (network error)', async () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

    // Simulate XHR network error by manually triggering the onerror handler, wrapped in act
    if (typeof mockXHR_instance.onerror === 'function') {
      act(() => {
        mockXHR_instance.onerror();
      });
    } else {
      throw new Error('mockXHR_instance.onerror was not set by the component or is not a function');
    }

    await waitFor(() => {
      expect(screen.getByText(/Network error occurred. Please check your connection and try again./i)).toBeInTheDocument();
    });
    expect(mockXHR_instance.send).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Send message/i })).not.toBeDisabled();
  });

  it('renders social links', () => {
    render(<Contact />);
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3); // Social + email/phone links
  });
});

