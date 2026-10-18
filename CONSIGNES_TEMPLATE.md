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

## 🎨 1. Système de Design & Thème Global (Clair / Foncé)

### 1.1 Principe « Thème Global & Zéro Configuration »
> **RÈGLE FONDAMENTALE — LE THÈME SE DÉFINIT AU GLOBAL** :
> 1. Le thème graphique par défaut de la présentation est défini **au niveau global** sur le conteneur racine : `<div class="deck-container" data-theme="dark">` (mode sombre par défaut) ou `data-theme="light"` (mode clair).
> 2. **Toutes les diapositives héritent automatiquement du thème global.**
> 3. **Interdiction de répéter le thème sur chaque slide** : Ne mettez JAMAIS `data-theme="dark"` ou `data-theme="light"` sur les balises `<section class="slide">` lorsque toute la présentation partage le même thème.
> 4. La structure du site (header, footer, barre de progression, boutons de navigation, modales, tiroir de notes) s'adapte automatiquement au thème actif sans aucune configuration manuelle requise.

---

### 1.2 Fonctionnement & Exceptions Ponctuelles
Le moteur de présentation (`Deck Engine`) applique le thème de manière hiérarchique et fluide :

1. **Héritage global (Cas standard)** :
   - Par défaut, toutes les slides `<section class="slide">` adoptent le thème défini sur `.deck-container`.
   - En mode sombre (`dark`), fond noir mat `#141414`, cartes anthracite `#1F1F1F`, textes blancs, séparateurs discrets.
   - En mode clair (`light`), fond blanc-cassé `#F8FAFC`, cartes blanches `#FFFFFF`, textes ardoise `#0F172A`, ombres douces.
