# Table Tennis Run

SPA gamifiée pour tracker des matchs de ping-pong et générer un défi de course à pied en fonction du score.

## Stack

- Vue 3 + TypeScript 7 (Composition API, `<script setup>`)
- Vite 8
- SCSS néo-brutaliste (aucune lib UI)
- LocalStorage

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Joue ton match BO5 hors app
2. Saisis les scores post-match (3 à 5 sets)
3. Clique **DÉFINIR MON PROCHAIN RUN** → distance km révélée
4. L'historique cumule tes km de peine

## Règles métier

- BO5 (premier à 3 sets)
- Set gagné à 21 points minimum, écart de 2
- Algorithme par set : bulles, deuce, multiplicateurs choke/remontada

## Architecture

```
src/
├── constants/     # Règles ping-pong, clés storage
├── domain/        # Logique pure (validation, calcul, badges)
├── services/      # LocalStorage
├── composables/   # Orchestration Vue
└── components/    # UI (score-input, reveal, history)
```
