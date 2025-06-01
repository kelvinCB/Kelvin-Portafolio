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

test.describe('Navigation Bar E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting URL before each test
    await page.goto('/');
  });

  test('should navigate to About Me section when About Me link is clicked', async ({ page }) => {
    // Find the navigation link by text/href
    const navLinkLocator = page.locator('nav a[href="#about"]');
    
    // Click the navigation link
    await navLinkLocator.click();

    // Locate the target section
    const sectionLocator = page.locator('#about');

    // Assert that the section is in the viewport
    await expect(sectionLocator).toBeInViewport();

    // Assert that the URL hash is updated correctly
    await expect(page).toHaveURL(/#about$/);

    // Locate the main and secondary titles
    const mainTitleLocator = page.locator('.hero-title');
    const secondaryTitleLocator = page.locator('.role-title');

    // Assert that the main title is visible and has the correct text
    await expect(mainTitleLocator).toBeVisible();
    await expect(mainTitleLocator).toContainText('Hello! I am Kelvin Calcaño');
    
    // Assert that the secondary title is visible and has the correct text
    await expect(secondaryTitleLocator).toBeVisible();
    await expect(secondaryTitleLocator).toContainText('Senior QA Automation Engineer');
    
    // Pause for 1 seconds to visually see the scroll effect
    console.log('Waiting 1 seconds before taking screenshot for About Me...');
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it with the test case name
    try {
      const screenshotFileName = 'navigate-to-about-me.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for About Me: ${err.message}`);
    }
  });

  test('should navigate to Portfolio section when Portfolio link is clicked', async ({ page }) => {
    // Find the navigation link by text/href
    const navLinkLocator = page.locator('nav a[href="#portfolio"]');
    
    // Click the navigation link
    await navLinkLocator.click();

    // Locate the target section
    const sectionLocator = page.locator('#portfolio');

    // Assert that the section is in the viewport
    await expect(sectionLocator).toBeInViewport();

    // Assert that the URL hash is updated correctly
    await expect(page).toHaveURL(/#portfolio$/);

    // Locate the main and secondary titles
    const mainTitleLocator = page.locator('.portfolio-header .section-title');
    const secondaryTitleLocator = page.locator('.portfolio-subtitle');

    // Assert that the main title is visible and has the correct text
    await expect(mainTitleLocator).toBeVisible();
    await expect(mainTitleLocator).toContainText('My Portfolio');
    
    // Assert that the secondary title is visible and has the correct text
    await expect(secondaryTitleLocator).toBeVisible();
    await expect(secondaryTitleLocator).toContainText('A selection of my most recent and noteworthy automation projects');
    
    // Pause for 1 seconds to visually see the scroll effect
    console.log('Waiting 1 seconds before taking screenshot for Portfolio...');
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it with the test case name
    try {
      const screenshotFileName = 'navigate-to-portfolio.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for Portfolio: ${err.message}`);
    }
  });

  test('should navigate to Experience section when Experience link is clicked', async ({ page }) => {
    // Find the navigation link by text/href
    const navLinkLocator = page.locator('nav a[href="#experience"]');
    
    // Click the navigation link
    await navLinkLocator.click();

    // Locate the target section
    const sectionLocator = page.locator('#experience');

    // Assert that the section is in the viewport
    await expect(sectionLocator).toBeInViewport();

    // Assert that the URL hash is updated correctly
    await expect(page).toHaveURL(/#experience$/);

    // Locate the main and secondary titles
    const mainTitleLocator = page.locator('.experience-header .section-title');
    const secondaryTitleLocator = page.locator('.experience-subtitle');

    // Assert that the main title is visible and has the correct text
    await expect(mainTitleLocator).toBeVisible();
    await expect(mainTitleLocator).toContainText('My Experience');
    
    // Assert that the secondary title is visible and has the correct text
    await expect(secondaryTitleLocator).toBeVisible();
    await expect(secondaryTitleLocator).toContainText('My professional journey in quality assurance and automation');
    
    // Pause for 1 seconds to visually see the scroll effect
    console.log('Waiting 1 seconds before taking screenshot for Experience...');
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it with the test case name
    try {
      const screenshotFileName = 'navigate-to-experience.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for Experience: ${err.message}`);
    }
  });

  test('should navigate to Contact Me section when Contact Me link is clicked', async ({ page }) => {
    // Find the navigation link by text/href
    const navLinkLocator = page.locator('nav a[href="#contact"]');
    
    // Click the navigation link
    await navLinkLocator.click();

    // Locate the target section
    const sectionLocator = page.locator('#contact');

    // Assert that the section is in the viewport
    await expect(sectionLocator).toBeInViewport();

    // Assert that the URL hash is updated correctly
    await expect(page).toHaveURL(/#contact$/);

    // Locate the main and secondary titles
    const mainTitleLocator = page.locator('.contact-header .section-title');
    const secondaryTitleLocator = page.locator('.contact-subtitle');

    // Assert that the main title is visible and has the correct text
    await expect(mainTitleLocator).toBeVisible();
    await expect(mainTitleLocator).toContainText('Contact Me');
    
    // Assert that the secondary title is visible and has the correct text
    await expect(secondaryTitleLocator).toBeVisible();
    await expect(secondaryTitleLocator).toContainText('Do you have a project in mind or want to talk about QA Automation opportunities? I\'m here to help');
    
    // Pause for 1 seconds to visually see the scroll effect
    console.log('Waiting 1 seconds before taking screenshot for Contact Me...');
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it with the test case name
    try {
      const screenshotFileName = 'navigate-to-contact-me.png';
      const screenshotPath = path.join(screenshotDir, screenshotFileName);
      console.log(`Taking screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved successfully: ${screenshotFileName}`);
    } catch (err) {
      console.error(`Error taking screenshot for Contact Me: ${err.message}`);
    }
  });
});
