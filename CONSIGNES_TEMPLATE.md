# CONSIGNES : Génération de Présentation Slide Deck HTML

Génère une présentation complète au format fichier unique HTML (`presentation.html`) autonome et moderne, basée sur le moteur de template fourni.

---

> 📚 **RÉFÉRENTIEL DES OBJETS & COMPOSANTS : `COMPOSANTS_DICTIONNAIRE.md`**
> Un dictionnaire complet de composants prêts à l'emploi est formalisé dans le fichier [`COMPOSANTS_DICTIONNAIRE.md`](COMPOSANTS_DICTIONNAIRE.md).
> **RÈGLE OBLIGATOIRE POUR LA CRÉATION DES SLIDES** :
> Pour concevoir et structurer le contenu des diapositives, vous devez **systématiquement vous appuyer sur ce dictionnaire** pour instancier les objets souhaités :
> - **Mises en page & Layouts** : `slide`, `grid-2`, `grid-3`, `grid-4`, `split-code`, `split-schema`, `hero`
> - **Cartes & Conteneurs** : `x-card`, `x-card.featured`, `x-card.metric`, `summary-box`
> - **Schémas & Médias** : `schema-box`, `schema-box.framed`, `schema-img`, `schema-caption`, `split-schema`
> - **Données & Tableaux** : `data-table`, `metric-value` (KPI), `progress-track`
> - **Frises & Processus** : `stepper-horizontal` (`step-node`), `timeline-vertical` (`timeline-card`)
> - **Boucles & Cycles** : `virtuous-circle` (`cycle-core`, `cycle-step`)
> - **Actions & Liens** : `text-link`, `btn-action`, `link-card`, `repo-link`
> - **Développeur & Terminal** : `code-box` (Prism.js), `code-header`, `terminal-box`, `inline-code`
> - **Badges & Typo** : `pill-tag`, `pill-tag.solid`, `pill-tag.gray`, `bullet-check`
> - **Logos & Sponsors** : `slide-logo.bottom-left`, `slide-logo.bottom-center`, `slide-logo.bottom-right`, `slide-bottom-logos` (avec auto-calibrage de taille garanti)
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
  - Logos de pied de slide auto-calibrés (`.slide-logo.bottom-left`, `.slide-logo.bottom-center`, `.slide-logo.bottom-right`, `.slide-bottom-logos` ou `data-logo-*`)
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
   - **Personnalisation en direct de la Couleur d'accentuation** : touche `C` ou menu palette dans le header (palette de presets vibrants : Rouge Crimson, Bleu Cobalt, Vert Émeraude, Violet Cyber, Ambre, Rose Néon, Cyan + ajout libre de nuances au format hexadécimal `#HEX` avec sauvegarde dans "Mes couleurs", persistance `localStorage`, paramètre URL `?color=...`, et synchronisation temps réel dual-screen).
   - **Export PDF haute fidélité** : touche `P` ou bouton dédié (mode paysage 16:9 strict, exactement 1 page par slide, respect fidèle du thème clair/sombre de chaque slide, 0 coupure de page).
   - **Fenêtre d'aide des raccourcis** : touche `?`.
   - **Auto-ajustement d'échelle dynamique (Zéro débordement)** : le moteur mesure automatiquement le contenu de chaque slide et applique un facteur d'échelle adaptatif centré (`transform: scale(...)`) pour garantir qu'aucune slide ne déborde de l'écran (laptop, écran externe ou plein écran).
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

### 3.1 Indication de Densité & Style de Contenu (Volume Textuel vs Pur Support)

Avant de rédiger ou de générer les diapositives, vous **DEVEZ définir le niveau de densité textuelle souhaité**. Ce choix fondamental régit la façon dont l'information est répartie entre l'écran visible et les notes d'orateur :

