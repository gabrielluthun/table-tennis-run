# Table Tennis Run

SPA type arcade : tu saisis le score d’un match de ping-pong **après** la partie, l’app calcule une **distance de course à pied** (km) à « payer », et cumule l’historique en LocalStorage.

Démo (après merge sur `main` + Pages activé) :
**https://gabrielluthun.github.io/table-tennis-run/**

## Stack

- **Vue 3** + TypeScript (Composition API, `<script setup>`)
- **Vite 8** + SCSS (aucune lib UI)
- **LocalStorage** (matchs + réglages)
- Déploiement **GitHub Pages** via Actions

## Fonctionnalités

- Saisie post-match (sets validés, feedback par set, Enter / Escape)
- Formats **BO3 / BO5**, sets à **11** ou **21** (écart de 2)
- Révélation animée victoire / défaite + badges spéciaux
- Historique : total km, stats V/D, suppression unitaire ou wipe
- Panneau **Options** : noms, format, son arcade, confirm delete, export / import JSON
- Aide **Comment ça marche** (bas à droite)
- Respect de `prefers-reduced-motion`

## Setup local

```bash
npm install
npm run dev
```

Ouvre l’URL Vite affichée dans le terminal (souvent `http://localhost:5173/`).

## Scripts

| Commande           | Rôle                          |
| ------------------ | ----------------------------- |
| `npm run dev`      | Serveur de développement      |
| `npm run build`    | Build TypeScript + bundle     |
| `npm run preview`  | Prévisualise le build `dist/` |

Build GitHub Pages (base `/table-tennis-run/`) :

```bash
GITHUB_PAGES=true npm run build
```

## Usage

1. Configure éventuellement **Options** (noms, BO3/BO5, 11/21)
2. Joue ton match hors app
3. Saisis les scores set par set
4. Valide → écran de révélation avec la distance km
5. L’historique cumule tes km de peine

## Règles métier (résumé)

- Format paramétrable : premier à **2** sets (BO3) ou **3** sets (BO5)
- Set gagné à **11** ou **21** points min., écart de **2**
- Distance par set : écart, « bulles », deuce, pression selon l’ordre des sets, multiplicateurs choke / remontada
- Badges détectés sur la séquence (ex. balle de match, remontada)

La logique pure vit dans `src/domain/` (validation, calcul, badges, stats).

## Architecture

```
src/
├── constants/       # Clés storage, constantes liées aux règles
├── domain/          # Logique pure (settings, validation, distance, badges)
├── services/        # LocalStorage, export/import, son, IDs
├── composables/     # usePingPongTracker, useSettings
└── components/
    ├── score-input/ # Formulaire de scores
    ├── reveal/      # Écran de révélation
    ├── history/     # Historique + stats
    ├── options/     # Panneau de réglages
    └── help/        # Comment ça marche
```


## Licence

Projet personnel / expérimental — usage libre pour usage perso.
