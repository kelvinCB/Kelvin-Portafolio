import { test, expect } from '@playwright/test';
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

test.describe('About Me Section E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting URL before each test
    await page.goto('/');
  });

  test('should navigate to Contact Me section when About Me Contact button is clicked', async ({ page }) => {
    // First ensure we're at the About Me section (which should be visible on load)
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    
    // Find and click the Contact Me button in the About section
    const contactButtonLocator = page.locator('.about-text .contact-btn');
    await contactButtonLocator.click();
    
    // Verify we've scrolled to the Contact section
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
    
    // Assert that the URL hash is updated correctly
    await expect(page).toHaveURL(/#contact$/);
    
    // Locate the main and secondary titles in the Contact section
    const mainTitleLocator = page.locator('.contact-header .section-title');
    const secondaryTitleLocator = page.locator('.contact-subtitle');
    
    // Assert that the main title is visible and has the correct text
    await expect(mainTitleLocator).toBeVisible();
    await expect(mainTitleLocator).toContainText('Contact Me');
    
    // Assert that the secondary title is visible and has the correct text
    await expect(secondaryTitleLocator).toBeVisible();
    await expect(secondaryTitleLocator).toContainText('Do you have a project in mind or want to talk about QA Automation opportunities? I\'m here to help');
    
    // Pause for 1 second before taking screenshot
    console.log('Waiting 1 second before taking screenshot for About contact button navigation...');
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it with the test case name
    try {
      const screenshotFileName = 'about-contact-button-navigation.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for About contact button navigation: ${err.message}`);
    }
  });
});