| Niveau de Densité | Contexte & Intention | Rendu Visible à l'Écran | Déport dans les Notes d'Orateur (`data-notes`) |
| :--- | :--- | :--- | :--- |
| **`pur-support`** *(Minimal)* | **Soutenance orale, Conférence, Keynote, Pitch**<br>Le public doit écouter l'orateur et non lire l'écran. | **Ultra-épuré & Visuel** :<br>• 1 seule idée maîtresse par slide.<br>• Mots-clés percutants (3 à 6 mots maximum par bloc).<br>• Zéro phrase rédigée avec verbe conjugué.<br>• Accent mis sur les chiffres géants (`.x-card.metric`), icônes et schémas (`.schema-box`). | **TRÈS FOURNI & EXPLICITE (Obligatoire)** :<br>Tout le discours oral, les explications complètes, les transitions et les exemples sont rédigés dans `data-notes="..."` pour être lus dans la **Console Présentateur (`S`)**. |
| **`balanced`** *(Modéré / Standard)* | **Présentation technique d'équipe, Réunion de cadrage**<br>Équilibre entre clarté visuelle et autonomie de lecture. | **Synthétique & Structuré** :<br>• Puces courtes formulées sous forme de constats clés (1 ligne max).<br>• Cartes modulaires (`.x-card`) bien compartimentées.<br>• 1 boîte de synthèse concise (`.summary-box`). | **Équilibré** :<br>Points d'appui oraux, détails complémentaires, arguments de relance et réponses aux questions anticipées. |
| **`dense`** *(Documentation / Référence)* | **Support de cours, Polycopié de référence, Livrable sans orateur**<br>Le diaporama doit être totalement auto-porteur. | **Complet & Détaillé** *(ex: `presentation.html`)* :<br>• Paragraphes explicatifs complets, définitions précises.<br>• Listes à puces circonstanciées, démonstrations et synthèses exhaustives.<br>• Plusieurs niveaux d'information par diapositive.<br>• *(Pris en charge automatiquement sans débordement par `deck-fit.js`)*. | **Complémentaire** :<br>Précisions de timing, références bibliographiques ou coulisses du projet. |

> 💡 **RÈGLES D'OR POUR LA GÉNÉRATION DES SLIDES** :
> 1. **Si le mode `pur-support` est sélectionné** : **INTERDICTION de surcharger l'écran**. Toute phrase explicative doit être impérativement résumée en 1 mot-clé ou 1 chiffre sur la slide, et la phrase complète doit être déplacée dans l'attribut `data-notes` de la slide.
> 2. **Si le mode `dense` est sélectionné** : Utilisez la hiérarchie des composants de [`COMPOSANTS_DICTIONNAIRE.md`](COMPOSANTS_DICTIONNAIRE.md) (`.split-2`, `.timeline-milestones`, `.x-card.featured`, `.bullet-check`, `.summary-box`) pour maintenir une lisibilité optimale malgré la richesse du contenu.

---

### 3.2 Métadonnées Générales :
- **Titre de la présentation** : Elixir & Phoenix : Le Web Haute Performance et Temps Réel
- **Sous-titre / Thème** : Module Infrastructures & Frameworks — Master MIAGE
- **Durée totale estimée** : 60 min (Atelier complet de présentation)
- **Public visé** : Étudiants MIAGE
- **Thème visuel global** : dark
- **Densité de contenu** : pur-support *(choix parmi : `pur-support` | `balanced` | `dense`)*

> ⚠️ **RÈGLE CRITIQUE POUR LA GÉNÉRATION DES SLIDES** :
> - **Le thème visuel est défini UNE SEULE FOIS au global** (dans les métadonnées et sur `<div class="deck-container" data-theme="dark|light">`).
> - **NE JAMAIS écrire ni répéter `theme: dark` ou `theme: light` sur chaque slide** dans le plan Markdown ou dans le code HTML.
> - Seule une slide faisant l'objet d'une exception délibérée de contraste par rapport au reste du diaporama peut porter un attribut `data-theme` unitaire.

### Structure des Slides :