2. **Exception ponctuelle par slide (Cas particulier)** :
   - Si et seulement si une slide spécifique nécessite un contraste inverse du reste du diaporama (ex: une diapositive de schéma blanc au sein d'un deck sombre), vous pouvez lui attribuer localement `data-theme="light"` ou `data-theme="dark"`.
   - Le moteur basculera alors l'habillage de manière fluide lors de l'affichage de cette diapositive, puis rétablira le thème global sur les diapositives suivantes.
3. **Bascule manuelle par l'orateur (`T`)** :
   - L'utilisateur peut basculer manuellement entre mode clair et mode sombre à tout moment via la touche `T` ou le bouton du header. Ce choix utilisateur prévaut sur toute la présentation.
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
- **Titre de la présentation** : Elixir & Phoenix : Le Web Haute Performance et Temps Réel
- **Sous-titre / Thème** : Module Infrastructures & Frameworks — Master MIAGE
- **Durée totale estimée** : 60 min (Atelier complet de présentation)
- **Public visé** : Étudiants MIAGE
- **Thème visuel global** : dark

> ⚠️ **RÈGLE CRITIQUE POUR LA GÉNÉRATION DES SLIDES** :
> - **Le thème visuel est défini UNE SEULE FOIS au global** (dans les métadonnées et sur `<div class="deck-container" data-theme="dark|light">`).
> - **NE JAMAIS écrire ni répéter `theme: dark` ou `theme: light` sur chaque slide** dans le plan Markdown ou dans le code HTML.
> - Seule une slide faisant l'objet d'une exception délibérée de contraste par rapport au reste du diaporama peut porter un attribut `data-theme` unitaire.

### Structure des Slides :

#### Slide 1 : Titre & Sommaire
- **Type de slide** : slide
- **Mise en page** : hero
- **Titre (title-slide)** : Elixir & Phoenix Framework
- **Sous-titre (subtitle-slide)** : Scalabilité massive, résilience et paradigme fonctionnel au service du web moderne
- **Organisation** : grid-3
  - **Colonne 1** : card
    - badge-solid : Partie 1
    - Titre : Fondations & Langage Elixir
    - Description : Genèse, paradigme fonctionnel et concepts clés
    - badge-gray : 21 min
  - **Colonne 2** : card
    - badge-solid : Partie 2
    - Titre : Framework Phoenix & Temps Réel
    - Description : Architecture, comparaison SSR/LiveView, routage et démo
    - badge-gray : 34 min
  - **Colonne 3** : card
    - badge-solid : Partie 3
    - Titre : Atelier Pratique & TP
    - Description : Mise en œuvre de l'application « Les bons comptes »
    - badge-gray : 5 min
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Accroche & Cadre :** Bienvenue à tous. Aujourd'hui, nous vous présentons le duo Elixir et Phoenix.
  > - **Objectif de la séance :** Comprendre comment ce langage fonctionnel et son framework phare apportent une réponse radicale aux enjeux modernes de scalabilité et de temps réel.
  > - **Organisation (60 min) :** Présentation découpée en 3 grandes parties, avant d'enchaîner sur l'atelier pratique de 2 heures.
  > - **Lancement :** Entrons tout de suite dans la première partie consacrée au langage Elixir.

---

#### Slide 2 : Annonce de Partie (Intertitre / Transition)
- **Type de slide** : slide
- **Mise en page** : hero
- **Badge section** : badge-solid : PARTIE 1
- **Titre (title-slide)** : Fondations & Langage Elixir
- **Sous-titre (subtitle-slide)** : Pourquoi réinventer un langage pour le web moderne ? (Durée : 21 min)
- **Organisation (Sous-parties abordées)** : grid-4
  - **Jalon 1** : card
    - badge-gray : 3 min (Mon passage)
    - Titre : Genèse & Histoire
    - Description : José Valim, limites du modèle objet et l'héritage d'Erlang/BEAM.
  - **Jalon 2** : card
    - badge-gray : 4 min
    - Titre : Caractéristiques
    - Description : Typage dynamique, compilation bytecode et runtime BEAM.
  - **Jalon 3** : card
    - badge-gray : 4 min
    - Titre : Paradigme
    - Description : Pensée fonctionnelle, immuabilité et absence d'état partagé.
  - **Jalon 4** : card
    - badge-gray : 10 min
    - Titre : Concepts & Code
    - Description : Pattern matching, pipe operator `|>`, fonctions et processus.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Introduction de la partie :** Nous ouvrons cette première partie dédiée aux fondations d'Elixir, d'une durée de 21 minutes.
  > - **Lien logique :** Avant de manipuler un framework comme Phoenix, il est indispensable de comprendre le moteur qui le propulse.
  > - **Programme de la partie :** Nous débutons par la genèse du langage, avant que mes camarades ne détaillent ses caractéristiques, son paradigme fonctionnel et ses concepts clés avec du code.
  > - **Transition :** Je commence donc par vous expliquer d'où vient Elixir et à quel problème matériel il répond.

---

#### Slide 3 : Contexte / Problématique (Quand, Qui, Pourquoi)
- **Type de slide** : slide
- **Titre (title-slide)** : 2011-2012 : Le Mur de la Concurrence
- **Sous-titre (subtitle-slide)** : Quand le modèle orienté objet traditionnel se heurte aux architectures multi-cœurs
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Problème)** : card
    - badge-gray : Contexte matériel & web
    - Titre : Les limites de l'Orienté Objet
    - Liste (icon-bullet) :
      - Hégémonie de Ruby on Rails : Référence absolue de productivité au début des années 2010.
      - Rupture matérielle : Fin de la course aux GHz (Loi de Moore) au profit du multi-cœur.
      - Goulot d'étranglement : États partagés mutables, deadlocks et verrous complexes (GIL).
      - Essor du temps réel : WebSockets et connexions permanentes saturant les threads classiques.
  - **Colonne Droite (Le Déclic)** : card-featured
    - badge-solid : Le Déclic
    - Titre : José Valim (Core Team Rails)
    - Liste (icon-bullet) :
      - Profil : Développeur brésilien, membre actif de Rails et cofondateur de Plataformatec.
      - L'expérience (2011) : Tentative d'ajouter du multithreading natif dans Rails pour les fortes charges.
      - Le constat sans appel : Le problème vient du paradigme objet mutable lui-même, pas du framework.
      - L'ambition : Réconcilier productivité développeur et concurrence massive sur multi-cœurs.
- **Pied de slide** : banner
  - Problème clé : Les threads systèmes lourds et la mémoire partagée mutable ne peuvent pas absorber l'explosion du web temps réel.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Mise en contexte :** Se replacer en 2011-2012 : Rails domine le monde web, mais le hardware prend un virage avec le multi-cœur.
  > - **L'enjeu technique :** Montée en puissance du web temps réel face à l'incapacité des objets mutables et des threads lourds à paralléliser proprement.
  > - **L'action de José Valim :** Membre de la Core Team Rails, il essaie d'implémenter le multithreading dans Rails et constate les blocages inhérents au langage.
  > - **Transition clé :** Ne pas chercher à bricoler un framework, mais changer les fondations du langage.

---

