# BRIEF commun — animations « Animations pour comprendre » (cycle 3, CM1-CM2)

Dossier de travail : `/home/claude/anim`. Public : enseignant de CM1/CM2 (académie de Dijon) qui projette l'animation en classe.
Principe du projet : **favoriser la compréhension par l'image et le son** ; montrer le MÉCANISME (qui cause quoi), pas un résultat qui apparaît en fondu.

## Moteur (lire AVANT d'écrire : `src/engine.js`, `src/engine.css`, `build.js`, et 2 scènes d'exemple)
- Scène = `src/scenes/<nom>.js`, assemblée par `node build.js <nom>` → `build/<nom>.html` (fichier autonome, CSS/moteur/données inlinés). NE JAMAIS modifier `src/engine.js`, `src/engine.css`, `build.js`, `test.py`, `grid.py` (fichiers partagés par d'autres agents). Si une fonction moteur manque, note-le dans ton rapport final.
- Squelette : `Anim.run({titre, sousTitre, matiere:"histoire|geographie|sciences", badge, accroche, init(a){…}, reset(a){…}, after(a,k,t){…}, etapes:[{titre, duree, legende, voix, anim(t,a){…}}]})`. viewBox 1600×900. À chaque rendu le moteur rejoue les étapes précédentes à t=1 puis l'étape courante à t∈[0,1] : `anim` doit être une fonction PURE de t (pas d'état accumulé), `reset` remet l'état de départ.
- Helpers (`a.` ou `Anim.H`) : `seg(t,a,b)`, `op(el,v)`, `draw(path,t)`, `tr(el,x,y,s,r)`, `along(path,t)`, `wrap`, `label`, `arrow`, `myth(parent,x,y,w,faux,vrai)`, `frise`, `el(tag,attrs,parent)`, `layer(nom)`, `num`, `lerp`, `ease`, **`photo`** (voir plus bas). Cartes : `//@data europe` / `france` / `world` en 1re ligne de la scène (voir `histoire-A1-clovis-charlemagne.js`, `geo-B1-decoupage-administratif.js`, `geo-A1-se-deplacer.js` pour les formats ; les données sont des chemins SVG pré-projetés).
- Commandes : le moteur fournit lecture/pause, pas-à-pas, frise d'étapes, vitesse, plein écran, voix off (Web Speech fr-FR, phrase par phrase). Rien à coder pour ça.

## Règles pédagogiques (obligatoires)
1. 5 à 8 étapes ; chaque étape = une transformation visible + `legende` (1–2 phrases, vocabulaire CM) ; `voix` = texte lu (≈ la légende, un peu plus oral si utile). Durées 4000–9000 ms.
2. **UNE MANIPULATION par animation, avec le temps de la faire** (correction de l'enseignant : il veut pouvoir prendre le temps de faire manipuler les élèves). Dans UNE étape dédiée (pas la dernière) : `manipDes:k, manipJusqua:k` et `a.manip.innerHTML=…` (curseur, boutons…) comme dans les scènes d'origine (voir `orig/*.js`, versions initiales des 12 premières scènes, et `histoire-B1-chateau-fort.js`). Le moteur affiche la barre dès le début de l'étape et, en lecture automatique, S'ARRÊTE à la fin de cette étape (bouton « Continuer ▶ ») : la classe manipule aussi longtemps qu'elle veut. La légende/voix de l'étape invitent à manipuler (« À vous : …, regardez ce qui change »). La valeur manipulée est toujours AFFICHÉE dans le dessin ; l'état par défaut doit déjà être beau et parlant (la scène doit rester compréhensible sans manipuler). Variables de manip : globales de scène lues par `anim` ; `a.redraw()` après chaque action.
3. Une carte « idée fausse / en réalité » (`a.myth`) + une étape de **synthèse** (3 points max, ou schéma récapitulatif).
4. Exemples locaux quand c'est pertinent : Bourgogne-Franche-Comté, Côte-d'Or, Dijon, Beaune, Vézelay, Cluny, Cîteaux, Fontenay, Saône, Seine/Loire/Rhône.
5. **Exactitude** : vérifie dates, chiffres, noms avec WebSearch avant de les écrire (sources fiables : .gouv.fr, Éduscol, BnF, Larousse, Wikipédia, CNRS, Météo-France…). N'invente aucun chiffre. Un chiffre purement illustratif doit être présenté comme « exemple » à l'écran. Liste dans ton rapport les affirmations à faire relire.
6. Pas d'emoji dans le dessin (la police emoji n'est pas garantie) : dessine avec des formes SVG. Texte ≥ 22 px (vidéoprojecteur), forts contrastes, aucun chevauchement de textes, rien qui sorte du cadre 1600×900.
7. Voix : écris `voix` en français parlé correct. Évite sigles, chiffres romains, symboles : le moteur convertit déjà km, g, °C, %, ×, XIIe siècle… mais préfère écrire en toutes lettres les mots délicats. Signale dans ton rapport les mots susceptibles d'être mal prononcés par une voix de synthèse (ex. « Moyen Âge » est déjà géré), avec une respécification phonétique proposée.
8. Première ligne du fichier, obligatoire (sert à générer le sommaire) :
   `/* META {"id":"<nom-du-fichier>","matiere":"histoire|geographie|sciences","annee":"A|B|connexe","periode":1,"theme":"<thème programme ou 'connexe'>","resume":"<une phrase>","motsCles":["…"]} */`
   (la ligne `//@data …` éventuelle vient juste après).