#### Slide 3 : Frise Historique & Rupture Technologique
- **Type de slide** : slide[cite: 1, 3]
- **Titre (title-slide)** : De l'Impasse Monocœur à la Naissance d'Elixir[cite: 1, 3]
- **Sous-titre (subtitle-slide)** : Chronologie d'une transition : des verrous de la POO à la concurrence massive sur la BEAM[cite: 1, 3]
- **Mise en page** : grid-1[cite: 3]
  - **Frise chronologique (stepper-horizontal)** :[cite: 1, 3]
    - **Jalon 1 (1986 - Les Fondations Télécoms)** : step-node[cite: 1, 3]
      - badge-gray : 1986[cite: 1, 3]
      - Titre : Erlang & la Machine Virtuelle BEAM[cite: 1]
      - Logo / Icône : `assets/logos/erlang.svg`
      - Contexte : Conçu par Ericsson pour les commutateurs téléphoniques[cite: 1]. Architecture pensée pour la haute disponibilité (99.9999999%), le modèle d'acteurs isolés et la tolérance aux pannes native (*Let it crash*)[cite: 1].
    - **Jalon 2 (1995-2005 - L'Âge d'or du Web Objet)** : step-node[cite: 1, 3]
      - badge-gray : 1995 - 2005[cite: 1, 3]
      - Titre : Essor de la POO (Ruby, Python, Java)[cite: 1]
      - Logo / Icône : `assets/logos/ruby.svg`, `assets/logos/python.svg`
      - Contexte : Domination de frameworks productifs (Ruby on Rails, Django, Spring)[cite: 1]. Approche orientée objet synchrone et exécution séquentielle taillée pour des architectures mono-cœur[cite: 1].
    - **Jalon 3 (2005-2011 - La Limite Matérielle)** : step-node[cite: 1, 3]
      - badge-solid : 2005 - 2011 (Le Mur)[cite: 1, 3]
      - Titre : Stagnation des GHz & Multi-cœurs[cite: 1]
      - Contexte : Fin de la course à la fréquence brute (Loi de Moore) au profit de la multiplication des cœurs processeurs[cite: 1].
      - Blocages POO : États partagés mutables[cite: 1], verrous complexes (locks, GIL), *race conditions* et consommation mémoire excessive des threads systèmes classiques[cite: 1].
    - **Jalon 4 (2012 - L'Émergence d'Elixir)** : step-node active[cite: 1, 3]
      - badge-solid : 2012 (Création)[cite: 1, 3]
      - Titre : Naissance du Langage Elixir[cite: 1]
      - Logo / Icône : `assets/logos/elixir.svg`
      - Auteur : José Valim (membre actif du Core Team Ruby on Rails)[cite: 1].
      - La Réponse : Apporter une syntaxe moderne, expressive, un outillage complet (`mix`) et la métaprogrammation sur la machine virtuelle Erlang (BEAM) pour exploiter nativement les processeurs multi-cœurs[cite: 1].

  - **Détails & Comparatif d'impact** : grid-2[cite: 1, 3]
    - **Colonne Gauche (Les Limites de la POO Traditionnelle)** : card[cite: 1, 3]
      - badge-gray : Avant Elixir (POO & Threads lourds)[cite: 1, 3]
      - Titre : Le Mur de la Concurrence[cite: 1]
      - Liste (icon-bullet) :[cite: 1, 3]
        - Mémoire partagée mutable : source fréquente de corruption d'état et d'interblocages (*deadlocks*)[cite: 1].
        - Coût élevé des threads OS : saturation de la RAM et goulots d'étranglement dès quelques milliers de calculs concurrents[cite: 1].
        - Fragilité systémique : une exception non interceptée dans un thread peut faire chuter le processus principal complet.
    - **Colonne Droite (L'Apport Fondateur d'Elixir)** : card-featured[cite: 1, 3]
      - badge-solid : La Solution Elixir (Fonctionnel & BEAM)[cite: 1, 3]
      - Titre : Productivité Moderne + Concurrence Massive[cite: 1]
      - Liste (icon-bullet) :[cite: 1, 3]
        - Immuabilité des données : aucun effet de bord indésirable ni partage de mémoire[cite: 1].
        - Micro-processus BEAM : légèreté extrême (~2 Ko de RAM par processus), permettant d'exécuter des millions d'acteurs isolés en parallèle[cite: 1].
        - Philosophie *« Let it crash »* : résilience garantie par des superviseurs qui réinitialisent les processus en échec[cite: 1].
        - Outillage moderne : compilation rapide, gestionnaire de dépendances Hex et système de build unifié Mix[cite: 1].

