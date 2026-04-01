// scripts/code-review.mjs
// Lit pr.diff + CLAUDE.md, envoie à Claude Sonnet 4.6 (thinking moyen),
// poste le résultat comme commentaire GitHub.
// Env requis : ANTHROPIC_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO

import https from 'https';
import fs from 'fs';

const { ANTHROPIC_API_KEY, GITHUB_TOKEN, PR_NUMBER, REPO } = process.env;

const diff     = fs.readFileSync('pr.diff', 'utf8');
const claudeMd = fs.readFileSync('CLAUDE.md', 'utf8');

function post(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(payload) } },
      (res) => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => resolve(JSON.parse(data)));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function callClaude(prompt) {
  const result = await post('api.anthropic.com', '/v1/messages', {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-beta': 'interleaved-thinking-2025-05-14',
  }, {
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    thinking: { type: 'enabled', budget_tokens: 5000 },
    messages: [{ role: 'user', content: prompt }],
  });
  const textBlock = result.content?.find(b => b.type === 'text');
  if (!textBlock) throw new Error(`Réponse Claude inattendue : ${JSON.stringify(result)}`);
  return textBlock.text;
}

async function postGithubComment(body) {
  const [owner, repo] = REPO.split('/');
  await post('api.github.com', `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`, {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'User-Agent': 'deklio-code-review',
    'Accept': 'application/vnd.github+json',
  }, { body });
}

const prompt = `Tu es un reviewer de code expert pour le projet Deklio. Voici le contexte du projet :

${claudeMd}

---

Voici le diff de la PR à reviewer :

\`\`\`diff
${diff.slice(0, 20000)}
\`\`\`

Effectue une code review concise et structurée en vérifiant :
1. **Design system** : Les changements respectent-ils les variables CSS (--ink, --paper, --accent, etc.) et la typographie (Cormorant Garamond titres, Manrope corps) ?
2. **Conventions éditoriales** : Vouvoiement systématique ? Ton conforme à Deklio (professionnel, chaleureux, empathique) ?
3. **Performance** : Assets lourds ajoutés, CSS inutile, scripts bloquants ?
4. **Qualité** : Code lisible et cohérent avec le style existant ?

Format :
- Commence par ✅ si aucun problème bloquant, ou ⚠️ si des points nécessitent attention
- Liste les observations par catégorie, sois actionnable
- Maximum 300 mots`;

const review = await callClaude(prompt);
await postGithubComment(`## 🤖 Code review IA — Sonnet 4.6\n\n${review}`);
console.log('Code review postée avec succès.');