## Photos d'illustration (sources fiables, Wikimedia Commons)
- Pour les sujets réels (monument, site, objet, paysage, instrument…) ajoute 1 à 3 photos par animation, utilisées comme « Dans la réalité » : `const g=a.photo(layerPhotos,{id:"<code>-<sujet>",x,y,w,h,cap:"Légende courte",rot:-2});` puis `a.op(g, a.seg(t,0,.3))` dans l'étape voulue (et `a.op(g,0)` ailleurs / dans `reset`). `g._missing===true` si la photo n'est pas installée : l'animation doit rester complète et sans trou sans elle (zone réservée aux photos = encart libre, jamais un élément essentiel).
- Déclare chaque photo dans `photos/manifest.d/<ton-agent>.json` (tableau d'objets `{"id":"…","q":"requête de recherche Commons très précise","must":["mot du titre ou de la description","…"],"alt":"ce que la photo doit montrer"}`). Choisis des sujets très précis et bien documentés sur Commons (ex. « Abbaye de Fontenay cloître », « Château de Guédelon chantier », « Marais salants de Guérande »). `must` filtre les résultats (accents ignorés). Id unique, préfixé par le code de la scène.
- Pour tester la mise en page, exécute `python3 fakephotos.py` (génère de fausses images + crédits de test). Le vrai téléchargement se fait chez l'enseignant avec `photos/telecharger-photos.mjs` (non accessible d'ici : Wikimedia est bloqué depuis ce serveur ; n'essaie PAS de le contourner).
- Le crédit s'affiche automatiquement sous la photo. Ne mets jamais de photo de personne reconnaissable vivante.

## Test (obligatoire, itère jusqu'à propre)
```
cd /home/claude/anim && node build.js <nom1> <nom2> …
mkdir -p /tmp/shots-<agent> && SHOTS=/tmp/shots-<agent> python3 test.py build/<nom>.html     # erreurs console + une capture par étape
SHOTS=/tmp/shots-<agent> python3 grid.py <nom>                                                  # planche-contact → ouvre le PNG avec Read
```
Regarde CHAQUE capture (au moins la planche, puis zoom sur les étapes douteuses : lance `__anim.setT(k,0.5)` aussi). Défauts classiques à corriger : étiquettes qui se chevauchent, flèches/éléments d'une étape précédente restés à l'écran, texte hors cadre, formes aberrantes, clic nécessaire. Zéro erreur console. Utilise un dossier de captures propre à ton agent.

## Livrables et rapport final (court, en français)
Fichiers : tes scènes `src/scenes/*.js` (+ `photos/manifest.d/<agent>.json`). Rapport : liste des scènes (nom, titre, nb d'étapes), mots à risque pour la voix + respécification proposée, affirmations à faire relire, besoins moteur. Pas de longs récapitulatifs.