- **Pied de slide** : banner[cite: 1, 3]
  - Synthèse : Robustesse industrielle d'Erlang/BEAM (1986) + Ergonomie et productivité d'Elixir (2012) = Un langage taillé pour les architectures multi-cœurs modernes[cite: 1].

- **Notes présentateur (notes : data-notes ou speaker-notes)** :[cite: 1, 3]
  > - **Objectif de la slide (3 min) :** Poser les bases historiques d'Elixir sans aborder le web applicatif pour l'instant[cite: 1].
  > - **Les fondations Erlang (1986) :** Rappeler qu'Erlang a été inventé par Ericsson pour faire tourner les commutateurs téléphoniques avec une disponibilité record, grâce à ses processus isolés et sa tolérance aux pannes[cite: 1].
  > - **Le blocage matériel (2005-2011) :** Expliquer qu'avec la multiplication des cœurs processeurs, les langages objets classiques (Ruby, Python, Java) peinaient à paralléliser efficacement à cause de la mémoire mutable partagée et des verrous[cite: 1].
  > - **La vision de José Valim (2012) :** Venu du monde Ruby on Rails, José Valim a voulu résoudre ce problème de concurrence non pas en bricolant une bibliothèque, mais en s'appuyant sur la BEAM avec un nouveau langage expressif, fonctionnel et productif : Elixir[cite: 1].

#### Slide 2.1 : Pourquoi Phoenix ? (3 min)
- **Type de slide** : slide
- **Titre (title-slide)** : Pourquoi Phoenix ?
- **Sous-titre (subtitle-slide)** : L'inadéquation des architectures web classiques face à la persistance
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Décalage Conceptuel)** : card
    - badge-gray : L'Héritage des Années 2000
    - Titre : Quand le Web passe du « Document » à « L'État Persistant »
    - Liste (icon-bullet) :
      - Modèle historique « Éphémère » : Le Web a été pensé pour des cycles courts : Requête $\rightarrow$ Réponse $\rightarrow$ Fermeture.
      - Nouveaux usages « Vivants » : Chats, tableaux de bord partagés, notifications et synchronisation collaborative exigent des connexions ouvertes en continu (WebSockets).
      - Le piège du Thread OS : Assigner un thread système lourd (1 à 8 Mo de RAM) à chaque utilisateur juste pour attendre passivement un événement sature immédiatement la mémoire.
      - La fuite en avant d'infrastructure : Obligation d'empiler des briques externes (Redis Pub/Sub, workers, brokers) pour relier des serveurs devenus incapables de se parler directement.
  - **Colonne Droite (La Vision Phoenix)** : card-featured
    - badge-solid : Le Web Pensé comme un Système d'Acteurs
    - Titre : Concurrence Native & Tolérance aux Pannes
    - Liste (icon-bullet) :
      - Un acteur par connexion : Chaque client connecté est un micro-processus BEAM isolé pesant à peine ~2 Ko en mémoire.
      - Attente passive à coût zéro : Un processus au repos ne consomme aucun cycle CPU et s'éveille uniquement lorsqu'un message lui parvient.
      - Réseau distribué intégré : Le moteur de diffusion (Pub/Sub) fonctionne nativement entre les nœuds de la machine virtuelle, sans avoir besoin d'un cluster Redis dédié.
      - Zéro effet de contagion : L'erreur d'un utilisateur n'impacte jamais la connexion des autres clients grâce à l'isolation stricte des acteurs.
