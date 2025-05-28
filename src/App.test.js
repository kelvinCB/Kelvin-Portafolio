import { render, screen, within } from '@testing-library/react';
import App from './App';
// Ensure App is imported if not already
// import App from './App'; 

test('renders header with logo text "Kelvin" and "QA"', () => {
  render(<App />);
  // Find the div with class 'logo'
  // It's better to use a more specific selector if possible, like a test-id
  // For now, assuming there's only one element with class 'logo' or it's the one we want.
  const logoContainer = screen.getByRole('banner').querySelector('.logo'); // Assuming header is role 'banner'
  // If not banner, or if .logo is not unique enough, we might need to adjust the selector above.
  // A more robust way if you can add test-ids: screen.getByTestId('app-logo');
  
  expect(logoContainer).toBeInTheDocument();

  // Now search within the logo container
  const kelvinLogoPart = within(logoContainer).getByText('Kelvin');
  const qaLogoPart = within(logoContainer).getByText('QA');
  
  expect(kelvinLogoPart).toBeInTheDocument();
  expect(qaLogoPart).toBeInTheDocument();
  
  expect(kelvinLogoPart.tagName).toBe('SPAN');
  expect(kelvinLogoPart).toHaveClass('logo-blue');
  expect(qaLogoPart.tagName).toBe('SPAN');
  expect(qaLogoPart).toHaveClass('logo-purple');
});
