# Atelier Exposés — mode d'emploi

Trois fichiers, à placer ensemble : `expose.html` (l'application), `serveur-atelier.mjs` (petit serveur) et `lancer-atelier.bat` (le bouton de démarrage).

## 1. Installation (une fois par ordinateur)

1. Ouvrez l'**Explorateur de fichiers** (touches Windows + E).
2. Copiez les trois fichiers dans le dossier **animations-cycle3**, à côté de `index.html` (là où se trouvent les dossiers `animations` et `photos`).
3. Installez **Node.js** (gratuit, une seule fois) :
   1. Ouvrez Chrome ou Edge, allez sur **https://nodejs.org**.
   2. Cliquez sur le bouton de téléchargement de la version **LTS**.
   3. Ouvrez le fichier téléchargé → **Suivant** à chaque écran → **Installer** → **Terminer** (un mot de passe administrateur peut être demandé).
4. Double-cliquez sur **`lancer-atelier.bat`** :
   - une fenêtre noire s'ouvre (le serveur) : **laissez-la ouverte** pendant la séance ;
   - le navigateur s'ouvre sur `http://localhost:8642/expose.html`.
   - Si Windows affiche « Windows a protégé votre ordinateur » : **Informations complémentaires** → **Exécuter quand même**.
   - Si le pare-feu demande une autorisation : vous pouvez refuser (le serveur ne sert que cet ordinateur).
5. Ajoutez la page aux favoris (Ctrl + D). Pour arrêter : fermez la fenêtre noire.

**La fenêtre noire s'ouvre et se ferme tout de suite ?** (dépannage, pas à pas)
1. Vérifiez que le zip est **extrait** : clic droit sur `atelier-exposes.zip` → **Extraire tout** (ne lancez jamais le .bat depuis l'intérieur du zip).
2. Ouvrez le dossier **animations-cycle3** dans l'Explorateur, cliquez dans la barre d'adresse en haut, tapez `cmd` puis **Entrée** : une fenêtre noire s'ouvre dans ce dossier.
3. Tapez `lancer-atelier.bat` puis **Entrée** : la fenêtre reste ouverte et affiche le message d'erreur éventuel.
4. Si le message parle de `node` : réinstallez Node.js (étape 3 ci-dessus), puis **redémarrez l'ordinateur**.
5. Note : cette erreur venait d'une version précédente de `lancer-atelier.bat` ; la version actuelle affiche toujours un message avant de se fermer.

**Sans Node.js** : double-cliquez simplement sur `expose.html`. Tout fonctionne, sauf deux choses : les résultats Qwant Junior s'ouvrent dans une fenêtre à côté (au lieu de s'afficher dans l'Atelier), et certains dictionnaires peuvent ne pas répondre.

⚠ Les exposés enregistrés en « simple fichier » et ceux enregistrés avec `lancer-atelier.bat` sont rangés à deux endroits différents du navigateur. Choisissez une façon de faire et gardez-la ; pour passer de l'une à l'autre : **Enregistrer dans un fichier** puis **Ouvrir un fichier**.

## 2. Réglages de l'enseignant (une fois par ordinateur)

1. Cliquez sur la roue **⚙** en haut à droite.
2. Tapez le code **1234**, puis **Entrer**.
3. Tout en bas, section *Gestion* : tapez un nouveau code → **Changer le code**.
4. Section *Animations* : **Charger le dossier des animations…** → choisissez le dossier `animations-cycle3\animations` → **Importer** (ou **Charger**) → acceptez le message du navigateur.
   Résultat : les élèves récupèrent les étapes de chaque animation, et les animations s'ouvrent directement à la bonne étape dans les diapos.
   À refaire quand de nouvelles animations sont produites.
5. Section *Niveau de départ* : **Découverte** (le plus simple, par défaut), **Standard** ou **Expert** (interface complète), puis ajustez les modules un par un si besoin (§ 4).
6. Section *Couleurs* : **Choisir le thème de la classe** (Arc-en-ciel, Océan, Forêt, Bonbons, Soleil, Espace, Sobre, Contraste fort, ou vos propres couleurs), taille du texte (Normale / Grande / Très grande pour le TNI), couleurs des diapos. Cochez ou non « Les élèves peuvent choisir leurs couleurs » (bouton 🎨 dans chaque exposé).
7. Section *Qwant Junior* : indique si l'Atelier tourne avec son serveur. Listes **Sites conseillés** (affichés en premier) et **Sites bloqués** (jamais affichés), option « N'afficher que les sites conseillés ». Cadre **Clé Staan** : voir le § 2 bis.
8. Section *Sujets* : ajoutez vos propres sujets, un par ligne : `histoire | Le palais des ducs à Dijon | Qui l'a construit ? ; À quoi servait-il ? ; Que devient-il ?`
9. Section *Dictionnaires* : Le Dico des Ados, Vikidia, Wiktionnaire (cochez ceux à proposer).
10. Section *Interface des élèves* : **Simple** (recommandé) ou **Complète**. Section *Modules* : chaque aide s'ajoute ou s'enlève ici (voir § 4).
11. Section *Classe* : nom de l'école, classe, critères d'auto-évaluation (un par ligne).
12. Pour copier ces réglages sur les autres ordinateurs : **Exporter les réglages** → clé USB → sur l'autre poste, ⚙ → **Importer des réglages**.

## 2 bis. Recherche officielle Qwant : la clé Staan (recommandé, gratuit)

**Staan** est l'API de recherche officielle de Qwant (ouverte en libre-service en juin 2026). Avec une clé, l'Atelier n'utilise plus le moteur non officiel, qui peut être refusé par Qwant.
- Gratuit jusqu'à **1 000 recherches par mois** (puis 2 € les 1 000). Les mêmes recherches répétées dans l'heure ne sont pas recomptées.
- Staan n'a **pas de filtre « enfants »** : l'Atelier ne propose donc que vos **sites conseillés**, sauf si vous cochez « Autoriser aussi les sites hors de ma liste ».
- La clé reste dans un fichier `staan-cle.txt` à côté de `serveur-atelier.mjs`. Elle n'est jamais envoyée dans la page des élèves.

Pas à pas :
1. Ouvrez Chrome ou Edge, allez sur **https://staan.ai** et créez un compte gratuit (conditions et modalités d'inscription : à lire sur le site, je n'ai pas pu les vérifier).
2. Dans votre espace Staan, créez une **clé API** et **copiez-la** (Ctrl + C).
3. Lancez l'Atelier avec `lancer-atelier.bat`.
4. Cliquez sur **⚙**, tapez le code, descendez jusqu'à **Qwant Junior → Clé Staan**.
5. Collez la clé (Ctrl + V) → **Enregistrer la clé**. Le message « Clé enregistrée » apparaît.
6. Vérifiez la ligne « Recherches ce mois-ci : … / 1000 ».
7. Pour retirer la clé : **Effacer**.

Si la clé est refusée ou si les 1 000 recherches du mois sont utilisées, l'élève voit un message clair et peut ouvrir Qwant Junior à côté.
⚠ Ne mettez pas `staan-cle.txt` dans un dossier partagé avec les élèves ; le compteur du mois est dans `staan-quota.json`.

### Le correcteur
- Toujours actif : le soulignement rouge du navigateur + la relecture automatique (majuscules, points, phrases trop longues, mots répétés) + le repérage des passages copiés.
- Option **LanguageTool** (orthographe et grammaire détaillées) : le texte de l'élève part sur un serveur extérieur. Activez-la seulement avec un serveur d'école, ou après avoir vérifié la conformité RGPD.
- *Lien vers le Correcteur pédagogique* : indiquez le chemin de votre application (ex. `../Correcteur/index.html`) ; un bouton « Ouvrir le Correcteur » apparaît, le texte de l'élève est copié automatiquement.

## 3. Ce que voit l'élève (interface simple, par défaut)

**Accueil** : un seul gros bouton **« Je commence un exposé »**, puis la liste de ses exposés (un clic pour continuer). En petit : « Partir d'une animation », « Ouvrir un fichier ».

**3 étapes**, avec un **menu à gauche** (Mon sujet · Mes réponses · Je présente, puis Mes exposés, 🎨, ⚙) et la chouette en haut qui dit **quoi faire maintenant**, avec un **gros bouton** pour passer à la suite :

1. **Mon sujet** : un choix à la fois.
   - Dans quelle matière ? → Choisis ton sujet (les sujets **▶ animation** ont un motion design, ajouté automatiquement) → titre (déjà rempli), prénom, et **mes questions** (déjà proposées, modifiables ; s'il reste de la place, des boutons **＋ Comment ça marche ?**, **＋ Où et quand ?**… permettent d'en ajouter d'un clic).
   - Les questions **sont** le plan : il n'y a rien d'autre à préparer.
2. **Mes réponses** : **une question à la fois**. Les questions sont listées **dans le menu de gauche** (✓ quand c'est fini).
   - **🔍 Je cherche** : la zone de recherche est toujours la même, dont les trois types — **📄 Textes**, **🖼️ Images**, **🎞️ Animations** — et **✏️ J'écris** sont dans le menu de gauche, sous la question en cours. L'élève choisit un type ; la recherche se lance toute seule avec le titre, dans le meilleur endroit. Pour chercher ailleurs, il clique sur **Changer d'endroit ▾** (tuiles du § 3 bis, repliées par défaut). Il lit, puis **⭐ Je garde** (phrase surlignée, image ou animation). Tout va dans **⭐ Mon panier** (à droite), rangé sous la question en cours.
   - **✏️ J'écris** : ce qu'il a gardé à gauche, sa réponse à droite, **débuts de phrases à choisir**, compteur de mots, **🔊 Écouter** et **✔ Vérifier**. La chouette l'envoie ensuite à la question suivante.
3. **Je présente** : les diapos sont **faites toutes seules** (une par question, avec l'image ou l'animation gardée et 2 ou 3 mots-clés tirés de sa réponse). L'élève peut changer les mots et l'image. Puis : **Présenter au tableau**, **Imprimer ma fiche**, **Enregistrer**.

Quand il rouvre un exposé, il retombe à l'endroit où il s'était arrêté.

**Les couleurs (🎨)** : l'élève ne voit que les thèmes prêts à choisir. Les couleurs une à une, la taille du texte et les couleurs des diapos sont réservées à l'enseignant (⚙ → Thème de la classe).

## 3 bis. Où l'élève cherche : les sources intégrées

| Type | Tuile | Ce que c'est | Fonctionne… |
|---|---|---|---|
| 📄 Textes | **Sites sûrs** | Qwant (clé Staan ou Qwant) **limité à vos sites conseillés** ; une pastille par site (Lumni, 1jour1actu, Journal des enfants, Cité des sciences, BnF, Culture, Éducation nationale, Météo-France, ESA Kids, Muséum…) pour chercher dans un seul site | avec `lancer-atelier.bat` |
| 📄 Textes | **Vikidia** | Encyclopédie pour les 8-13 ans : l'article s'ouvre dans l'Atelier | sans serveur |
| 📄 Textes | **Wikimini** | Encyclopédie pour les 7-13 ans (module *Wikimini*) | sans serveur (à vérifier chez vous, voir § 6) |
| 📄 Textes | Wikipédia, **Mon livre** | Désactivés par défaut / module « Mes propres sources » | |
| 🖼️ Images | **Images libres** | Wikimedia Commons, **avec le nom de l'auteur et la licence** ; quelques mots sensibles sont exclus de la recherche | sans serveur |
| 🎞️ Animations | **Animations de la classe** | Les 52 animations du dossier `animations/`, classées d'abord selon la matière et le sujet ; **▶ Regarder** puis **⭐ Je garde** | avec le dossier `animations/` |
| 🎞️ Animations | **Animations courtes** | Vidéos de Wikimedia Commons **dont la durée est connue et ≤ 60 secondes** (réglable : ⚙ → *Animations* → durée maximale ; **0 = aucune vidéo**) | sans serveur, internet pendant la présentation |

Les **sites conseillés** se changent dans ⚙ (liste de noms de domaine) ; les sites **bloqués** disparaissent. Les pastilles affichent le nom d'un site connu, sinon son adresse.

## 3 ter. Chronomètre, quiz et définitions (nouveau)

**⏱ Chronomètre** (menu de gauche, bouton ⏱ en mode présentation, ou touche **C** pendant la présentation)
1. Cliquez sur **⏱ Chronomètre** : un petit cadre s'affiche en bas à gauche, par-dessus tout (même en plein écran).
2. Choisissez la phase : **🎤 Exposé** (10 min), **❓ Questions** (5 min), **🧠 Quiz** (5 min).
3. Cliquez sur **▶ Démarrer** (touche **P** en présentation). **⏸ Pause**, **↺ Zéro** pour recommencer la phase.
4. **⬇ À rebours** ou **⬆ Qui avance** : au choix à tout moment. **− / +** change la durée de la phase.
5. À 1 minute de la fin, le cadre devient **orange** ; à 0 il **bipe** puis passe en **rouge « +1:15 »** : l'exposé peut dépasser un peu, le temps dépassé reste visible.
6. **–** réduit le chrono en petite pastille (il continue de tourner). Durées par défaut : ⚙ Réglages → Chronomètre.

**🧠 Quiz des exposants** (étape « Je présente » → menu de gauche **Mon quiz**)
1. **＋ Une question** (ou **＋ Vrai ou faux**, ou **💡 Une question par partie** qui reprend les questions de l'exposé).
2. Écrire la question, 2 à 4 réponses, **cocher le rond ◉ de la bonne réponse**, et si on veut « Pourquoi ? ».
3. **▶ Afficher le quiz** : plein écran, une question à la fois, les camarades cliquent (ou touches 1-4 / A-D). **👁 Afficher les réponses** montre la bonne réponse sur toutes les questions ; **📋 Corrigé** liste tout ; à la fin, le score. Échap pour fermer. Le bouton 🧠 est aussi dans la présentation.
4. **🖨 Imprimer le quiz** (fiche avec nom et cases à cocher) ou **🖨 Imprimer avec les réponses** (corrigé).

**📖 Définition d'un mot, par simple sélection**
1. Sélectionnez un mot (1 à 3 mots) : dans un texte de recherche, dans « J'écris », dans « Ce que je dis » ou n'importe où dans la page.
2. Cliquez sur **📖 Définition** dans la petite bulle noire.
3. Choisissez un sens : **📋 Copier** (puis Ctrl + V, même en niveau « Découverte » où le collage est normalement interdit), **➕ Dans mon texte**, **➕ Dans ce que je dis** (éléments de langage de la diapo) ou **🔤 Au lexique**.
4. Demande internet. Dictionnaires : Dico des Ados, Vikidia, Wiktionnaire (⚙ Réglages → Dictionnaires).

**🗣 Ce que je dis** : sous chaque diapo, une zone pour les éléments de langage. Ils s'impriment dans « Mes fiches pour l'oral ».

Chaque élément se désactive dans ⚙ Réglages → Modules (Chronomètre, Quiz pour la classe, Définition par sélection).

## 4. Complexifier petit à petit (⚙ Réglages)

| Réglage | Effet en interface simple |
|---|---|
| **Niveau Découverte** (par défaut) | 1 couleur (⭐ Je garde), 2 à 3 questions, 20 mots par réponse, 12 mots par diapo ; textes, images et animations disponibles, débuts de phrases proposés. |
| **Niveau Standard** | + 3 couleurs (idée, date/chiffre, mot à expliquer), lexique avec **dictionnaire pour enfants**, débuts de phrases, livres et documents, auto-évaluation ; jusqu'à 4 questions, 30 mots. |
| **Niveau Expert** | Passe à l'**interface complète** (ci-dessous). |
| **Modules** (un par un) | 3 couleurs / lexique, dictionnaire, aide à l'écriture, Vikidia, Wikimini, Wikipédia, images libres, animations courtes, « un livre » comme source, écoute, auto-évaluation, fiches pour l'oral… Cochez seulement ce dont la classe a besoin. |
| **Règles** | Nombre de questions min./max., mots par réponse, mots par diapo, copier-coller. |

**Interface complète** (⚙ → *Interface des élèves* → **Complète**, ou niveau Expert) : 5 étapes (Mon sujet → Je cherche et je range → J'écris → Mes diapos → Je présente), plan avec introduction et conclusion, liste des sources, rangement par partie, diapos modifiables à la main (mise en page, ordre, ajout). Tout ce qui a été fait dans un exposé est conservé quand on change d'interface.

## 5. Imprimer en PDF ou sur papier
1. Dernière étape (« Je présente ») → **Imprimer ma fiche** (ou **Mes fiches pour l'oral**).
2. Dans la fenêtre d'impression : Destination = votre imprimante, ou **Enregistrer au format PDF**.
3. Format A4, marges « Par défaut », cocher **Graphiques d'arrière-plan** si les couleurs manquent.

## 6. À savoir
- Les exposés sont enregistrés **dans le navigateur de cet ordinateur**. Pour changer d'ordinateur ou rendre le travail : dernière étape (« Je présente ») → **Enregistrer dans un fichier** (dossier Téléchargements). ⚙ → **Exporter tous les exposés** pour une sauvegarde de classe.
- Avec une clé Staan (§ 2 bis) : API officielle, sites conseillés uniquement par défaut. Sans clé : le petit serveur interroge Qwant par une voie non officielle avec son filtre de sécurité **strict** ; si Qwant refuse (protection anti-robots), l'Atelier propose d'ouvrir Qwant Junior à côté.
- Le Dico des Ados était en maintenance le 21 octobre 2026 : si aucune définition n'en vient, Vikidia et le Wiktionnaire prennent le relais.
- La recherche (Qwant Junior, Vikidia, Wikipédia, Images) demande internet. Sans internet : sources « Livre ou document » et « Photo d'un document ».
- Les images gardées sont copiées dans l'exposé : la présentation fonctionne ensuite hors ligne.
- Animations : si le dossier n'a pas été chargé (§ 2.4), elles s'ouvrent au début ; l'élève peut aussi choisir le fichier de l'animation lui-même.
- **Animations courtes** : seule l'image d'aperçu est copiée dans l'exposé. La **vidéo** est lue depuis Wikimedia Commons : il faut internet au moment de présenter. Seules les vidéos dont la **durée est annoncée** par Commons et inférieure à la limite sont proposées.
- **Sécurité des images et des vidéos** : Wikimedia Commons n'a pas de filtre « enfants ». L'Atelier exclut quelques mots sensibles de la recherche, mais aucun filtre n'est parfait : le premier essai se fait avec l'enseignant. Pour couper : décochez *Images libres* et/ou *Animations courtes* dans ⚙ → Modules.
- **Wikimini** et les pastilles de **sites conseillés** (Lumni, 1jour1actu, ESA Kids, Muséum…) n'ont pas pu être testés en ligne depuis l'environnement de développement (ces sites étaient inaccessibles). Essayez-les une fois : si l'un ne s'ouvre pas dans l'Atelier, l'élève peut le lire dans Qwant Junior à côté, ou retirez-le de la liste des sites conseillés (⚙).
- Les vidéos longues des sites éducatifs (Lumni, Les Fondamentaux…) ne sont **pas** proposées dans l'Atelier : leur durée dépasse souvent 1 minute.
