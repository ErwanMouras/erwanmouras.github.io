# Skill : /modification

Ce skill gère le workflow complet de modification de la landing page Deklio.
Suis ces instructions exactement, dans l'ordre.

---

## Étape 1 — Identifier le type

Pose cette question exacte à l'utilisateur (en une seule fois) :

---
Quel type de modification souhaitez-vous effectuer ?

**A) Ajout** — nouvelle section, nouveau contenu
**B) Modification** — changer quelque chose d'existant
**C) Fix** — corriger un bug ou un problème visuel
**D) Suppression** — retirer un élément
---

Attends la réponse avant de continuer.

---

## Étape 2 — Poser les questions adaptées

Selon la réponse à l'étape 1, pose TOUTES les questions suivantes EN UNE SEULE fois (pas de questions séquentielles).

### Si A) Ajout

---
Merci. Voici quelques questions pour cadrer la demande :

1. **Zone** — Dans quelle section ou zone de la page ? (hero, nav, features, pricing, faq, early-access, ou préciser)
2. **Contenu** — Quel contenu ou message veux-tu ajouter ? Sois aussi précis que possible.
3. **Objectif** — Quel est l'objectif de cet ajout ? (améliorer la conversion, clarifier une information, renforcer la confiance, autre)
4. **Style** — Y a-t-il une contrainte visuelle ou éditoriale particulière au-delà des conventions Deklio habituelles ?
---

### Si B) Modification

---
Merci. Voici quelques questions pour cadrer la demande :

1. **Élément** — Quelle section ou élément existant est concerné ? (sois précis : "le bouton CTA de la nav", "le titre du hero", "la carte pricing Pro"...)
2. **Changement** — Qu'est-ce qui doit changer exactement ? (texte, couleur, taille, comportement, position...)
3. **Raison** — Pourquoi ce changement ? (problème observé, évolution stratégique, feedback, test A/B...)
---

### Si C) Fix

---
Merci. Voici quelques questions pour cadrer la demande :

1. **Bug** — Quel est le problème ou bug à corriger ?
2. **Manifestation** — Comment se manifeste-t-il ? Décris le comportement actuel vs le comportement attendu.
3. **Viewport(s)** — Sur quel(s) viewport(s) le bug est-il visible ?
   - Desktop large (1920px)
   - Desktop (1280px)
   - Tablet (768px)
   - Mobile (390px — iPhone 14)
   - Mobile small (375px — iPhone SE)
   - Tous
---

### Si D) Suppression

---
Merci. Voici quelques questions pour cadrer la demande :

1. **Élément** — Quel élément supprimer précisément ? (sois précis : sélecteur CSS, texte exact, section entière...)
2. **Raison** — Pourquoi supprimer cet élément ?
3. **Régressions** — Y a-t-il des éléments qui pointent vers cet élément ? (liens internes, scripts qui en dépendent, ancres de navigation...)
---

Attends les réponses avant de continuer.

---

## Étape 3 — Créer l'issue GitHub

À partir des réponses, génère et crée l'issue GitHub.

### Règles de titre

Format strict : `[Type] Zone — Description courte`

| Type répondu | Préfixe titre | Label |
|---|---|---|
| A) Ajout | `[Ajout]` | `enhancement` |
| B) Modification | `[Modif]` | `improvement` |
| C) Fix | `[Fix]` | `bug` |
| D) Suppression | `[Suppression]` | `chore` |

> **Prérequis :** Les labels `improvement` et `chore` doivent exister sur le repo. S'ils n'existent pas, les créer :
> ```bash
> gh label create improvement --description "Amélioration d'un élément existant" --color "0075ca" --repo ErwanMouras/erwanmouras.github.io
> gh label create chore --description "Tâche de maintenance" --color "e4e669" --repo ErwanMouras/erwanmouras.github.io
> ```

Exemples :
- `[Ajout] Hero — Ajouter une section témoignages`
- `[Modif] Nav — Changer la couleur du CTA en mobile`
- `[Fix] Formulaire — Message de succès absent sur iPhone SE`
- `[Suppression] FAQ — Retirer la question sur les prix`

### Corps de l'issue

Génère ce corps en remplissant chaque section depuis les réponses de l'utilisateur :

```
## Description
[Synthèse de la demande en 1-2 phrases]

## Contexte
[Raison du changement]

## Critères d'acceptation
- [ ] [Critère 1 concret et vérifiable]
- [ ] [Critère 2 concret et vérifiable]
- [ ] Testé sur les viewports concernés : [liste]
- [ ] Aucune régression visuelle sur les zones non modifiées

## Viewports concernés
[Liste ou "Tous"]

## Fichier à modifier
`index.html` (fichier unique)
```

### Commande gh

```bash
gh issue create \
  --title "<titre généré>" \
  --body "<corps généré>" \
  --label "<label>" \
  --repo ErwanMouras/erwanmouras.github.io
```

Affiche l'URL de l'issue créée à l'utilisateur.

Note le numéro de l'issue (ex: #42) — il sera utilisé à l'étape suivante.

---

## Étape 4 — Créer la branche

### Convention de nommage

Format : `<préfixe>/<numéro-issue>-<slug>`

| Type | Préfixe |
|---|---|
| Ajout | `feature/` |
| Modification | `feature/` |
| Fix | `fix/` |
| Suppression | `chore/` |

Le slug est le titre de l'issue en minuscules, sans accents, espaces remplacés par des tirets, préfixe `[Type]` et zone retirés.

Exemples :
- Issue #42 `[Ajout] Hero — Ajouter une section témoignages` → `feature/42-ajouter-section-temoignages`
- Issue #43 `[Fix] Formulaire — Message de succès absent sur iPhone SE` → `fix/43-message-succes-absent-iphone-se`

### Commandes

```bash
git checkout main
git pull origin main
git checkout -b <branche>
git push -u origin <branche>
```

---

## Étape 5 — Implémenter dans index.html

Lis d'abord `index.html` en entier pour comprendre la structure existante avant d'implémenter. Ce fichier fait ~2700 lignes et contient tout le HTML, CSS et JS de la landing page.

Implémente le changement demandé directement dans `index.html`.

Règles absolues :
- Respecte le design system : utilise les variables CSS existantes (`--ink`, `--paper`, `--accent`, `--font-display`, `--font-body`, `--radius`, etc.)
- Vouvoiement systématique sur tous les textes visibles
- Ton Deklio : professionnel, chaleureux, empathique — ne pas vendre "l'IA", vendre la clarté et l'organisation
- Reste cohérent avec les sections adjacentes (espacement, typographie, structure HTML)
- N'ajoute pas de nouvelles dépendances externes

---

## Étape 6 — Commiter et ouvrir la PR

```bash
git add index.html
git commit -m "<type-en-minuscules>: <description courte> (closes #<numéro>)"
git push

gh pr create \
  --title "<même titre que l'issue>" \
  --body $'Closes #<numéro>\n\n## Changements effectués\n<description des modifications>\n\n## Viewports testés\n[liste]' \
  --repo ErwanMouras/erwanmouras.github.io
```

Types de commit : `feat` (ajout), `refactor` (modification), `fix` (fix), `chore` (suppression).

Affiche l'URL de la PR à l'utilisateur et rappelle que les 3 GitHub Actions vont se déclencher automatiquement (tests NRT, régression visuelle, code review IA). La PR peut être mergée uniquement quand les 3 sont ✅.