#### Slide 4 : Architecture / Solution (Comment & Piliers)
- **Type de slide** : slide
- **Titre (title-slide)** : L'Héritage d'Erlang & L'Émergence d'Elixir
- **Sous-titre (subtitle-slide)** : L'alliance de la machine virtuelle BEAM et d'un outillage de nouvelle génération
- **Mise en page** : grid-2
  - **Colonne Gauche (Les Fondations)** : card
    - badge-gray : Télécoms & Haute Disponibilité
    - Titre : La Machine Virtuelle BEAM
    - Liste (icon-bullet) :
      - Origine Ericsson (1986) : Conçu pour les centraux télécoms (visée 99.9999999% uptime).
      - Modèle d'Acteurs : Micro-processus ultra-légers isolés (quelques Ko de RAM, rien à voir avec un thread OS).
      - Immuabilité stricte : Zéro état partagé, communication exclusive par passage de messages asynchrones.
      - Résilience (Let it crash) : Arbres de supervision relançant automatiquement les processus défaillants.
  - **Colonne Droite (La Solution)** : card-featured
    - badge-solid : La Solution Moderne
    - Titre : Elixir (José Valim, 2012)
    - Liste (icon-bullet) :
      - Syntaxe moderne : Expressive et ergonomique, grandement inspirée de Ruby.
      - Méta-programmation : Système puissant de macros avec manipulation directe de l'AST.
      - Outillage complet : Outil d'automatisation Mix et gestionnaire Hex.
      - Validation industrielle : Adopté par Discord, WhatsApp ou Pinterest pour des millions d'utilisateurs connectés.
- **Pied de slide** : banner
  - Formule Elixir : Robustesse industrielle d'Erlang/BEAM + Productivité et élégance moderne.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **L'inspiration Erlang/BEAM :** Expliquer le modèle d'acteurs de la BEAM, la légèreté des processus (quelques Ko) et la philosophie "Let it crash".
  > - **L'apport d'Elixir :** Corriger les faiblesses d'Erlang (syntaxe datée issue de Prolog, outillage pauvre) en apportant l'élégance de Ruby et l'outil Mix.
  > - **Preuve par l'usage :** Citer rapidement Discord ou WhatsApp pour illustrer la fiabilité en production.
  > - **Passage de relais :** Transition vers le camarade suivant qui prend la main sur les caractéristiques intrinsèques du langage Elixir.

#### Slide 5 : Annonce de Partie (Intertitre / Transition)
- **Type de slide** : slide
- **Mise en page** : hero
- **Badge section** : badge-solid : PARTIE 2
- **Titre (title-slide)** : Le Framework Phoenix & Temps Réel
- **Sous-titre (subtitle-slide)** : Bâtir des applications ultra-réactives sans compromis sur la complexité (Durée : 34 min)
- **Organisation (Sous-parties abordées)** : grid-4
  - **Jalon 1** : card
    - badge-gray : 3 min (Mon passage)
    - Titre : Pourquoi Phoenix ?
    - Description : Réponse aux limites de scalabilité, temps réel et perfs réseau.
  - **Jalon 2** : card
    - badge-gray : 8 min (Mon passage)
    - Titre : Fonctionnement & Comparaisons
    - Description : Pipelines Plug, architecture et comparaison face à Thymeleaf/SSR.
  - **Jalon 3** : card
    - badge-gray : 10 min
    - Titre : Fonctionnalités Clés
    - Description : Routage, contrôleurs et la rupture Phoenix LiveView.
  - **Jalon 4** : card
    - badge-gray : 13 min
    - Titre : Démo Live & Quizz
    - Description : Application « Les bons comptes » en direct et quizz interactif.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Prise de parole / Transition :** Je reprends la parole pour ouvrir la deuxième grande partie de notre exposé, consacrée au framework Phoenix.
  > - **Objectif de la partie :** Maintenant que nous connaissons la puissance d'Elixir et de la BEAM, voyons comment Phoenix exploite ce moteur pour révolutionner le développement web.
  > - **Plan de la partie (34 min) :** J'introduis d'abord la raison d'être de Phoenix et son fonctionnement interne en le comparant aux solutions classiques, avant que mes camarades ne détaillent le code et vous fassent la démonstration.
  > - **Lancement :** Première question essentielle : pourquoi un nouveau framework web, et à quels problèmes répond-il ?

---