- **Pied de slide** : banner
  - Clé de voûte : Phoenix a été pensé dès le premier jour pour un Web où chaque utilisateur maintient un lien persistant avec le serveur.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **L'origine du problème (1 min) :** Pourquoi concevoir un nouveau framework web en 2014 ? Parce que les frameworks existants (Rails, Django, Spring) ont été conçus à une époque où le Web n'était qu'un échange de documents éphémères : je clique, le serveur calcule, répond et ferme la porte.
  > - **Le blocage architectural (1 min) :** Aujourd'hui, une application web moderne ressemble à une application de bureau : tout le monde est connecté en continu. Si on utilise des threads systèmes pour maintenir ces connexions, on gaspille des gigaoctets de mémoire à ne rien faire, et on doit installer un Redis juste pour faire passer un message d'un utilisateur à l'autre.
  > - **L'apport conceptuel de Phoenix (1 min) :** Phoenix transpose le modèle d'acteurs d'Erlang au Web. Chaque onglet ouvert dans un navigateur devient un micro-processus isolé de 2 Ko. Le serveur peut ainsi gérer des millions de connexions persistantes naturellement, sans surchauffe et sans machinerie complexe.

  #### Slide 2.2.A : Le Moteur Sous le Capot : Le Contrat Plug (2 min 30)
