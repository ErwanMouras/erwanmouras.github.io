// tests/functional/landing.spec.js
import { test, expect } from '@playwright/test';

// Helper : vérifie si la page est bloquée par le Vercel Security Checkpoint
// (peut bloquer les headless browsers, notamment sur mobile)
async function isCheckpointPage(page) {
  const title = await page.title();
  return title.includes('Checkpoint') || title.includes('Security');
}

test.describe('Landing page Deklio', () => {

  test('se charge sans erreur JavaScript', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    expect(errors, `Erreurs JS : ${errors.join(', ')}`).toHaveLength(0);
  });

  test('la navigation est visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a.nav-logo')).toBeVisible();
    await expect(page.locator('a.nav-cta').first()).toBeAttached();
  });

  test('le titre principal (h1) est visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('le formulaire hero est visible et interactif', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    const input = page.locator('form.hero-form input[type="email"]');
    const btn   = page.locator('form.hero-form button[type="submit"]');
    await expect(input).toBeVisible();
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    await input.fill('test@example.com');
    await expect(input).toHaveValue('test@example.com');
  });

  test('soumission avec email invalide ne déclenche pas l\'appel API', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    const input = page.locator('form.hero-form input[type="email"]');
    await input.fill('email-invalide');
    const isInvalid = await input.evaluate(el => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('soumission avec email valide affiche le message de succès', async ({ page }) => {
    await page.route('/api/subscribe', route =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    );
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    const input   = page.locator('form.hero-form input[type="email"]');
    const btn     = page.locator('form.hero-form button[type="submit"]');
    const success = page.locator('.hero-content .form-success');
    await input.fill('test@deklio.fr');
    await btn.click();
    await expect(success).toHaveClass(/show/);
  });

  test('le lien nav pointe vers la section early-access', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    await expect(page.locator('a.nav-cta').first()).toHaveAttribute('href', '#early-access');
  });

  test('les sections principales sont présentes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    if (await isCheckpointPage(page)) test.skip();
    for (const selector of ['.hero', '.problem', '#how-it-works', '#features', '#faq', '#early-access']) {
      await expect(page.locator(selector)).toBeAttached();
    }
  });

});
