import { test, expect } from '@playwright/test';

test('basic dashboard and profile loading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Queer  The Stage' })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Directory', exact: true }).click();
  await page.getByPlaceholder('Keyword').click();
  await page.getByPlaceholder('Keyword').fill('pigg');
  await expect(page.getByRole('link', { name: 'Delaney Piggins She/They' })).toBeVisible();
  await page.getByRole('link', { name: 'Delaney Piggins She/They' }).click();
  await expect(page.getByRole('heading', { name: 'Get Access' })).toBeVisible();
});