- **Type de slide** : slide
- **Titre (title-slide)** : Fonctionnement Interne : Le Modèle Plug
- **Sous-titre (subtitle-slide)** : Une architecture web pensée comme un pipeline de transformations pures
- **Mise en page** : split-code
  - **Colonne Gauche (Le Concept)** : card
    - badge-solid : Fondations
    - Titre : Une Requête = Une Donnée Immuable
    - Liste (icon-bullet) :
      - Spécification unifiée : Plug est la brique minimale entre le serveur HTTP et Phoenix (l'équivalent de Rack en Ruby ou des Servlets Java).
      - L'état encapsulé (%Plug.Conn{}) : Une structure de données unique et immuable contenant l'entrée (headers, body, session) et la sortie en construction (status, réponse).
      - Composition par tuyaux : Pas d'effets de bord cachés ni d'objets request/response mutables séparés ; la connexion traverse une suite de fonctions pures : `conn |> plug_1 |> plug_2`.
  - **Colonne Droite (Le Schéma de Flux)** : terminal-box
    - terminal-header : Flux d'une Connexion Plug
    - Terminal-Content :
      [Client HTTP]
            │
            ▼
      [Endpoint]         --> Parsing headers, SSL, logs
            │
            ▼
      [Router Pipelines] --> Sécurité CSRF, gestion session
            │
            ▼
      [Dispatch]         --> Aiguillage vers la logique de réponse
- **Pied de slide** : banner
  - Principe directeur : Dans Phoenix, une application web n'est pas un graphe d'objets complexes, mais une fonction mathématique f(conn) = conn.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Objectif de la slide (2 min 30) :** Expliquer la plomberie interne sans entrer dans le code des contrôleurs.
  > - **Ce qu'est Plug :** Insister sur le fait que Plug est la spécification centrale. Contrairement à Java EE où on manipule HttpServletRequest et HttpServletResponse avec des états mutables, Phoenix regroupe tout dans une seule structure immuable : Conn.
  > - **L'avantage mental :** C'est un simple tuyau de fonctions pures. Cela rend le flux prévisible, traçable et instantanément testable sans avoir à émuler un serveur complet.

---

#### Slide 2.2.B : Structuration Métier : Les Contextes Phoenix (2 min 30)
- **Type de slide** : slide
- **Titre (title-slide)** : Découplage : Le Web n'est qu'un Détail
- **Sous-titre (subtitle-slide)** : Séparer strictement le domaine métier des protocoles de transport
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Piège des Frameworks Web)** : card
    - badge-gray : L'Écueil Classique
    - Titre : Le Couplage Web & Modèles
    - Liste (icon-bullet) :
      - Modèles obèses (Fat Models) : Règles de gestion, validations et requêtes SQL souvent mélangées aux contrôleurs web.
      - Dépendance au protocole : Impossible de tester une règle de calcul sans simuler une session ou un contrôleur HTTP.
      - Dette technique rapide : À mesure que l'application grandit, le code métier devient indémêlable du framework.
  - **Colonne Droite (L'Approche Phoenix)** : card-featured
    - badge-solid : Architecture Contexts
    - Titre : Frontières Déclaratives (DDD-lite)
    - Liste (icon-bullet) :
      - Séparation explicite : Deux dossiers distincts dans le projet — `lib/mon_app` (le métier pur) et `lib/mon_app_web` (l'interface utilisateur).
      - API publiques internes : Les Contextes sont des modules Elixir exposant des fonctions métier claires (ex: `Accounts`, `Expenses`).
      - Indépendance totale : La logique de calcul s'exécute de la même manière, qu'elle soit appelée par une requête HTTP, un canal temps réel ou un script CLI.
- **Pied de slide** : banner
  - Règle d'or architecturale : L'interface web n'est qu'un adaptateur de présentation au-dessus de votre domaine applicatif.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Rôle de la slide (2 min 30) :** Montrer comment Phoenix structure une application avant de voir les contrôleurs.
  > - **Le problème résolu :** Dans beaucoup de frameworks, les modèles deviennent des fourre-tout géants. Phoenix impose dès la génération une séparation nette.
  > - **La frontière métier / web :** L'interface web (contrôleurs, vues) n'a pas le droit d'écrire directement dans la base de données : elle passe obligatoirement par un Contexte qui encapsule les règles métier.

---

#### Slide 2.2.C : Comparaison : Phoenix face au SSR Traditionnel (3 min)
- **Type de slide** : slide
- **Titre (title-slide)** : Modèle de Rendu : Phoenix face à Thymeleaf
- **Sous-titre (subtitle-slide)** : De la régénération HTML complète au différentiel binaire sur socket
- **Mise en page** : grid-2
  - **Colonne Gauche (Rendu Serveur Classique - ex: Spring / Thymeleaf)** : card
    - badge-gray : SSR Traditionnel
    - Titre : Concaténation Statique par Requête
    - Liste (icon-bullet) :
      - Modèle synchrone : Chaque interaction utilisateur impose une nouvelle requête HTTP et le renvoi complet de l'arbre HTML.
      - Rupture d'expérience : Latence perceptible, rechargement complet de la page (*flash blanc*).
      - Impasse de l'interactivité : Pour rendre un composant dynamique, obligation d'abandonner Thymeleaf, de monter une API REST et d'ajouter un framework JS lourd (React/Vue).
  - **Colonne Droite (Rendu Phoenix & HEEx)** : card-featured
    - badge-solid : Modèle Réactif Phoenix
    - Titre : Compilation de Gabarits & Diffs Chirurgicaux
    - Liste (icon-bullet) :
      - Templates compilés : À la compilation, Phoenix distingue les fragments statiques (HTML fixe) des parties variables.
      - Économie de bande passante : Lorsqu'une donnée change, Phoenix n'envoie ni une nouvelle page, ni un gros JSON : uniquement les quelques octets modifiés.
      - Simplicité préservée : Le confort de développement du rendu serveur (SSR) sans la complexité d'une SPA JavaScript cliente.
- **Pied de slide** : banner
  - Comparatif clé : Thymeleaf renvoie des blocs HTML complets à chaque clic ; Phoenix maintient une vue vivante et n'envoie que les deltas de texte.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **L'enjeu de la comparaison (3 min) :** Dans beaucoup de projets académiques ou d'entreprise, on utilise Spring Boot avec Thymeleaf.
  > - **Le point de blocage de Thymeleaf :** Dès qu'on veut du temps réel ou une mise à jour partielle, Thymeleaf ne suffit plus et oblige à introduire React ou Vue avec une API REST.
  > - **Comment Phoenix fait la différence :** Grâce à ses gabarits HEEx compilés, Phoenix garde l'état côté serveur et transmet uniquement les petites différences de texte. On garde la simplicité du SSR sans le surcoût d'un frontend séparé.
  > - **Passage de relais :** Maintenant que nous comprenons ce fonctionnement, nous allons pouvoir découvrir concrètement dans la partie suivante comment s'écrivent les routes, les contrôleurs et les composants interactifs.