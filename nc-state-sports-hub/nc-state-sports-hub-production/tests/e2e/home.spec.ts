import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/NC State Sports Hub/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Expects page to have a heading with the name of the application.
  await expect(page.getByRole('heading', { name: 'NC State Sports Hub' })).toBeVisible();
});

test('mobile menu is present on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE dimensions
  await page.goto('/');
  const mobileMenuButton = page.getByRole('button', { name: /open menu/i });
  await expect(mobileMenuButton).toBeVisible();
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const mobileMenuButton = page.getByRole('button', { name: /open menu/i });
  await mobileMenuButton.click();
  const closeMenuButton = page.getByRole('button', { name: /close menu/i });
  await expect(closeMenuButton).toBeVisible();
  await closeMenuButton.click();
  await expect(mobileMenuButton).toBeVisible();
  await expect(closeMenuButton).not.toBeVisible();
});
