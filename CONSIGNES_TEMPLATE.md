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
> ⛔ **RÈGLE CRITIQUE — LE THÈME SE DÉFINIT EXCLUSIVEMENT AU GLOBAL** :
> 1. Le thème graphique par défaut de la présentation est défini **au niveau global** sur le conteneur racine : `<div class="deck-container" data-theme="dark">` (mode sombre par défaut) ou `data-theme="light"` (mode clair).
> 2. **Toutes les diapositives doivent hériter automatiquement du thème global.**
> 3. **BANISSEMENT STRICT de `data-theme` sur les balises `<section class="slide">`** : Ne mettez JAMAIS `data-theme="..."` sur les slides individuelles. Cela briserait la cohérence visuelle lors de la bascule de thème par l'orateur (ex: touche `T` vers Clean Slate / mode clair) et produirait des textes illisibles (texte blanc sur fond clair).
> 4. La structure complète (textes, titres, cartes, frises, formulaires, quiz, tableaux, header, footer, tiroir de notes) s'adapte automatiquement et harmonieusement au thème sélectionné par l'orateur sans aucune configuration manuelle.

---

### 1.2 Fonctionnement & Adaptation Automatique
Le moteur de présentation (`Deck Engine`) applique le thème de manière hiérarchique et fluide :

1. **Héritage global universel** :
   - Toutes les slides `<section class="slide">` adoptent le thème défini sur `.deck-container`.
   - En mode sombre (`dark`, `nordic`, `cyberpunk`, `emerald`, `navy`, `sepia`), fond sombre, cartes contrastées, textes clairs `#FFFFFF`, séparateurs discrets.
   - En mode clair (`light` / *Clean Slate*), fond blanc-cassé `#F8FAFC`, cartes blanches `#FFFFFF`, textes ardoise `#0F172A`, ombres douces.
2. **Bascule dynamique par l'orateur (`T`)** :
   - L'orateur peut basculer en direct entre les 7 ambiances visuelles à tout moment via la touche `T` ou le popover du header. Tous les textes et composants de toutes les slides s'adaptent instantanément avec un contraste garanti à 100%.
3. **Héritage automatique des accents de couleur** :
   - Les badges, jauges, frises et contours actifs adoptent la couleur d'accent active de manière homogène.

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

