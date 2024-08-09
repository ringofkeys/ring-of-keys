import test, { expect } from "@playwright/test";

test.describe('dashboard with various profiles', () => {
    test('happy path, no changes', async ({ page }) => {
        // We're already authenticated in the setup
        await page.goto('/dashboard');
        await expect(page.getByRole('link', { name: 'My Account' })).toBeVisible()
    })
})