// tests/visual/screenshot.mjs
// Usage : node tests/visual/screenshot.mjs <url> <output-dir>
// Prend des screenshots pleine page sur les 5 viewports définis.

import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const VIEWPORTS = [
  { name: 'desktop-large', width: 1920, height: 1080 },
  { name: 'desktop',       width: 1280, height: 800  },
  { name: 'tablet',        width: 768,  height: 1024 },
  { name: 'mobile',        width: 390,  height: 844  },
  { name: 'mobile-small',  width: 375,  height: 667  },
];

async function run(url, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Laisser les animations se terminer
    // Figer les animations pour des captures déterministes
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; transition-duration: 0s !important; }' });
    const file = path.join(outputDir, `${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await page.close();
    console.log(`✅ ${vp.name} → ${file}`);
  }

  await browser.close();
}

const [url, outputDir] = process.argv.slice(2);
if (!url || !outputDir) {
  console.error('Usage: node tests/visual/screenshot.mjs <url> <output-dir>');
  process.exit(1);
}
run(url, outputDir).catch(err => { console.error(err); process.exit(1); });
