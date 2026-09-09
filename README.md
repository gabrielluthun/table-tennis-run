# PongRun

Tu joues au ping-pong. Tu perds (ou tu gagnes). Et ensuite… tu cours.

**PongRun**, c’est une petite appli arcade : tu rentres le score de ton match **après** la partie, et elle te calcule combien de **kilomètres de course à pied** tu « dois » pour la peine. Plus le match a été cruel, plus tu cours. Les matchs s’accumulent dans ton historique (tout reste sur ton navigateur).

---

## Comment ça se passe

1. **Avant le match** : Ouvre **Options** si tu veux modifier les paramètres : ton nom, celui de l’adversaire, format BO3 ou BO5, sets à 11 ou 21, son arcade…
2. **Sur la table** : Tu joues ton match pour de vrai (l’app ne suit pas le score en live).
3. **Après le match** : Tu saisis les scores set par set. Chaque set est validé avant de passer au suivant.
4. **Révélation** : L’app te balance ta distance en km, avec des badges selon le scénario (set blanc, choke, remontada…).
5. **Historique** : Chaque match s’ajoute. Tu vois le cumul, le bilan victoires / défaites, ta moyenne et ta pire peine. Tu peux exporter ou importer ton historique en JSON depuis Options.

---

### Étape 1 — Ce que chaque set ajoute

**Ça fait monter la peine**

- Tu **perds** le set → base kilométrique déjà plus lourde qu’une victoire.
- Plus l’**écart** est large contre toi, plus ça grimpe.
- **Set blanc** = énorme surcoût (défaite en marquant moins de la moitié des points du set, ex. 21–9).
- **Deuce** → chaque point au-delà ajoute encore un peu.
- **Pression** : plus le set est tardif dans le match, plus l’effet d’un set blanc est amplifié.

**Ça freine la peine**

- Tu **gagnes** le set → petite base seulement (tu cours quand même un peu, mais beaucoup moins).
- **Set blanc infligé** : l’adversaire a marqué moins de la moitié des points du set → la peine de ce set baisse (et encore plus si le set est tardif).

### Étape 2 — Les 4 multiplicateurs de match

À la fin, le total des sets est **toujours** multiplié par **un** de ces facteurs (jamais ×1 sur un match terminé) :

| Multiplicateur | Facteur | Quand ça tombe |
| --- | ---: | --- |
| **Remontada** | ×0.5 | Tu **gagnes** le match alors que tu avais perdu le début (1er set en BO3, ou les 2 premiers en BO5) |
| **Domination** | ×0.7 | Tu **gagnes** le match sans être passé par une remontada |
| **Sweep subi** | ×1.3 | Tu **perds** le match sans avoir mené au début |
| **Choke** | ×1.5 | Tu **perds** le match alors que tu avais gagné le début (1er set en BO3, ou les 2 premiers en BO5) |

En résumé : victoire → ×0.5 ou ×0.7 ; défaite → ×1.3 ou ×1.5.

### Badges que tu peux voir

- **Set blanc infligé / subi** — sur un set
- **Prolongation deuce** — set qui s’éternise
- **Remontada** (×0.5), **Domination** (×0.7), **Sweep subi** (×1.3), **Choke** (×1.5) — sur le résultat du match

---

## Lancer l’app chez toi

Tu as besoin de Node.js, puis :

```bash
npm install
npm run dev
```

| Commande | À quoi ça sert |
| --- | --- |
| `npm run dev` | Version de travail, avec rechargement auto |
| `npm run build` | Prépare la version « production » |
| `npm run preview` | Teste cette version en local |

Pour un build prêt pour GitHub Pages (chemin `/table-tennis-run/`) :

```bash
GITHUB_PAGES=true npm run build
```

---

## Un peu plus de détails

L’app est faite en **Vue 3** + TypeScript, **Vite**, **vue-router** et SCSS, sans lib UI. 
Le déploiement public passe par **GitHub Pages** et le workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

Routes : `/` (match), `/settings` (options), `/help` (comment ça marche). Sur Pages, le build copie `index.html` → `404.html` en fallback pour que les liens directs / refresh fonctionnent.

La logique du score, des km et des badges est dans `src/domain/` :

```
src/
├── constants/       # Clés storage, constantes liées aux règles
├── domain/          # Logique pure (settings, validation, distance, badges)
├── router/          # Routes /, /settings, /help
├── views/           # MatchView (écran principal)
├── services/        # LocalStorage, export/import, son, IDs
├── composables/     # usePingPongTracker, useSettings
└── components/
    ├── score-input/ # Formulaire de scores
    ├── reveal/      # Écran de révélation
    ├── history/     # Historique + stats
    ├── options/     # Panneau de réglages
    └── help/        # Comment ça marche
```

---

## Licence

Projet perso / expérimental — libre pour un usage personnel.
