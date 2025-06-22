// tests/e2e-tests/experience-section.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Experience Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const experienceSection = page.locator('#experience');
    await experienceSection.waitFor({ state: 'visible', timeout: 15000 });
    await experienceSection.scrollIntoViewIfNeeded();
  });

  test('should display the experience section and its title', async ({ page }) => {
    const sectionTitle = page.locator('#experience h2');
    await expect(sectionTitle).toBeVisible();
    await expect(sectionTitle).toContainText('My Experience');
  });

  test('should display the correct number of experience items', async ({ page }) => {
    const experienceItems = page.locator('#experience .timeline-item');
    await expect(experienceItems).toHaveCount(5);
  });

  test('should display correct details for the first experience item', async ({ page }) => {
    const firstItem = page.locator('#experience .timeline-item').first();
    
    const title = firstItem.locator('.job-title');
    await expect(title).toHaveText('Sr QA Automation Engineer');

    const company = firstItem.locator('.company-name');
    await expect(company).toHaveText('Blizzard Entertainment, Irvine, CA (Remote)');

    const period = firstItem.locator('.job-period');
    await expect(period).toHaveText('Jul 2024 – Present');

    const description = firstItem.locator('.job-description');
    await expect(description).toContainText('Designed and implemented over 100 automated test scripts');
  });
});