#### Slide 6 : Contexte / Problématique (Pourquoi Phoenix : Le Mur du Temps Réel)
- **Type de slide** : slide
- **Titre (title-slide)** : Le Défi du Web Temps Réel
- **Sous-titre (subtitle-slide)** : Quand les architectures HTTP classiques s'effondrent sous le poids de la persistance
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Modèle Historique)** : card
    - badge-gray : Web Traditionnel (Req/Resp)
    - Titre : Le paradigme « Requête / Réponse »
    - Liste (icon-bullet) :
      - Modèle Stateless : Le client demande, le serveur répond, la connexion se ferme immédiatement.
      - Approche 1 Thread = 1 Client : Valable pour des pages statiques ou du CRUD simple (Rails, Django, Spring MVC).
      - Coût mémoire élevé : 1 thread OS consomme entre 1 et 8 Mo de RAM.
      - Montée en charge limitée : À 10 000 requêtes concurrentes, les pools de threads saturent et la machine s'écroule.
  - **Colonne Droite (La Rupture Temps Réel)** : card-featured
    - badge-solid : L'Impasse Moderne
    - Titre : L'explosion des WebSockets
    - Liste (icon-bullet) :
      - Nouveaux usages : Notifications push, chat, dashboards vivants, édition collaborative simultanée.
      - Connexions permanentes : Le WebSocket reste ouvert pendant des heures par utilisateur.
      - L'usine à gaz infrastructure : Obligation d'ajouter Redis Pub/Sub, des load-balancers complexes et des brokers de messages.
      - Latence et instabilité : Des temps de réponse qui dérivent de quelques millisecondes à plusieurs secondes sous pic de charge.
- **Pied de slide** : banner
  - Problème fondamental : Les frameworks web nés dans les années 2000 ont été conçus pour fermer les connexions, pas pour en maintenir des millions ouvertes.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Rupture d'usage :** Les frameworks historiques (comme Rails ou Django) ont été pensés pour du HTTP court : requête -> réponse -> déconnexion.
  > - **La réalité d'aujourd'hui :** Le web moderne exige de la persistance (WebSockets, streaming, collaboratif).
  > - **Le coût caché :** Avec un modèle à base de threads OS, garder 50 000 connexions ouvertes demande une quantité astronomique de RAM et oblige à empiler du Redis, des workers et des files d'attente.
  > - **La question :** Comment gérer massivement du temps réel sans faire exploser la facture serveur et la complexité technique ?

---

