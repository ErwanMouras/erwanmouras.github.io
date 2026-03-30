# Deklio — Landing Page

## Objectif unique

Ce repo contient uniquement la landing page de Deklio. **L'objectif est de créer la meilleure landing page possible** pour collecter des pré-inscriptions email et valider l'intérêt du marché avant de développer le produit.

Deklio est un SaaS de gestion de recherche d'emploi en France — le "cockpit" du chercheur d'emploi. Le produit n'existe pas encore.

## Architecture

```
index.html       — Toute la landing page (HTML + CSS + JS inline, fichier unique)
api/subscribe.js — Serverless function Vercel : collecte les emails via Brevo
CNAME            — deklio.fr (déployé sur Vercel)
Deklio.md        — Brief produit complet (contexte, fonctionnalités, positionnement)
```

## Stack

- **Frontend** : HTML/CSS/JS vanilla, tout dans `index.html` (aucun framework, aucun build step)
- **Backend** : Vercel Serverless Function (`api/subscribe.js`)
- **Email** : Brevo API (liste ID 3)
- **Fonts** : Cormorant Garamond (display) + Manrope (body) via Google Fonts
- **Déploiement** : Vercel → deklio.fr

## Variable d'environnement requise

```
BREVO_KEY=<clé API Brevo>
```

## Design system

Défini dans les CSS variables de `index.html` :

- **Couleurs** : `--ink` (#0c0c1d), `--paper` (#f7f7f5), `--accent` (#4f6ef7 → #7c5cfc)
- **Typographie** : serif Cormorant Garamond pour les titres, Manrope sans-serif pour le corps
- **Ton visuel** : premium, épuré, professionnel mais chaleureux — pas startup tech générique

## Contraintes éditoriales

- Vouvoiement systématique sur tous les textes publics
- Le mot "déclic" est le fil rouge de la communication
- Ne pas vendre "l'IA" — vendre la clarté, l'organisation, l'avantage concret
- Spécificité française : conventions CV FR, lettre de motivation, France Travail, APEC, WTTJ

## Contexte produit

Voir [Deklio.md](Deklio.md) pour le brief complet : problème, positionnement, fonctionnalités, cible, modèle économique, personnalité de marque.

## Commande /modification

Déclenche le workflow complet de modification :
1. Formulaire conversationnel adapté au type (Ajout / Modification / Fix / Suppression)
2. Création automatique d'une issue GitHub structurée avec label adapté
3. Création de la branche (`feature/`, `fix/`, ou `chore/`) liée à l'issue
4. Implémentation dans `index.html`
5. Ouverture de la PR avec `Closes #<issue>` pour fermeture automatique

**Usage :** Taper `/modification` dans Claude Code dans ce repo.

**Labels GitHub disponibles :**
- `enhancement` — Ajout
- `improvement` — Modification
- `bug` — Fix
- `chore` — Suppression
