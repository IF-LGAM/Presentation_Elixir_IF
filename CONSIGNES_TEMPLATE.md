# CONSIGNES : Génération de Présentation Slide Deck HTML

Génère une présentation complète au format fichier unique HTML (`presentation.html`) autonome et moderne, basée sur le moteur de template fourni.

---

> 📚 **RÉFÉRENTIEL DES OBJETS & COMPOSANTS : `COMPOSANTS_DICTIONNAIRE.md`**
> Un dictionnaire complet de composants prêts à l'emploi est formalisé dans le fichier [`COMPOSANTS_DICTIONNAIRE.md`](COMPOSANTS_DICTIONNAIRE.md).
> **RÈGLE OBLIGATOIRE POUR LA CRÉATION DES SLIDES** :
> Pour concevoir et structurer le contenu des diapositives, vous devez **systématiquement vous appuyer sur ce dictionnaire** pour instancier les objets souhaités :
> - **Mises en page & Layouts** : `slide`, `grid-2`, `grid-3`, `grid-4`, `split-code`, `hero`
> - **Cartes & Conteneurs** : `x-card`, `x-card.featured`, `x-card.metric`, `summary-box`
> - **Données & Tableaux** : `data-table`, `metric-value` (KPI), `progress-track`
> - **Frises & Processus** : `stepper-horizontal` (`step-node`), `timeline-vertical` (`timeline-card`)
> - **Boucles & Cycles** : `virtuous-circle` (`cycle-core`, `cycle-step`)
> - **Actions & Liens** : `text-link`, `btn-action`, `link-card`, `repo-link`
> - **Développeur & Terminal** : `code-box` (Prism.js), `code-header`, `terminal-box`, `inline-code`
> - **Badges & Typo** : `pill-tag`, `pill-tag.solid`, `pill-tag.gray`, `bullet-check`
> - **Interactivité** : `quiz-container`, `quiz-opt-btn`, `quiz-explanation-box`
> - **Métadonnées** : `data-notes`, `data-theme="light|dark"`, `slide-title`, `slide-subtitle`

---

## 🎨 1. Système de Design & Détection Automatique du Thème (Clair / Foncé)

### 1.1 Principe « Zéro Configuration » pour la Structure
> **RÈGLE FONDAMENTALE — L'UTILISATEUR NE GÈRE QUE SON CONTENU** :
> L'utilisateur ne touche **jamais** à la structure de l'outil (header, footer, barre de progression, boutons de navigation, modales, tiroir de notes).
> **La structure du site s'adapte automatiquement (mode clair ou mode sombre) en fonction du design des slides**, sans aucune configuration manuelle requise.

---

### 1.2 Fonctionnement de l'Auto-Adaptation Dynamique
Le moteur de présentation (`Deck Engine`) inspecte en temps réel chaque slide affichée et bascule instantanément l'habillage du site :

