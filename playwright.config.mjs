import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/functional',
  use: {
    baseURL: process.env.BASE_URL || 'https://deklio.fr',
    actionTimeout: 10000,
  },
  projects: [
    { name: 'desktop-large', use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'desktop',       use: { viewport: { width: 1280, height: 800  } } },
    { name: 'tablet',        use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'mobile',        use: { viewport: { width: 390,  height: 844  } } },
    { name: 'mobile-small',  use: { viewport: { width: 375,  height: 667  } } },
  ],
});