#### Slide 7 : Architecture / Solution (La Réponse Phoenix & Performances)
- **Type de slide** : slide
- **Titre (title-slide)** : Phoenix : La Scalabilité Massive Sans Fardeau
- **Sous-titre (subtitle-slide)** : Des performances brutes au service d'une architecture simplifiée
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Benchmark Légendaire)** : card-featured
    - badge-solid : Capacité Brute
    - Titre : 2 Millions de Connexions
    - metric : 2 000 000
    - Liste (icon-bullet) :
      - Sur 1 seul serveur : Test historique réalisé par l'équipe de Chris McCord (sur une instance 40 cœurs / 128 Go).
      - Faible empreinte : ~2 Ko de RAM par connexion WebSocket (contre plusieurs Mo pour un thread Java ou Ruby).
      - Latence sub-milliseconde : Réponse instantanée aux diffusions de messages même à 95% de charge processeur.
      - Isolation absolue : Si la session d'un utilisateur crashe, aucun autre client n'est impacté.
  - **Colonne Droite (L'Impact Architectural)** : card
    - badge-gray : Architecture Épurée
    - Titre : Moins de briques, plus de résilience
    - Liste (icon-bullet) :
      - Conçu par Chris McCord : Créé en 2014 pour offrir la productivité de Rails avec la puissance de la BEAM.
      - Pub/Sub distribué intégré : Inutile de déployer un cluster Redis externe pour synchroniser les messages ; la BEAM le fait nativement.
      - Adéquation « Think HUGE » : Taillé sur-mesure pour notre TP (« Les bons comptes ») où chaque dépense ou invitation doit être répercutée en direct.
      - Économie d'infrastructure : Remplacement de parcs entiers de serveurs par une poignée de nœuds résilients.
- **Pied de slide** : banner
  - La promesse Phoenix : La réactivité du temps réel et la productivité d'un framework fullstack moderne, sans l'enfer d'infrastructure.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **L'auteur et la genèse :** Chris McCord conçoit Phoenix en 2014 pour exploiter la BEAM sur le web.
  > - **Le chiffre marquant :** Les 2 millions de WebSockets simultanés sur un seul serveur. Chaque processus ne pesant que 2 Ko, la machine ne s'effondre jamais.
  > - **Simplification de la stack :** Plus besoin de Redis externe pour diffuser des événements à tout le monde : le PubSub distribué est inclus dans la boîte.
  > - **Lien direct avec le projet :** C'est ce qui répond parfaitement à la consigne « Think HUGE » de notre projet « Les bons comptes » : beaucoup d'utilisateurs, beaucoup de dépenses en direct sans jamais faiblir.

  #### Slide 8 : Approfondissement Technique (Le Pipeline Plug & Traitement de Requête)
- **Type de slide** : slide
- **Titre (title-slide)** : L'Architecture Interne : Le Web est une Fonction
- **Sous-titre (subtitle-slide)** : Comment Phoenix transforme une requête HTTP via le contrat Plug
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Fondations
    - Titre : Le Pipeline Unifié
    - Liste (icon-bullet) :
      - Philosophie : Une application web n'est qu'une série de transformations pures sur une structure de données unique.
      - La structure Plug.Conn : Objet immuable représentant la connexion (headers, params, session, statut, réponse).
      - Endpoint : Port d'entrée réseau (serveur Bandit ou Cowboy).
      - Router & Pipelines : Aiguillage vers des suites de plugs (:browser avec CSRF/cookies, :api sans état).
      - Controller : Fonction pure prenant (conn, params) et retournant une nouvelle version de conn.
  - **Colonne Droite (Snippet & Flux)** : code-box
    - code-header : Pipeline Phoenix (router.ex)
    - Code (language-elixir) :
      pipeline :browser do
        plug :accepts, ["html"]
        plug :fetch_session
        plug :protect_from_forgery
        plug :put_secure_browser_headers
      end

      scope "/", AppWeb do
        pipe_through :browser
        get "/wallets", WalletController, :index
      end
- **Pied de slide** : banner
  - Principe directeur : connection |> endpoint |> router |> pipeline |> controller |> view
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le concept clé :** Chez Phoenix, le web est pensé comme une simple fonction mathématique f(requête) = réponse.
  > - **L'objet central Plug.Conn :** Pas de variables globales magiques. Tout transite dans une structure immuable appelée Conn.
  > - **Le rôle des pipelines :** On compose des briques (Plugs) comme des tuyaux : vérification CSRF, parsing JSON, gestion des cookies.
  > - **La simplicité :** C'est prévisible, ultra-performant et très facile à tester unitairement.

---

#### Slide 9 : Architecture / Organisation (Les Contextes Phoenix)
- **Type de slide** : slide
- **Titre (title-slide)** : Structuration du Code : Les Contextes
- **Sous-titre (subtitle-slide)** : Isoler la logique métier des détails d'implémentation du web
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Problème des Frameworks Objets)** : card
    - badge-gray : L'Anti-Pattern Classique
    - Titre : Les Modèles Obèses (Fat Models)
    - Liste (icon-bullet) :
      - Couplage fort : Logique métier mélangée avec les contrôleurs ou les modèles ORM (ActiveRecord).
      - Effets de bord : Un changement dans une table de base casse la logique d'affichage web.
      - Dette technique : Des classes géantes impossibles à découper et lentes à tester.
  - **Colonne Droite (La Solution Phoenix)** : card-featured
    - badge-solid : Conception Modulaire
    - Titre : Phoenix Contexts (DDD-lite)
    - Liste (icon-bullet) :
      - Frontières explicites : Les contextes sont des modules Elixir purs agissant comme des API publiques internes.
      - Découplage total : Le module Web (AppWeb) ne fait qu'appeler le module Métier (App.Accounts, App.Expenses).
      - Persistance isolée : Ecto (gestionnaire de données) sépare la validation (Changesets) des requêtes en base (Repo).
      - Application « Les bons comptes » : Un contexte `Expenses` gère les calculs de dettes indépendamment du protocole web (HTTP ou LiveView).
- **Pied de slide** : banner
  - Règle d'or : L'interface web n'est qu'un client parmi d'autres de votre logique métier.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Pourquoi les Contextes ?** Dans beaucoup de frameworks (Rails, Django), les modèles deviennent vite des "god objects" de 2000 lignes.
  > - **L'approche Phoenix :** Les Contextes introduisent les principes du Domain-Driven Design (DDD).
  > - **Exemple concret pour notre projet :** Dans "Les bons comptes", le calcul pour équilibrer les dépenses et minimiser les remboursements se trouve dans un contexte métier pur, testable sans jamais lancer de serveur web.

---