### 1.4 Logo d'Entête & Favicon d'Onglet (Zéro Onglet Vide)
Le moteur garantit qu'aucun onglet de navigateur ne s'affiche avec le globe vide ou une entête blanche sans identité :
- **Favicon automatique** : Si rien n'est renseigné, le moteur injecte automatiquement le logo vectoriel SVG haute résolution (`assets/favicon.svg`) dans l'onglet du navigateur et dans la console orateur.
- **Personnalisation via le conteneur racine** :
  - `data-logo="assets/favicon.svg"` (ou tout chemin d'image, SVG ou emoji comme `data-logo="⚡"`) : affiche le logo dans l'entête à côté du titre de la présentation ET configure le favicon d'onglet.
  - `data-favicon="chemin/vers/icone.svg"` : configure spécifiquement l'icône de l'onglet si vous souhaitez une icône distincte de l'entête.
- **Balise HTML standard** : Vous pouvez également déclarer le favicon directement dans le `<head>` de votre page :
  ```html
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  ```

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
   - **Export PDF haute fidélité** : touche `P` ou bouton dédié (mode paysage 16:9 strict, exactement 1 page par slide, respect fidèle du thème clair/sombre de chaque slide, 0 coupure de page).
   - **Fenêtre d'aide des raccourcis** : touche `?`.
   - **Auto-ajustement d'échelle dynamique (Zéro débordement)** : le moteur mesure automatiquement le contenu de chaque slide et applique un facteur d'échelle adaptatif centré (`transform: scale(...)`) pour garantir qu'aucune slide ne déborde de l'écran (laptop, écran externe ou plein écran).
   - **Révélation Progressive & Fragments (`class="fragment"`)** : animation par étapes au sein d'une même slide (`→` / `Espace` révèle le prochain élément, `Shift + →` saute directement à la slide suivante). Entièrement visible à l'export PDF et dans la grille Overview.
   - **Barre de progression dynamique & compteur** de slides dans le header.
4. **🎙️ Mode Présentateur Avancé (Dual-Screen / Speaker View)** :
   - **Fenêtre dédiée synchronisée (touche `S` ou bouton Présentateur)** :
     - Ouvre une seconde fenêtre / onglet autonome réservée à l'orateur (`window.open` avec paramètre ou mode dédié).
     - **Synchronisation temps réel bidirectionnelle** via l'API native `BroadcastChannel` (et fallback `localStorage`) : tout changement de slide ou de fragment sur l'écran présentateur met immédiatement à jour l'écran projeté pour le public, et vice-versa.
   - **Interface complète du Mode Présentateur** :
     - **Indicateur de Rythme (*Pacing Tracker*) en direct** : calcul automatique de la cible idéale par diapositive, minuteur unitaire qui se réinitialise à chaque slide, jauge comparative double (Temps écoulé vs Slides franchies), temps restant et badge de statut dynamique (🟢 *Dans les temps*, 🟡 *Accélérer*, 🔴 *Retard*, 🔵 *En avance*).
     - **Slide actuelle & Aperçu des fragments** : les fragments à venir apparaissent en filigrane (opacité 35%) pour anticiper la suite.
     - **Slide suivante (Next Slide)** : affichage à 100% pour préparer ses transitions.
     - **Chronomètre / Timer interactif** : temps global de séance, boutons Pause/Play, Reset, et horloge courante.
     - **Zone de Notes d'orateur grand format** : affichage lisible des notes de chaque slide (`data-notes`), avec boutons de taille de police `A+` / `A-`.
     - **Contrôles de navigation orateur** : boutons Précédent / Suivant et liste déroulante de saut direct vers n'importe quelle slide.
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
- **Durée totale estimée** : 60 min *(Alimente l'objectif de séance du Pacing Tracker)*
- **Public visé** : Étudiants MIAGE, Développeurs & Architectes Web
- **Thème visuel global** : dark *(choix parmi : dark | light | nordic | cyberpunk | emerald | navy | sepia)*
- **Densité de contenu** : balanced *(choix parmi : `pur-support` | `balanced` | `dense`)*

> ⚠️ **RÈGLE CRITIQUE POUR LA GÉNÉRATION DES SLIDES** :
> - **Le thème visuel est défini UNE SEULE FOIS au global** (dans les métadonnées et sur `<div class="deck-container" data-theme="dark|light">`).
> - **NE JAMAIS écrire ni répéter `theme: dark` ou `theme: light` sur chaque slide** dans le plan Markdown ou dans le code HTML.
> - Seule une slide faisant l'objet d'une exception délibérée de contraste par rapport au reste du diaporama peut porter un attribut `data-theme` unitaire.

---

### 3.3 Canevas & Structure Type d'une Slide (Comment Structurer le Contenu)

Chaque diapositive du plan doit obligatoirement respecter le canevas standardisé ci-dessous pour être interprétée et codée fidèlement par l'agent HTML :

```markdown
#### Slide [Numéro] : [Titre Court / Sujet de la Slide]
- **Type de slide** : slide | hero
- **Durée estimée** : X min *(Crucial pour le Pacing Tracker : calibre le minuteur unitaire et le calcul d'avance/retard)*
- **Titre (title-slide)** : Titre principal affiché en haut de la slide
- **Sous-titre (subtitle-slide)** : Sous-titre ou fil d'Ariane conceptuel
- **Mise en page** : hero | grid-2 | grid-3 | grid-4 | split-code | split-schema
- **Contenu & Composants** : (s'appuyer sur COMPOSANTS_DICTIONNAIRE.md pour les classes standardisées)
  - Blocs & cartes : card (.x-card), card-featured (.x-card.featured), card-metric (.x-card.metric), banner (.summary-box)
  - Badges : pill-tag, pill-tag.solid, pill-tag.gray, bullet-check
  - Visuels : schema-box, code-box, stepper-horizontal, data-table, virtuous-circle, timeline-vertical, mermaid
- **Animation & Révélation progressive (Fragments)** : *(Optionnel mais recommandé pour cadencer)*
  - Spécifier les éléments à révéler au clic (ex: « les cartes apparaissent une par une via fragment »).
- **Logos de pied de slide (optionnel)** :
  - Emplacements : bottom-left, bottom-center, bottom-right avec classes de calibrage (.logo-xs à .logo-xl).
- **Notes d'orateur (data-notes)** : *(OBLIGATOIRE, particulièrement en mode pur-support)*
  - Discours parlé intégral, explications approfondies, détails techniques et relance vers la slide suivante.
```

---

### 3.4 Plan Détaillé des Slides de Démonstration :

#### Slide 1 : Couverture & Sommaire Général
- **Type de slide** : hero
- **Durée estimée** : 2 min
- **Titre (title-slide)** : Elixir & Phoenix Framework
- **Sous-titre (subtitle-slide)** : Scalabilité massive, résilience et paradigme fonctionnel au service du web moderne
- **Mise en page** : hero
- **Contenu & Composants** :
  - **Grille Sommaire** : grid-3
    - **Colonne 1** : card-featured
      - badge-solid : Partie 1
      - Titre : Fondations & Langage Elixir
      - Description : Genèse, paradigme fonctionnel, typage, concurrence BEAM et code en action.
      - badge-gray : 21 min
    - **Colonne 2** : card
      - badge-solid : Partie 2
      - Titre : Framework Phoenix & Temps Réel
      - Description : Architecture Plug, LiveView réactif sans JS lourd et WebSockets massifs.
      - badge-gray : 34 min
    - **Colonne 3** : card
      - badge-solid : Partie 3
      - Titre : Démonstration & TP Pratique
      - Description : Mise en œuvre live de l'application « Les bons comptes » et questions.
      - badge-gray : 5 min
  - **Pied de slide** : banner
    - Formule clé : Module Infrastructures & Frameworks — Master MIAGE
- **Logos de pied de slide** :
  - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes d'orateur (data-notes)** :
  > - **Accroche & Cadre (2 min) :** Bienvenue à tous. Aujourd'hui, nous vous présentons le duo Elixir et Phoenix.
  > - **Objectif de la séance :** Comprendre comment ce langage fonctionnel et son framework phare apportent une réponse radicale aux enjeux modernes de scalabilité et de temps réel.
  > - **Organisation (60 min) :** Présentation découpée en 3 grandes parties, avant d'enchaîner sur l'atelier pratique.
  > - **Lancement :** Entrons tout de suite dans la première partie consacrée au langage Elixir.

---

#### Slide 2 : Annonce de Partie — Fondations & Langage Elixir
- **Type de slide** : hero
- **Durée estimée** : 1 min *(Introduction de la Partie 1, durée totale : 21 min)*
- **Titre (title-slide)** : PARTIE 1 : Fondations & Langage Elixir
- **Sous-titre (subtitle-slide)** : Pourquoi réinventer un langage pour le web moderne ? (Durée totale : 21 min)
- **Mise en page** : hero
- **Contenu & Composants** :
  - **Organisation (Sous-parties abordées)** : grid-4
    - **Jalon 1 (3 min)** : card
      - badge-solid : 3 min
      - Titre : Genèse & Histoire
      - Description : José Valim (2012), les limites de la POO face à l'essor des processeurs multi-cœurs et l'héritage robuste d'Erlang/BEAM (1986).
    - **Jalon 2 (4 min)** : card
      - badge-gray : 4 min
      - Titre : Caractéristiques & Exécution
      - Description : Langage de haut niveau, entièrement compilé en bytecode (`.beam`), typage fort, mémoire isolée par processus et VM BEAM.
    - **Jalon 3 (4 min)** : card
      - badge-gray : 4 min
      - Titre : Paradigme Fonctionnel
      - Description : Penser déclaratif plutôt qu'impératif, immuabilité stricte des données et absence d'état partagé.
    - **Jalon 4 (10 min)** : card
      - badge-gray : 10 min
      - Titre : Concepts Clés & Code en Action
      - Description : Filtrage par motif (Pattern Matching), fonctions pures, structs, chaînage par pipe operator `|>` et pièges classiques.
  - **Pied de slide** : banner
    - Formule clé : 21 minutes pour asseoir les fondations conceptuelles d'Elixir avant d'aborder Phoenix et le web temps réel.
- **Logos de pied de slide** :
  - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes d'orateur (data-notes)** :
  > - **Prise de parole & Cadrage (1 min) :** Nous ouvrons cette première grande partie dédiée aux fondations d'Elixir, pour une durée totale de 21 minutes.
  > - **Pourquoi cette étape :** Avant d'aborder un framework comme Phoenix, il est indispensable de comprendre le moteur fonctionnel qui le propulse.
  > - **Le programme en 4 jalons :**
  >   1. **Genèse & Histoire (3 min) :** D'où vient Elixir et à quelle rupture matérielle il répond.
  >   2. **Caractéristiques techniques (4 min) :** Typage, compilation bytecode et fonctionnement de la machine virtuelle BEAM.
  >   3. **Paradigme fonctionnel (4 min) :** Pourquoi abandonner la programmation objet et les mutations en mémoire.
  >   4. **Concepts & Code concret (10 min) :** Démonstrations de code, pattern matching, structs et pipe operator `|>`.
  > - **Transition :** Je commence donc par le premier jalon : retour en 2011 avec la genèse du langage et le mur du multi-cœur.

---

#### Slide 3 : Frise Historique & Rupture Technologique
- **Type de slide** : slide
- **Durée estimée** : 3 min
- **Titre (title-slide)** : De l'Impasse Monocœur à la Naissance d'Elixir
- **Sous-titre (subtitle-slide)** : Chronologie d'une transition : des verrous de la POO à la concurrence massive sur la BEAM
- **Mise en page** : grid-1
- **Contenu & Composants** :
  - **Frise chronologique (stepper-horizontal)** :
    - **Jalon 1 (1986 - Les Fondations Télécoms)** : step-node
      - badge-gray : 1986
      - Titre : Erlang & la Machine Virtuelle BEAM
      - Logo / Icône : `assets/logos/erlang.svg`
      - Contexte : Conçu par Ericsson pour les commutateurs téléphoniques. Architecture pensée pour la haute disponibilité (99.9999999%), le modèle d'acteurs isolés et la tolérance aux pannes native (*Let it crash*).
    - **Jalon 2 (1995-2005 - L'Âge d'or du Web Objet)** : step-node
      - badge-gray : 1995 - 2005
      - Titre : Essor de la POO (Ruby, Python, Java)
      - Logo / Icône : `assets/logos/ruby.svg`, `assets/logos/python.svg`
      - Contexte : Domination de frameworks productifs (Ruby on Rails, Django, Spring). Approche orientée objet synchrone et exécution séquentielle taillée pour des architectures mono-cœur.
    - **Jalon 3 (2005-2011 - La Limite Matérielle)** : step-node
      - badge-solid : 2005 - 2011 (Le Mur)
      - Titre : Stagnation des GHz & Multi-cœurs
      - Contexte : Fin de la course à la fréquence brute (Loi de Moore) au profit de la multiplication des cœurs processeurs.
      - Blocages POO : États partagés mutables, verrous complexes (locks, GIL), *race conditions* et consommation mémoire excessive des threads systèmes classiques.
    - **Jalon 4 (2012 - L'Émergence d'Elixir)** : step-node active
      - badge-solid : 2012 (Création)
      - Titre : Naissance du Langage Elixir
      - Logo / Icône : `assets/logos/elixir.svg`
      - Auteur : José Valim (membre actif du Core Team Ruby on Rails).
      - La Réponse : Apporter une syntaxe moderne, expressive, un outillage complet (`mix`) et la métaprogrammation sur la machine virtuelle Erlang (BEAM) pour exploiter nativement les processeurs multi-cœurs.

  - **Détails & Comparatif d'impact** : grid-2
    - **Colonne Gauche (Les Limites de la POO Traditionnelle)** : card fragment
      - badge-gray : Avant Elixir (POO & Threads lourds)
      - Titre : Le Mur de la Concurrence
      - Liste (icon-bullet) :
        - Mémoire partagée mutable : source fréquente de corruption d'état et d'interblocages (*deadlocks*).
        - Coût élevé des threads OS : saturation de la RAM et goulots d'étranglement dès quelques milliers de calculs concurrents.
        - Fragilité systémique : une exception non interceptée dans un thread peut faire chuter le processus principal complet.
    - **Colonne Droite (L'Apport Fondateur d'Elixir)** : card-featured fragment
      - badge-solid : La Solution Elixir (Fonctionnel & BEAM)
      - Titre : Productivité Moderne + Concurrence Massive
      - Liste (icon-bullet) :
        - Immuabilité des données : aucun effet de bord indésirable ni partage de mémoire.
        - Micro-processus BEAM : légèreté extrême (~2 Ko de RAM par processus), permettant d'exécuter des millions d'acteurs isolés en parallèle.
        - Philosophie *« Let it crash »* : résilience garantie par des superviseurs qui réinitialisent les processus en échec.
        - Outillage moderne : compilation rapide, gestionnaire de dépendances Hex et système de build unifié Mix.

  - **Pied de slide** : banner fragment
    - Synthèse : Robustesse industrielle d'Erlang/BEAM (1986) + Ergonomie et productivité d'Elixir (2012) = Un langage taillé pour les architectures multi-cœurs modernes.
- **Animation & Révélation progressive (Fragments)** : Les cartes comparatives (.x-card fragment) puis la synthèse (.summary-box fragment) apparaissent successivement au clic / flèche droite.
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Objectif de la slide (3 min) :** Poser les bases historiques d'Elixir sans aborder le web applicatif pour l'instant.
  > - **Les fondations Erlang (1986) :** Rappeler qu'Erlang a été inventé par Ericsson pour faire tourner les commutateurs téléphoniques avec une disponibilité record, grâce à ses processus isolés et sa tolérance aux pannes.
  > - **Le blocage matériel (2005-2011) :** Expliquer qu'avec la multiplication des cœurs processeurs, les langages objets classiques (Ruby, Python, Java) peinaient à paralléliser efficacement à cause de la mémoire mutable partagée et des verrous.
  > - **La vision de José Valim (2012) :** Venu du monde Ruby on Rails, José Valim a voulu résoudre ce problème de concurrence non pas en bricolant une bibliothèque, mais en s'appuyant sur la BEAM avec un nouveau langage expressif, fonctionnel et productif : Elixir.

---

#### Slide 4 : Le Paradigme de Programmation
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : Le Paradigme de Programmation
- **Sous-titre (subtitle-slide)** : Penser déclaratif et fonctionnel : exprimer l'intention plutôt que la mutation
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Déclaratif vs Impératif)** : card
    - badge-gray : L'Intention (« Quoi »)
    - Titre : Déclaratif vs Impératif
    - Liste (icon-bullet) :
      - Ce que l'on veut obtenir : On décrit le résultat souhaité plutôt que la suite mécanique d'instructions.
      - Zéro boucle impérative : Absence de structures `for` ou `while` avec compteurs d'état mutables.
      - Fonctions d'ordre supérieur : Utilisation naturelle de `Enum.map`, `Enum.filter`, `Enum.reduce` ou de la récursion.
  - **Colonne Droite (Immutabilité & Pureté)** : card-featured
    - badge-solid : Pureté des Données
    - Titre : Données Immuables & Fonctions Pures
    - Liste (icon-bullet) :
      - Immutabilité stricte : Les variables ne sont jamais modifiées sur place (zéro effet de bord caché).
      - Fonctions pures ($f(x) = y$) : Même entrée = toujours même sortie, sans dépendre d'un état extérieur.
      - Zéro classe, zéro objet : Pas de `this`, `self` ou `new`. Séparation nette entre données et modules de fonctions.
  - **Pied de slide** : banner
    - Règle d'or : "En impératif, on commande à la machine comment modifier la mémoire. En déclaratif, on transforme des données immuables."
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Le choc culturel :** Expliquer qu'on oublie les boucles `for` classiques et les mutations d'objets (`compte.retirer(50)`).
  > - **L'immutabilité :** En maths, $x = 5$ ne devient jamais $x = 6$ une ligne plus bas. Modifier une donnée produit une nouvelle valeur propre.
  > - **Avantage concret :** Élimine 90% des bugs d'effets de bord et rend le code naturellement parallélisable.

---

#### Slide 5 : Le Système de Typage
- **Type de slide** : slide
- **Durée estimée** : 1 min 30
- **Titre (title-slide)** : Le Système de Typage
- **Sous-titre (subtitle-slide)** : Dynamique à l'écriture, fort et rigoureux à l'exécution (Durée : 1 min 30)
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Dynamique & Fort)** : card
    - badge-gray : Typage & Rigueur
    - Titre : Dynamique mais Strict
    - Liste (icon-bullet) :
      - Typage dynamique : Les types sont portés par les valeurs, pas par les variables (`x = 42` puis `x = "texte"`).
      - Typage fort : Zéro conversion implicite (`"5" + 5` déclenche une `ArithmeticError`, pas de conversion arbitraire comme en JS).
      - Spécifications formelles (`@spec`) : Contrats de types optionnels pour documenter et fiabiliser les API sans lourdeur.
  - **Colonne Droite (Primitives Expressives)** : card-featured
    - badge-solid : Primitives Clés
    - Titre : Des Types Primitifs Riches
    - Liste (icon-bullet) :
      - Atomes (`:ok`, `:error`) : Constantes symboliques légères (simples entiers en mémoire), idéales pour les statuts.
      - Tuples (`{:ok, resultat}`) : Collections ordonnées de taille fixe, parfaites pour les retours de fonctions.
      - Maps (`%{nom: "Alice", solde: 100}`) : Paires clé-valeur ultra-rapides pour structurer les données métier.
  - **Pied de slide** : banner
    - Règle d'or : "La flexibilité d'un langage dynamique alliée à la rigueur d'un typage fort sans conversions cachées."
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Démystifier le dynamique :** Dynamique ne veut pas dire laxiste. Contrairement à JavaScript (`"5" + 5 = "55"`), Elixir stoppe net toute incohérence.
  > - **Les atomes :** Ce DB symboles d'Elixir (comme des enums légers et universels).
  > - **Lien vers la suite :** Ces types structurés (tuples, maps, atomes) sont la base du filtrage de données.

