// tests/contact-form.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Ensure the screenshot directory exists
const screenshotDir = path.resolve('./test-screenshots');
try {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  console.log(`Screenshot directory ready: ${screenshotDir}`);
} catch (err) {
  console.error(`Error creating screenshot directory: ${err.message}`);
}

test.describe('Contact Form', () => {
  // Common setup for tests that interact with the form
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle'); // Wait for network to be idle
    // Ensure the form title is visible by scrolling to it if necessary
    const formTitleForScroll = page.locator('h3', { hasText: 'Send Me a Message' }); // Changed h2 to h3
    await formTitleForScroll.waitFor({ state: 'visible', timeout: 15000 }); // Explicit wait
    await formTitleForScroll.scrollIntoViewIfNeeded({ timeout: 15000 }); // Scroll with timeout
  });

  test('should display the contact form and navigate to it', async ({ page }) => {
    // This test primarily checks visibility after initial page load and scroll (done in beforeEach)
    const contactSectionTitle = page.locator('h2', { hasText: 'Contact Me' });
    await expect(contactSectionTitle).toBeVisible();
    const formTitle = page.locator('h3', { hasText: 'Send Me a Message' }); // Changed h2 to h3
    await expect(formTitle).toBeVisible();

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for contact form display...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-display.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for contact form display: ${err.message}`);
    }
  });

  test('should submit the form successfully with valid data', async ({ page }) => {
    // Skip this test in development since it requires PostgreSQL
    test.skip(process.env.TARGET_ENV !== 'production', 'Skipping in development - requires PostgreSQL');

    const fullNameInput = page.getByLabel('Full Name');
    await fullNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await fullNameInput.fill('Test User');

    const emailInput = page.getByLabel('Email');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill('test.user@example.com');

    const messageTextbox = page.getByRole('textbox', { name: 'Message' });
    await messageTextbox.waitFor({ state: 'visible', timeout: 5000 });
    await messageTextbox.fill('This is a test message from Playwright!');

    await page.getByRole('button', { name: 'Send message' }).click();

    const successMessage = page.locator('text=Thank you for your message! I will contact you soon.');
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for successful form submission...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-success.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for successful form submission: ${err.message}`);
    }
  });

  test('should display error for empty Full Name field', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message.');
    await page.getByRole('button', { name: 'Send message' }).click();
    const errorMessage = page.locator('text=Name is required.');
    await expect(errorMessage).toBeVisible();

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for empty name error...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-empty-name-error.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for empty name error: ${err.message}`);
    }
  });

  test('should display error for empty Email field', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message.');
    await page.getByRole('button', { name: 'Send message' }).click();
    const errorMessage = page.locator('text=Email is required.');
    await expect(errorMessage).toBeVisible();

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for empty email error...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-empty-email-error.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for empty email error: ${err.message}`);
    }
  });

  test('should display error for invalid Email format', async ({ page }) => {
    // Disable native HTML5 validation to test custom JS validation
    const form = page.locator('form.contact-form'); // Assuming your form has class 'contact-form'
    await form.evaluate(element => element.setAttribute('novalidate', 'true'));

    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('invalid-email'); // This should now trigger custom validation
    await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message.');
    await page.getByRole('button', { name: 'Send message' }).click();
    const errorMessage = page.locator('text=Email format is not valid.');
    await expect(errorMessage).toBeVisible();

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for invalid email format error...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-invalid-email-format.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for invalid email format: ${err.message}`);
    }
  });

  test('should display error for empty Message field', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Send message' }).click();
    const errorMessage = page.locator('text=Message is required.');
    await expect(errorMessage).toBeVisible();

    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for empty message error...');
    await page.waitForTimeout(1000);

    // Take a screenshot and save it
    try {
      const screenshotFileName = 'contact-form-empty-message-error.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for empty message error: ${err.message}`);
    }
  });
});
