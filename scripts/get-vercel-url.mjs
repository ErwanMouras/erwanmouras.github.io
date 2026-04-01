// scripts/get-vercel-url.mjs
// Vérifie UNE FOIS si un déploiement Vercel READY existe pour le SHA courant.
// Exit 0 + stdout = URL si trouvé. Exit 1 si non trouvé.
// La logique de retry (30 essais, sleep 10s) est gérée dans le YAML GitHub Actions.
// Usage : VERCEL_TOKEN=xxx GITHUB_SHA=abc node scripts/get-vercel-url.mjs

import https from 'https';

const TOKEN      = process.env.VERCEL_TOKEN;
const SHA        = process.env.GITHUB_SHA;
const PROJECT_ID = 'prj_FlNKnf0z77QXv5yVUBZiL4gH8IdF';
const TEAM_ID    = 'team_x4fHaEcQRkDiYj94tLU5g4Kb';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: `Bearer ${TOKEN}` } }, (res) => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const apiPath = `/v6/deployments?teamId=${TEAM_ID}&projectId=${PROJECT_ID}&meta-githubCommitSha=${SHA}&limit=5`;
const json    = await get(`https://api.vercel.com${apiPath}`);
const ready   = json.deployments?.find(d => d.state === 'READY');

if (ready) {
  console.log(`https://${ready.url}`);
  process.exit(0);
} else {
  process.exit(1);
}
