# Animations pour comprendre — cycle 3 (CM1-CM2)

52 animations HTML autonomes (histoire, géographie, sciences), avec voix off française, légendes, photos d'illustration, une idée fausse à déconstruire et une manipulation pour les élèves. À l'étape « À vous », la lecture s'arrête jusqu'à « Continuer ▶ ».

- `docs/` : le site prêt à l'emploi (`index.html` + `animations/`). Activable avec GitHub Pages (Settings → Pages → branche `main`, dossier `/docs`).
- `src/` : moteur (`engine.js`, `engine.css`) et une scène par animation (`src/scenes/*.js`). `build.js` assemble chaque scène en un fichier HTML autonome.
- `data/` : fonds de carte pré-projetés (`geo.mjs` les génère à partir de `world-atlas`/d3-geo).
- `photos/` : manifeste des 108 photos (Wikimedia Commons) et script de téléchargement `telecharger-photos.bat` / `.mjs`.
- `BRIEF.md` : consignes de production d'une scène ; `CATALOGUE.md` : liste, points à relire, mots de voix à écouter.

## Construire
Outil : Node.js 18+ (`node -v`).
1. Ouvrir un terminal dans le dossier du projet.
2. `npm install` (une seule fois, uniquement pour régénérer les cartes avec `geo.mjs`).
3. `node build.js` → écrit `build/<scène>.html`. Pour une scène : `node build.js histoire-B1-chateau-fort`.
4. Copier `build/*.html` dans `docs/animations/` pour mettre le site à jour (puis régénérer `docs/index.html` depuis `hub/index.html`).

## Tester (Python 3 + Playwright)
`pip install playwright && playwright install chromium`, puis `SHOTS=./shots python3 test.py build/<scène>.html` (erreurs console + une capture par étape) et `SHOTS=./shots python3 grid.py <scène>` (planche-contact). `python3 fakephotos.py` génère de fausses photos pour tester la mise en page (ne pas les versionner).

## Photos
Double-clic sur `photos/telecharger-photos.bat` (Internet + Node.js) : télécharge les photos, écrit les crédits (`credits.js`) et `apercu.html` à vérifier. Les animations fonctionnent sans photo.

## Voix off
Synthèse vocale du navigateur (Web Speech API, fr-FR ; meilleur rendu avec Edge). Les mots mal prononcés se corrigent dans le tableau `LEXIQUE` de `src/engine.js`.