#### Slide 10 : Comparaison Technologique (Phoenix vs Thymeleaf / SSR Traditionnel)
- **Type de slide** : slide
- **Titre (title-slide)** : Phoenix face au SSR Classique (ex: Thymeleaf / Spring)
- **Sous-titre (subtitle-slide)** : Du rechargement de page complet au rendu réactif bidirectionnel
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Modèle Traditionnel)** : card
    - badge-gray : SSR Classique (Java + Thymeleaf)
    - Titre : Rendu HTML Statique par Requête
    - Liste (icon-bullet) :
      - Cycle lourd : Chaque clic ou action renvoie une requête HTTP complète et réévalue l'intégralité du template HTML.
      - Latence perceptible : Rechargement complet de la page (effet de clignotement / flash blanc).
      - Échappatoire complexe : Pour avoir du dynamisme, obligation d'ajouter une SPA lourde en JavaScript (React/Vue) + une API REST.
      - Double maintenance : Modèles de données à maintenir deux fois (en Java côté backend, en TypeScript côté frontend).
  - **Colonne Droite (L'Innovation LiveView)** : card-featured
    - badge-solid : SSR Nouvelle Génération
    - Titre : Phoenix LiveView & HEEx
    - Liste (icon-bullet) :
      - Rendu initial instantané : La première page arrive en HTML pur ultra-rapide (SEO et affichage immédiat).
      - Escalade WebSocket : Établissement transparent d'un canal persistant en arrière-plan.
      - Diffing chirurgical côté serveur : Lorsqu'une dépense est ajoutée, Phoenix recalcule la vue et n'envoie que les octets modifiés (quelques dizaines de bytes).
      - Zéro JS à maintenir : État 100% géré côté serveur avec l'expérience utilisateur fluide d'une SPA native.
- **Pied de slide** : banner
  - Rupture : On garde la simplicité architecturale du rendu serveur (Thymeleaf) avec la réactivité d'une SPA (React).
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Comparaison avec ce qu'on connaît :** Beaucoup ont manipulé Java avec Thymeleaf ou PHP Blade : le serveur fabrique le HTML et le balance au navigateur.
  > - **Le dilemme historique :** Si on voulait du temps réel, il fallait tout réécrire en React avec des API REST.
  > - **La révolution Phoenix LiveView :** Phoenix prend le meilleur des deux mondes. Pas de rechargement de page, pas de framework JS lourd à configurer.
  > - **L'optimisation du diff :** LiveView ne renvoie jamais de blocs HTML entiers après le chargement initial, seulement les quelques caractères qui changent sur le WebSocket.

---

#### Slide 11 : Synthèse & Matrice Comparative (Tableau Récapitulatif)
- **Type de slide** : slide
- **Titre (title-slide)** : Matrice Comparative des Paradigmes
- **Sous-titre (subtitle-slide)** : Résumé des forces architecturales avant d'entrer dans les détails d'implémentation
- **Mise en page** : grid-2 (ou table pleine largeur)
  - **Tableau comparatif (table)** :
    | Critère d'évaluation | Stack Traditionnelle (ex: Spring / Thymeleaf) | Stack Phoenix (Elixir + LiveView) |
    | :--- | :--- | :--- |
    | **Paradigme d'exécution** | Orienté Objet, mutable, threads OS | Fonctionnel pur, immuable, micro-processus BEAM |
    | **Coût d'une connexion** | Élevé (1 thread = 1 à 8 Mo) | Infime (1 processus = ~2 Ko) |
    | **Gestion de l'interactivité** | Rechargement page ou SPA JS externe | Rendu réactif natif via WebSocket |
    | **Bande passante réseau** | HTML complet ou gros payloads JSON | Diffs binaires minimaux (quelques octets) |
    | **Résilience sous charge** | Risque de saturation globale | Isolation stricte des pannes (*Let it crash*) |
- **Pied de slide** : banner
  - Synthèse : Phoenix apporte une solution élégante et unifiée, là où l'industrie empile généralement plusieurs technologies hétérogènes.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Bilan de la partie :** Ce tableau résume parfaitement pourquoi Phoenix s'impose quand on cherche la scalabilité et le temps réel sans exploser la complexité.
  > - **Transition vers le camarade suivant :** Maintenant que nous avons compris le fonctionnement des pipelines, l'architecture des contextes et la rupture de LiveView face au SSR traditionnel, je passe la main à mon camarade qui va vous montrer le code concret : routeurs, contrôleurs et templates LiveView !