---

#### Slide 6 : Le Modèle d'Exécution
- **Type de slide** : slide
- **Durée estimée** : 1 min 30
- **Titre (title-slide)** : Le Modèle d'Exécution
- **Sous-titre (subtitle-slide)** : Du code source au bytecode optimisé sur la machine virtuelle BEAM
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (La Compilation)** : card
    - badge-gray : Du Source au Bytecode
    - Titre : Compilé, Pas Interprété !
    - Liste (icon-bullet) :
      - Compilateur `elixirc` : Convertit le code source (`.ex`) en bytecode binaire optimisé (`.beam`).
      - Vitesse d'exécution : Bien que sa syntaxe soit aussi fluide que celle de Python ou Ruby, Elixir est 100% compilé.
      - Compilateur JIT intégré : La machine virtuelle convertit le bytecode en instructions machine natives (x86, ARM) à l'exécution.
  - **Colonne Droite (La VM BEAM)** : card-featured
    - badge-solid : Le Runtime
    - Titre : La Machine Virtuelle BEAM
    - Liste (icon-bullet) :
      - Héritage industriel Erlang : Plus de 30 ans d'optimisation destiné aux télécoms et la disponibilité continue.
      - 1 Scheduler par cœur CPU : Exploite pleinement le matériel multi-cœur sans aucun verrou global.
      - Soft Real-Time : Conçu pour garantir des latences prévisibles et bornées même sous forte saturation.
  - **Pied de slide** : banner
    - Règle d'or : "La BEAM est à Elixir ce que la JVM est à Java : un moteur d'exécution compilé taillé pour la vitesse et la haute disponibilité."
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Casser l'idée reçue :** Beaucoup d'étudiants croient qu'Elixir est interprété. C'est faux : il est compilé en bytecode.
  > - **La BEAM :** C'est le moteur le plus éprouvé au monde pour le temps réel et la concurrence (WhatsApp, Discord).
  > - **Parallélisme natif :** Tous les cœurs CPU travaillent simultanément sans se bloquer.