1. **Slide à fond clair** (ou si la slide porte la classe `light` / `theme-light`, l'attribut `data-theme="light"`, ou un fond blanc/clair détecté automatiquement) :
   - Le header, le footer et les modales passent **automatiquement en mode clair** (surfaces blanc-cassé / blanc pur semi-transparentes avec effet de flou *glassmorphism*, textes ardoise sombre contrastés `#0F172A`, bordures fines et soignées).
   - Les boutons de commande, les badges et le tiroir de notes s'ajustent instantanément pour une lisibilité irréprochable.
2. **Slide à fond sombre** (ou par défaut) :
   - L'outil reste / bascule **automatiquement en mode sombre contrasté** (fond noir mat `#141414`, cartes anthracite `#1F1F1F`, textes blancs, séparateurs discrets).
3. **Mixité & Transitions slide par slide** :
   - Si une présentation mélange des slides sombres (ex: slide de titre Hero) et des slides claires (ex: ateliers, diagrammes, cas d'usage), **l'interface de l'outil effectue la transition de manière fluide et automatique** lors du passage d'une slide à l'autre.
4. **Héritage automatique des accents de couleur** :
   - Si une slide ou son contenu utilise une couleur d'accent propre (ex: vert menthe `#10B981`, bleu `#2563EB`, ou rouge `#E50914`), la barre de progression, les badges et les contours actifs l'adoptent automatiquement.

---

### 1.3 Typographie, Mise en Page & Composants de Contenu
- **Typographie** :
  - Titres : Montserrat (gras 800/900)
  - Corps de texte : Inter (400, 500, 600)
  - Code et terminaux : Fira Code ou monospace
- **Mise en page** : Ratio 16:9 widescreen, conteneur centré (`max-width: 1240px`), marges et paddings aérés (adaptatifs en hauteur et largeur pour éviter tout effet de bord collé).
- **Dictionnaire & Bibliothèque de composants** :
  - **Référentiel complet disponible dans [`COMPOSANTS_DICTIONNAIRE.md`](COMPOSANTS_DICTIONNAIRE.md)** avec tous les alias et structures HTML standardisées.
  - Cartes génériques (`.x-card`, `.x-card.featured`, `.x-card.metric`, `.summary-box`)
  - Grilles modulables (`.grid-2`, `.grid-3`, `.grid-4`, `.split-code`)
  - Frises & Étapes (`.stepper-horizontal`, `.step-node`, `.timeline-vertical`)
  - Cycles vertueux & Boucles systémiques (`.virtuous-circle`, `.cycle-core`, `.cycle-step`)
  - Tableaux de données & KPIs (`.data-table`, `.metric-value`)
  - Badges pills (`.pill-tag`, `.pill-tag.solid`, `.pill-tag.gray`, `.bullet-check`)
  - Blocs de code & Terminaux annotés (`.code-box`, `.terminal-box`)
  - Quizz interactifs avec feedback immédiat (`.quiz-opt-btn`, `.quiz-explanation-box`)

---

## ⚙️ 2. Spécifications Techniques & Fonctionnalités du Fichier

1. **Fichier HTML 100% Découplé & Autonome** :
   - Fonctionne directement via un simple double-clic dans le navigateur (aucune installation de serveur nécessaire, compatible `file://`).
   - **Découplage Total du Template** : L'auteur ou l'agent de génération n'écrit **QUE** le contenu des diapositives (`<section class="slide">`) à l'intérieur du conteneur `<div class="deck-container"><main class="slides-viewport">`.
   - **Injection Automatique du Deck Engine** : Le script `src/js/deck.js` génère et injecte automatiquement l'intégralité de la structure d'habillage (Header persistant avec indicateurs, boutons de commandes et barre de progression, Footer de navigation, Modale d'Overview avec slider de défilement, Drawer de notes d'orateur, Modale des raccourcis, sélecteur de couleur et bascule de thème clair/sombre).
   - **Conformité Stricte au Dictionnaire** : Tous les éléments insérés dans les diapositives doivent suivre rigoureusement les classes et structures standardisées de [`COMPOSANTS_DICTIONNAIRE.md`](COMPOSANTS_DICTIONNAIRE.md).
2. **Bibliothèques externes (via CDN)** :
   - Prism.js (thème sombre `prism-tomorrow`) pour la coloration syntaxique.
   - Google Fonts (Montserrat, Inter, Fira Code).
3. **Fonctionnalités natives intégrées au Deck Engine** :
   - **Navigation fluide** : flèches `←` / `→`, touches `Espace`, `PageUp` / `PageDown`.
   - **Mode plein écran** : touche `F` ou bouton dédié.
   - **Vue globale en grille (Overview)** : touche `O` ou `Échap` avec vignettes cliquables.
   - **Bascule manuelle Thème Clair / Sombre** : touche `T` ou bouton dédié dans le header.
   - **Personnalisation en direct de la Couleur d'accentuation** : touche `C` ou menu palette dans le header (palette de presets vibrants : Rouge Crimson, Bleu Cobalt, Vert Émeraude, Violet Cyber, Ambre, Rose Néon, Cyan + sélecteur libre sur-mesure, persistance `localStorage`, paramètre URL `?color=...`, et synchronisation temps réel dual-screen).
   - **Export PDF haute fidélité** : touche `P` ou bouton dédié (mode paysage 16:9 strict, exactement 1 page par slide, respect fidèle du thème clair/sombre de chaque slide, 0 coupure de page).
   - **Fenêtre d'aide des raccourcis** : touche `?`.
   - **Barre de progression dynamique & compteur** de slides dans le header.
4. **🎙️ Mode Présentateur Avancé (Dual-Screen / Speaker View)** :
   - **Fenêtre dédiée synchronisée (touche `S` ou bouton Présentateur)** :
     - Ouvre une seconde fenêtre / onglet autonome réservée à l'orateur (`window.open` avec paramètre ou mode dédié).
     - **Synchronisation temps réel bidirectionnelle** via l'API native `BroadcastChannel` (et fallback `localStorage`) : tout changement de slide sur l'écran présentateur met immédiatement à jour l'écran projeté pour le public, et vice-versa.
   - **Interface complète du Mode Présentateur** :
     - **Slide actuelle** en aperçu direct.
     - **Slide suivante (Next Slide)** pour anticiper ses transitions et propos.
     - **Chronomètre / Timer interactif** : affichage du temps écoulé (heures, minutes, secondes), bouton Pause/Play, Reset, et indicateur visuel de l'heure courante.
     - **Zone de Notes d'orateur grand format** : affichage clair et lisible des notes renseignées sur chaque slide (`data-notes`), avec contrôles pour agrandir/réduire le texte des notes.
     - **Contrôles de navigation orateur** : boutons Précédent / Suivant et liste de saut direct vers n'importe quelle slide.
   - **Tiroir rapide de secours (Drawer de notes)** : activable directement sur la slide principale avec la touche `N` pour les cas où l'on n'a qu'un seul écran.
5. **Composants interactifs disponibles** :
   - Cartes en grille : 2, 3 ou 4 colonnes (`.grid-2`, `.grid-3`, `.grid-4`).
   - Blocs de code annotés (`.code-box`).
   - Quizz à main levée ou cliquable avec révélation de la bonne réponse et explications détaillées (`.quiz-opt-btn`, `.quiz-explanation-box`).
   - Terminal / commandes rapides à copier en 1 clic.
   - Widgets interactifs de démonstration ou simulateurs personnalisés.

---

## 📝 3. Schéma & Contenu des Slides

> **À REMPLIR : Insérez ci-dessous le contenu spécifique de votre sujet.**

### Métadonnées Générales :
- **Titre de la présentation** : [Ex: Titre du sujet]
- **Sous-titre / Thème** : [Ex: Présentation technique / Conférence]
- **Durée totale estimée** : [Ex: 45 min]
- **Public visé** : [Ex: Développeurs, Étudiants, Équipe Produit]

### Structure des Slides :

#### Slide 1 : Titre & Sommaire (Hero)
- **Titre** : ...
- **Sous-titre** : ...
- **Grandes parties** :
  1. Partie 1 : [Nom] ([Durée] min)
  2. Partie 2 : [Nom] ([Durée] min)
  3. Partie 3 : [Nom] ([Durée] min)
- **Notes présentateur** : ...

#### Slide 2 : Contexte / Problématique (Layout 2 colonnes)
- **Titre & En-tête** : ...
- **Colonne Gauche** : [Problème constaté, historique, limites]
- **Colonne Droite** : [Solution, rupture technologique]
- **Notes présentateur** : ...

#### Slide 3 : Architecture / Piliers Clés (Layout 4 colonnes)
- **4 Cartes métriques ou piliers fondamentaux** :
  1. ...
  2. ...
  3. ...
  4. ...
- **Encadré de synthèse** : ...
- **Notes présentateur** : ...

#### Slide 4 : Approfondissement Technique & Code (Layout Split Code)
- **Explication conceptuelle** (à gauche)
- **Snippet de code commenté** (à droite)
- **Notes présentateur** : ...

#### Slide 5 : Cas pratique / Démo / Quizz interactif
- **Question** : ...
- **Options (A, B, C, D)** : ...
- **Bonne réponse et explication** : ...
- **Notes présentateur** : ...

#### Slide 6 : Conclusion / TP / Liens utiles
- **Étapes ou consignes d'atelier**
- **Commandes terminal d'initialisation**
- **Lien du dépôt ou QR Code**
- **Notes présentateur** : ...