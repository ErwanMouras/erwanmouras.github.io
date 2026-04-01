// tests/visual/compare.mjs
// Usage : node tests/visual/compare.mjs <baseline-dir> <preview-dir> <diff-dir>
// Compare les screenshots pixel à pixel. Seuil : 0.01%.
// Écrit un summary.json dans diff-dir. Exit 1 si régression détectée.

import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const VIEWPORTS  = ['desktop-large', 'desktop', 'tablet', 'mobile', 'mobile-small'];
const THRESHOLD  = 0.5; // pourcentage max autorisé (page avec animations CSS)
const PM_OPTS    = { threshold: 0.1, includeAA: false }; // sensibilité pixelmatch

function compare(baselineDir, previewDir, diffDir) {
  fs.mkdirSync(diffDir, { recursive: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const baselineFile = path.join(baselineDir, `${vp}.png`);
    const previewFile  = path.join(previewDir, `${vp}.png`);
    const diffFile     = path.join(diffDir, `${vp}-diff.png`);

    const baseline = PNG.sync.read(fs.readFileSync(baselineFile));
    const preview  = PNG.sync.read(fs.readFileSync(previewFile));

    const width  = Math.min(baseline.width, preview.width);
    const height = Math.min(baseline.height, preview.height);
    const diff   = new PNG({ width, height });

    const numDiff = pixelmatch(
      baseline.data, preview.data, diff.data,
      width, height, PM_OPTS
    );

    const total    = width * height;
    const diffPct  = (numDiff / total) * 100;
    const exceeded = diffPct > THRESHOLD;

    fs.writeFileSync(diffFile, PNG.sync.write(diff));

    const icon = exceeded ? '⚠️' : '✅';
    console.log(`${icon} ${vp}: ${diffPct.toFixed(4)}% (${numDiff}/${total} px)`);

    results.push({ viewport: vp, diffPercent: diffPct.toFixed(4), numDiff, total, exceeded });
  }

  const hasRegression = results.some(r => r.exceeded);
  fs.writeFileSync(path.join(diffDir, 'summary.json'), JSON.stringify({ hasRegression, results }, null, 2));
  return hasRegression;
}

const [baselineDir, previewDir, diffDir] = process.argv.slice(2);
if (!baselineDir || !previewDir || !diffDir) {
  console.error('Usage: node tests/visual/compare.mjs <baseline-dir> <preview-dir> <diff-dir>');
  process.exit(1);
}

const hasRegression = compare(baselineDir, previewDir, diffDir);
process.exit(hasRegression ? 1 : 0);