---

#### Slide 7 : La Gestion de la Mémoire
- **Type de slide** : slide
- **Durée estimée** : 1 min 30
- **Titre (title-slide)** : La Gestion de la Mémoire
- **Sous-titre (subtitle-slide)** : Des tas isolés et un Garbage Collector
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Architecture Mémoire)** : card
    - badge-gray : Isolation Totale
    - Titre : Des Tas Mémoire (Heaps) Privés
    - Liste (icon-bullet) :
      - Pas de grand tas partagé : Contrairement à Java ou Go, il n'existe aucun tas mémoire global unique.
      - Micro-tas par processus : Chaque processus possède et gère son propre petit espace mémoire hermétique.
      - Partage structurel : L'immutabilité permet de réutiliser les sous-structures en RAM sans duplication inutile.
  - **Colonne Droite (Le Garbage Collector)** : card-featured
    - badge-solid : Ramasse-Miettes Isolé
    - Titre : Un Garbage Collector par Processus
    - Liste (icon-bullet) :
      - Zéro « Stop-The-World » global : Le Garbage Collector d'un processus ne fige JAMAIS le reste de l'application.
      - Nettoyage en microsecondes : Le GC s'exécute sur des volumes minuscules (quelques Ko), sans pics de latence.
      - Nettoyage gratuit à la mort : Quand un processus court termine sa tâche, toute sa mémoire est libérée d'un bloc sans solliciter le GC.
  - **Pied de slide** : banner
    - Règle d'or : "Cloisonner la mémoire par processus élimine le gel applicatif du Garbage Collector et garantit une latence ultra-stable."
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Le point fort d'Elixir :** En Java, le GC balaye des gigas de RAM et met en pause l'application entière (Stop-the-World).
  > - **Sur la BEAM :** Chaque processus nettoie ses 2 Ko tout seul dans son coin. Zéro impact sur les autres utilisateurs.
  > - **Cycle de vie court :** Pour une requête web, le processus naît, répond, et sa mémoire est relâchée instantanément à sa mort.

