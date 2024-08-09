import 'dotenv/config'
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    if (!process.env.PLAYWRIGHT_USERNAME || !process.env.PLAYWRIGHT_PASSWORD) {
    throw new Error('Please place PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD in .env');
    }

  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.getByLabel('Email').fill(process.env.PLAYWRIGHT_USERNAME);
  await page.getByLabel('Password').fill(process.env.PLAYWRIGHT_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/dashboard');

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});