---

#### Slide 8 : La Concurrence et le Parallélisme
- **Type de slide** : slide
- **Durée estimée** : 2 min
- **Titre (title-slide)** : La Concurrence & le Parallélisme
- **Sous-titre (subtitle-slide)** : Le modèle d'acteurs : des micro-processus légers sans mémoire partagée
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Les Micro-Processus)** : card
    - badge-gray : Poids Plume
    - Titre : Micro-Processus vs Threads OS
    - metric : ~2 Ko / processus
    - Liste (icon-bullet) :
      - Légèreté extrême (~2 Ko) : Rien à voir avec un thread système lourd (1 à 2 Mo en Java). Des centaines de milliers de processus simultanés par machine.
      - Ordonnancement préemptif : L'ordonnanceur alloue un quota d'opérations équitable : une boucle infinie ne bloque jamais le système.
      - Tolérance aux pannes : Un crash est strictement confiné à son micro-processus (*philosophie « Let it crash »*).
  - **Colonne Droite (Le Modèle d'Acteurs)** : card-featured
    - badge-solid : Modèle d'Acteurs
    - Titre : Zéro Mémoire Partagée
    - Liste (icon-bullet) :
      - Zéro mémoire partagée : Deux processus ne partagent aucune variable en mémoire vive.
      - Adieu verrous et deadlocks : Sans mémoire partagée, les `mutex` et les accès concurrents conflictuels n'existent pas.
      - Communication par messages : Échanges asynchrones exclusifs par copie de données dans la boîte aux lettres du destinataire.
  - **Pied de slide** : banner
    - Règle d'or : "Ne pas communiquer en partageant de la mémoire, mais partager de la mémoire en communiquant."
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Précision clé :** Un processus BEAM n'est PAS un processus OS Linux, c'est un micro-thread virtuel ultra-léger.
  > - **La métaphore des SMS :** Deux personnes qui s'échangent des SMS : chacune a son téléphone, personne ne peut altérer la mémoire de l'autre.
  > - **Transition vers la démo :** "Nous avons posé les 5 piliers théoriques (8 min). Passons maintenant à l'écran pour la démonstration en direct !"

---

#### Slide 9 : Annonce de Section / Sommaire (Intertitre)
- **Type de slide** : slide
- **Mise en page** : hero
- **Badge section** : badge-solid : PARTIE 1 — JALON 4
- **Titre (title-slide)** : Concepts Fondamentaux & Code en Action
- **Sous-titre (subtitle-slide)** : Variables, filtrage par motif, types, fonctions, objets et flux (Durée : 10 min)
- **Organisation (Sous-parties abordées)** : grid-3
  - **Jalon 1** : card
    - badge-gray : 2.5 min
    - Titre : Variables & Pattern Matching
    - Description : L'opérateur `=`, déstructuration instantanée, gestion d'erreurs et opérateur Pin `^`.
  - **Jalon 2** : card
    - badge-gray : 2 min
    - Titre : Les Types de Base
    - Description : Atoms, Tuples, Listes chaînées `[t|q]` et Maps associatives.
  - **Jalon 3** : card
    - badge-gray : 1 min
    - Titre : Les Fonctions
    - Description : Citoyennes de premier rang, fonctions anonymes, modules et notion d'arité.
  - **Jalon 4** : card
    - badge-gray : 1.5 min
    - Titre : Alternative aux Objets
    - Description : Séparation stricte données/méthodes avec Structs et Modules immuables.
  - **Jalon 5** : card
    - badge-gray : 1 min
    - Titre : Flux & Pipe Operator `|>`
    - Description : Chaînage limpide et transformation de données de haut en bas.
  - **Jalon 6** : card
    - badge-gray : 2 min
    - Titre : Pièges & Philosophies
    - Description : Immuabilité, « Let it crash », guillemets et disparition des boucles `for`/`while`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Prise de parole & Transition :** Merci. Je prends maintenant le relais pour vous plonger concrètement dans le code et les mécanismes essentiels du langage Elixir.
  > - **Objectif (10 min) :** Parcourir les fondations syntaxiques et conceptuelles qui font d'Elixir un langage si singulier et productif.
  > - **Au programme :** Le pattern matching, les structures de données, l'absence de classes objet remplacée par les Structs, le célèbre pipe operator, et enfin 4 pièges majeurs à éviter absolument quand on vient de Java ou Python.
  > - **Lancement :** Commençons immédiatement par la base de tout en Elixir : l'opérateur `=` et le pattern matching.

---

#### Slide 10 : Variables et l'opérateur de Pattern Matching
- **Type de slide** : slide
- **Titre (title-slide)** : Variables & Pattern Matching : Le Signe = Réinventé
- **Sous-titre (subtitle-slide)** : En Elixir, le signe = n'est pas une simple assignation, c'est un opérateur de filtrage par motif
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Filtrage par Motif
    - Titre : L'Équivalence & la Déstructuration
    - Liste (icon-bullet) :
      - Pas d'assignation classique : Le signe `=` agit comme une équation mathématique cherchant à faire correspondre le côté gauche et le côté droit.
      - Liaison (binding) : Si une variable nue est à gauche (`x = 1`), Elixir lie la valeur à cette variable.
      - Déstructuration directe : Extraction instantanée des sous-valeurs depuis des tuples ou des structures (`{status, message}`).
      - Gestion d'erreur native : Si le motif ne concorde pas, l'exécution s'interrompt immédiatement avec une `MatchError`.
      - Données immuables : Les structures liées ne sont jamais mutées en mémoire.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pattern_matching.ex
    - Code (language-elixir) :
      # "Assignation" classique (en réalité, on lie la valeur 1 à x)
      x = 1

      # Pattern matching puissant : on extrait les valeurs directement
      # et on continue l'execution si le motif correspond
      {status, message} = {:ok, "Connecté"}

      # Provoque une erreur si le motif ne correspond pas (très utile pour la gestion d'erreur)
      {:ok, resultat} = {:error, "Fichier introuvable"}
      # => ** (MatchError) no match of right hand side value: {:error, "Fichier introuvable"}
  - **Pied de slide** : banner
    - Règle d'or : Le signe `=` valide la forme des données et extrait les valeurs en une seule et unique opération.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Idée fondamentale :** Oubliez le `=` de Java ou C++. En Elixir, `=` s'appelle l'opérateur de match.
  > - **Exemple simple :** `x = 1` ressemble à une assignation, mais en réalité on lie 1 à x.
  > - **La déstructuration :** Avec `{status, message} = {:ok, "Connecté"}`, on dépaquette directement le tuple. Pas besoin de getters ou d'index.
  > - **La gestion d'erreur :** Ligne suivante, si on attend `{:ok, resultat}` mais qu'on reçoit `{:error, ...}`, Elixir lève immédiatement une `MatchError`. C'est la base de la programmation défensive et robuste en Elixir sans empiler des `if/else`.
  > - **Transition :** Mais que se passe-t-il si x a déjà une valeur et qu'on veut comparer sans réassigner ? C'est là qu'intervient l'opérateur Pin.

---

#### Slide 11 : L'Opérateur Pin (^)
- **Type de slide** : slide
- **Titre (title-slide)** : L'Opérateur Pin (^) : Forcer le Test d'Égalité
- **Sous-titre (subtitle-slide)** : Empêcher la réassignation d'une variable existante lors du filtrage par motif
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Contrôle du Motif
    - Titre : Le Verrouillage par Pin (^)
    - Liste (icon-bullet) :
      - Rebinding par défaut : En Elixir, si une variable déjà existante apparaît à gauche d'un `=`, elle est réassignée par défaut à la nouvelle valeur.
      - Rôle de l'opérateur Pin (`^`) : Préfixer une variable avec `^` force le test avec la valeur existante de cette variable.
      - Refus d'assignation : L'opérateur interdit toute nouvelle liaison de valeur et bascule en mode comparaison pure.
      - Assertion stricte : Si la valeur de droite ne coïncide pas exactement avec la valeur existante "épinglée", Elixir lève une `MatchError`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pin_operator.ex
    - Code (language-elixir) :
      x = 1

      # L'opérateur Pin (^) : force le test avec la valeur existante de x (qui est 1)
      # au lieu d'assigner une nouvelle valeur.
      ^x = 1
      # => OK, car x vaut bien 1

      ^x = 2
      # => MatchError !
      # (on refuse d'assigner 2 à x, on vérifie juste si 2 égale 1)
  - **Pied de slide** : banner
    - Principe : Sans `^`, `x = 2` écrase la liaison ; avec `^x = 2`, on teste si la variable vaut bien 2.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Problématique :** Comme Elixir autorise la réassignation de variable (rebinding), comment vérifier qu'une valeur reçue correspond bien à une variable calculée précédemment ?
  > - **Le symbole Pin :** C'est le rôle de l'accent circonflexe `^`. Il "épingle" la variable à sa valeur actuelle.
  > - **Lecture du code :** `^x = 1` réussit car x vaut bien 1. En revanche, `^x = 2` fait échouer le match avec une `MatchError`.
  > - **Cas d'usage :** Essentiel dans les clauses `case` ou dans les paramètres de fonctions pour matcher sur un identifiant précis sans créer de variable locale.

---

#### Slide 12 : Les Types de Base (1/2) : Atoms & Tuples
- **Type de slide** : slide
- **Titre (title-slide)** : Types Fondamentaux : Atoms & Tuples
- **Sous-titre (subtitle-slide)** : Typage dynamique fort, constantes symboliques et conteneurs à taille fixe
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Fondations & Retours
    - Titre : Symboles & Paires
    - Liste (icon-bullet) :
      - Typage dynamique fort : Les types sont vérifiés au runtime sans conversion implicite inattendue.
      - Les Atoms (`:ok`, `:error`) : Des constantes dont le nom est leur propre valeur, extrêmement légères en mémoire (comparables aux symboles Ruby).
      - Les Tuples (`{...}`) : Structures contiguës à taille fixe, idéales pour regrouper les valeurs de retour de fonctions.
      - Extraction de données : Principalement lue via Pattern Matching, ou ponctuellement via `elem(tuple, index)`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : atoms_and_tuples.ex
    - Code (language-elixir) :
      # 1. Les Atoms (des constantes dont le nom est la propre valeur)
      :ok
      :error

      # 2. Les Tuples (taille fixe, très utilisés pour grouper des retours de fonction)
      utilisateur = {:user, "Jean", 25}

      # -> Comment y accéder ? Principalement via Pattern Matching :
      {:user, nom, age} = utilisateur
      # nom vaut "Jean", age vaut 25

      # (Ou via la fonction elem/2 si besoin précis : elem(utilisateur, 1) => "Jean")
      nom_direct = elem(utilisateur, 1) # => "Jean"
  - **Pied de slide** : banner
    - Convention universelle : Le standard Elixir retourne presque toujours `{:ok, resultat}` en cas de succès et `{:error, raison}` en cas d'échec.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Typage en Elixir :** Typage dynamique, mais fort : pas de casting magique silencieux.
  > - **L'Atom :** Préfixé par `:`, son nom est sa valeur. Deux atoms `:ok` pointent vers la même adresse en mémoire.
  > - **Le Tuple :** Conçu pour des groupes de taille connue à l'avance. Remarquez comment la déstructuration par motif extrait `nom` et `age` sans aucun code superflu.
  > - **elem/2 :** Fonction utilitaire pour accéder par index (commence à 0), mais la convention préfère toujours le pattern matching.

---

#### Slide 13 : Les Types de Base (2/2) : Listes Chaînées & Maps
- **Type de slide** : slide
- **Titre (title-slide)** : Collections : Listes Chaînées & Maps
- **Sous-titre (subtitle-slide)** : Décomposition Tête/Queue et dictionnaires associatifs clé/valeur
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Structures de Données
    - Titre : Listes vs Dictionnaires
    - Liste (icon-bullet) :
      - Listes chaînées (`[...]`) : Ce ne sont PAS des tableaux indexés contigus, mais des listes récursives Tête (*Head*) / Queue (*Tail*).
      - Décomposition `[tete | queue]` : Permet d'isoler le premier élément du reste pour des traitements récursifs très rapides.
      - Ajout en tête O(1) : Ajouter au début avec `[0 | liste]` est instantané et préserve la mémoire existante (partage structurel).
      - Maps (`%{...}`) : Dictionnaires clé/valeur avec recherche rapide, accès par `Map.get/2`, syntaxe `map.cle` (si clé atom) et pattern matching.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : lists_and_maps.ex
    - Code (language-elixir) :
      # 3. Les Listes (Ce sont des listes chaînées, pas des tableaux fixes !)
      liste = [1, 2, 3]

      # -> Comment travailler avec ? On sépare souvent la "Tête" (1er élément) de la "Queue" (le reste)
      [tete | queue] = liste 
      # tete vaut 1, queue vaut [2, 3]

      # -> Ajouter un élément ? On l'ajoute toujours au DÉBUT (très rapide en liste chaînée)
      nouvelle_liste = [0 | liste] # => [0, 1, 2, 3]

      # 4. Les Maps (Dictionnaires Clé/Valeur)
      map = %{"role" => "admin", :age => 30}

      # -> Comment accéder aux valeurs ? 
      Map.get(map, "role") # => "admin"

      # -> LE raccourci très utilisé : si la clé est un Atom, on peut utiliser le point (.)
      map.age # => 30

      # -> Le Pattern Matching marche aussi sur les Maps (pour vérifier la présence d'une clé)
      %{age: age_recupere} = map # => age_recupere vaut 30
  - **Pied de slide** : banner
    - À retenir : Les listes chaînées s'alimentent toujours par la tête ; les maps fournissent la flexibilité clé/valeur.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Attention piège :** Une liste Elixir n'est pas un tableau `ArrayList`. Accéder au 1000ème élément oblige à parcourir les 999 précédents.
  > - **L'opérateur pipe `|` dans les listes :** Il sépare la tête (1er élément) de la queue (le reste). L'ajout au début `[0 | liste]` est instantané en O(1).
  > - **Les Maps :** Dictionnaires très puissants. Si les clés sont des atoms, on accède via le point `map.age`. Et notez qu'on peut filtrer par pattern matching pour extraire seulement les clés qui nous intéressent.

---

#### Slide 14 : Les Fonctions & la Notion d'Arité
- **Type de slide** : slide
- **Titre (title-slide)** : Les Fonctions : Citoyennes de Premier Rang
- **Sous-titre (subtitle-slide)** : Fonctions anonymes, fonctions nommées et identification stricte par nom et arité
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Fonctions Pures
    - Titre : Définition & Identification
    - Liste (icon-bullet) :
      - Citoyennes de 1er rang : Les fonctions peuvent être stockées dans des variables, transmises comme arguments ou retournées.
      - Notion d'arité (`nom/arité`) : Une fonction est strictement caractérisée par son nom ET son nombre d'arguments (ex: `add/2` est distincte de `add/3`).
      - Fonctions anonymes : Définies avec `fn -> ... end` et appelées impérativement avec un point `.(args)`.
      - Fonctions nommées : Résident obligatoirement au sein d'un `defmodule` avec syntaxe standard `do...end` ou syntaxe courte en une ligne `do: ...`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : functions.ex
    - Code (language-elixir) :
      # Fonction anonyme
      addition = fn a, b -> a + b end
      addition.(2, 3) # => 5

      # Fonction nommée (doit vivre dans un module)
      defmodule Math do
        def add(a, b) do
          a + b
        end

        # Syntaxe raccourcie très courante
        def sub(a, b), do: a - b
      end
  - **Pied de slide** : banner
    - Convention : En Elixir, on ne parle jamais de la fonction `add`, mais toujours de `Math.add/2`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Citoyennes de 1er rang :** On manipule les fonctions comme des valeurs classiques.
  > - **L'appel anonyme :** Notez le point `addition.(2, 3)`. C'est une distinction syntaxique voulue pour ne pas confondre fonction anonyme et fonction nommée d'un module.
  > - **L'arité :** Retenez bien cette notation slash `/` (`add/2`), vous la retrouverez dans toute la documentation officielle et les messages d'erreur.

---

#### Slide 15 : L'Alternative aux "Objets" : Structs et Modules
- **Type de slide** : slide
- **Titre (title-slide)** : Structs & Modules : Séparer Données et Comportement
- **Sous-titre (subtitle-slide)** : En l'absence de classes objet, découpler l'état (Structs) des transformations (Modules)
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Paradigme Fonctionnel
    - Titre : Pas d'Encapsulation Mutable
    - Liste (icon-bullet) :
      - Rupture avec l'Orienté Objet : En Elixir, on ne regroupe pas données et méthodes au sein d'une même classe.
      - Les Structs (`defstruct`) : Ce sont des Maps typées et nommées définissant la structure de données avec des valeurs par défaut.
      - Les Modules (`defmodule`) : Regroupent les fonctions métier pures qui reçoivent les données, les transforment et retournent une nouvelle copie.
      - Immuabilité stricte : `%{user | age: age + 1}` ne modifie pas l'utilisateur initial en mémoire, mais renvoie un nouvel utilisateur cloné et mis à jour.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : user_struct.ex
    - Code (language-elixir) :
      defmodule User do
        # Définition de la structure de données
        defstruct name: "Anonyme", age: 0

        # Comportement
        def grandir(%User{age: age} = user) do
          %{user | age: age + 1}
          # Retourne un NOUVEL utilisateur, ne modifie pas l'ancien (immuabilité)
        end
      end

      jean = %User{name: "Jean", age: 30}
      jean_plus_vieux = User.grandir(jean)
  - **Pied de slide** : banner
    - Formule clé : Données pures (`Struct`) + Fonctions de transformation (`Module`) = Code prévisible et sans effets de bord.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le choc de l'OO vers le fonctionnel :** En Java, on écrirait `jean.grandir()`, modifiant l'état interne de l'objet.
  > - **L'approche Elixir :** On sépare strictement le conteneur de données (`User` avec son `defstruct`) des fonctions qui le manipulent.
  > - **L'immuabilité en action :** `User.grandir(jean)` ne touche pas à la variable `jean` (qui a toujours 30 ans). Elle renvoie une nouvelle structure avec `age: 31`.
  > - **Élimination des bugs :** Fini les effets de bord où une méthode tierce mute subrepticement votre objet sans que vous le sachiez.

---

#### Slide 16 : Les Flux / Le Pipe Operator (|>)
- **Type de slide** : slide
- **Titre (title-slide)** : Le Pipe Operator (|>) : L'Élégance des Flux
- **Sous-titre (subtitle-slide)** : Transformer les imbrications de parenthèses en un pipeline limpide et naturel
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Fonctionnalité Favorite
    - Titre : Lisibilité & Composition de Flux
    - Liste (icon-bullet) :
      - Mécanisme : L'opérateur `|>` injecte automatiquement le résultat de l'expression de gauche comme premier argument de la fonction de droite.
      - Fin des poupées russes : Supprime les imbrications illisibles de l'intérieur vers l'extérieur `f(g(h(x)))`.
      - Sens de lecture naturel : Le flux se lit de haut en bas et de gauche à droite, comme une chaîne de transformation.
      - Fondement de Phoenix : C'est ce mécanisme exact qui orchestre le passage des requêtes HTTP à travers les Plugs (`conn |> plug1 |> plug2`).
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pipe_operator.ex
    - Code (language-elixir) :
      # Sans le pipe operator (lecture difficile, de l'intérieur vers l'extérieur)
      Enum.sum(Enum.filter(1..10, fn x -> rem(x, 2) == 0 end))

      # AVEC le pipe operator (lecture naturelle, de haut en bas)
      1..10
      |> Enum.filter(fn x -> rem(x, 2) == 0 end)
      |> Enum.sum()
  - **Pied de slide** : banner
    - Équation de lisibilité : `donnée |> étape_1() |> étape_2() |> résultat_final`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le pipe operator :** C'est la fonctionnalité préférée des développeurs Elixir.
  > - **Comparaison visuelle :** En haut, pour comprendre ce que fait le code, il faut commencer par lire au milieu `1..10`, puis reculer vers `Enum.filter`, puis encore vers `Enum.sum`.
  > - **Avec le pipe :** C'est limpide : je prends les nombres de 1 à 10, je garde les pairs, je calcule la somme.
  > - **Lien vers Phoenix :** Retenez bien cette syntaxe, car Phoenix repose à 100% là-dessus pour traiter les connexions web d'étape en étape.

---

#### Slide 17 : Les 4 Pièges & Concepts Clés à Retenir
- **Type de slide** : slide
- **Durée estimée** : 2 min
- **Titre (title-slide)** : Les 4 Pièges & Changements de Paradigme
- **Sous-titre (subtitle-slide)** : Les réflexes impératifs à désapprendre pour maîtriser l'esprit d'Elixir
- **Mise en page** : grid-4
- **Contenu & Composants** :
  - **Colonne 1 (Piège 1)** : card
    - badge-gray : Piège #1
    - Titre : Le Piège de l'Immuabilité
    - Liste (icon-bullet) :
      - Perte de modification : Modifier une liste ou une structure sans récupérer et réassigner le résultat entraîne la perte immédiate du calcul.
      - Zéro mutation sur place : Aucune méthode ne modifie l'objet en mémoire.
  - **Colonne 2 (Concept 2)** : card-featured
    - badge-solid : Philosophie BEAM
    - Titre : La Philosophie « Let it crash »
    - Liste (icon-bullet) :
      - Pas de try/catch à outrance : Contrairement à Java ou C#, on n'encapsule pas tout dans des blocs d'exception.
      - Redémarrage sain : On laisse délibérément le processus planter ; un « Superviseur » le redémarre instantanément dans un état connu et sain.
  - **Colonne 3 (Piège 3)** : card
    - badge-gray : Piège #2
    - Titre : Le Piège des Guillemets
    - Liste (icon-bullet) :
      - Double guillemet `"texte"` : C'est un String binaire UTF-8 classique.
      - Simple guillemet `'texte'` : C'est une Charlist (liste de codes ASCII issue d'Erlang).
      - En mémoire : Écrire `'hello'` équivaut strictement à `[104, 101, 108, 108, 111]`.
  - **Colonne 4 (Concept 4)** : card
    - badge-gray : Piège #3
    - Titre : Adieu while et for
    - Liste (icon-bullet) :
      - Pas de mutation de variable : Les boucles traditionnelles `for`/`while` avec compteurs incrémentés sont impossibles.
      - Transformations pures : Tout se gère par récursivité ou via le module `Enum` (`Enum.map`, `Enum.reduce`). On ne boucle pas, on transforme un flux.
  - **Pied de slide** : banner
    - Mindset Elixir : L'immuabilité et la supervision changent radicalement la façon d'écrire et de fiabiliser un logiciel.
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Synthèse des pièges :** Pour conclure ma partie, voici les 4 points où les nouveaux venus trébuchent le plus :
  > - **1. L'immuabilité :** Si vous faites un `List.delete(l, 1)` sans écrire `l = List.delete(l, 1)`, votre liste d'origine n'a pas bougé !
  > - **2. Let it crash :** Ne cherchez pas à blinder votre code avec des try/catch partout. En Elixir, on laisse planter les micro-processus car l'arbre de supervision les relance instantanément.
  > - **3. Les guillemets :** Attention : `"texte"` (String binaire) n'est pas `'texte'` (Charlist / liste d'entiers Erlang). Les libs Erlang demandent souvent des simples guillemets.
  > - **4. Fin des boucles :** Pas de `while` ni de `for` mutable. On utilise `Enum.map` ou la récursion. On transforme la donnée.
  > - **Transition vers la Partie 2 :** Vous avez maintenant en main tous les concepts fondamentaux d'Elixir. Je passe la parole à mon camarade pour découvrir comment le framework Phoenix exploite toute cette puissance pour révolutionner le web temps réel !
