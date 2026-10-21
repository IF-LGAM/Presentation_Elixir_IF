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
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
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
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
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
---

#### Slide 18 : Annonce de Partie — Framework Phoenix & Temps Réel
- **Type de slide** : hero
- **Durée estimée** : 1 min *(Introduction de la Partie 2, durée totale : 34 min)*
- **Titre (title-slide)** : PARTIE 2 : Framework Phoenix & Temps Réel
- **Sous-titre (subtitle-slide)** : L'architecture web haute performance et temps réel propulsée par la BEAM (Durée : 34 min)
- **Mise en page** : hero
- **Contenu & Composants** :
  - **Organisation (Sous-parties abordées)** : grid-4
    - **Jalon 1 (3 min)** : card
      - badge-solid : 3 min
      - Titre : Pourquoi Phoenix ?
      - Description : Rupture avec le modèle requête/réponse éphémère et adoption du modèle d'acteurs pour connexions persistantes.
    - **Jalon 2 (5 min)** : card
      - badge-gray : 5 min
      - Titre : Architecture Interne & Découplage
      - Description : Le contrat Plug comme pipeline de fonctions pures et l'isolation métier via les Contexts Phoenix.
    - **Jalon 3 (3 min)** : card
      - badge-gray : 3 min
      - Titre : Modèle de Rendu Réactif
      - Description : Comparatif avec Thymeleaf/SSR classique et compilation de gabarits HEEx à différentiel binaire.
    - **Jalon 4 (10 min)** : card
      - badge-gray : 10 min
      - Titre : Routage, Contrôleurs & LiveView
      - Description : Pipelines HTTP, APIs REST immuables, collaboration temps réel sur WebSocket et matrice décisionnelle.
  - **Pied de slide** : banner
    - Formule clé : 34 minutes pour maîtriser l'architecture du framework Phoenix et la révolution LiveView.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Prise de parole & Cadrage (1 min) :** Merci. Nous abordons maintenant la deuxième grande partie consacrée au framework Phoenix, pour une durée de 34 minutes.
  > - **Pourquoi Phoenix :** Nous avons vu les fondations exceptionnelles d'Elixir et de la BEAM. Phoenix est l'outil qui met toute cette puissance au service du web moderne.
  > - **Au programme :** Comprendre pourquoi les architectures web traditionnelles s'essoufflent, explorer le moteur Plug et les Contextes métier, comparer le rendu Phoenix face à Thymeleaf, puis plonger dans le code avec LiveView et le temps réel.
  > - **Lancement :** Démarrons tout de suite en nous posant la question essentielle : Pourquoi créer Phoenix ?

---

#### Slide 19 : Pourquoi Phoenix ?
- **Type de slide** : slide
- **Durée estimée** : 3 min
- **Titre (title-slide)** : Pourquoi Phoenix ?
- **Sous-titre (subtitle-slide)** : L'inadéquation des architectures web classiques face à la persistance
- **Mise en page** : grid-2
- **Contenu & Composants** :
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
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **L'origine du problème (1 min) :** Pourquoi concevoir un nouveau framework web en 2014 ? Parce que les frameworks existants (Rails, Django, Spring) ont été conçus à une époque où le Web n'était qu'un échange de documents éphémères : je clique, le serveur calcule, répond et ferme la porte.
  > - **Le blocage architectural (1 min) :** Aujourd'hui, une application web moderne ressemble à une application de bureau : tout le monde est connecté en continu. Si on utilise des threads systèmes pour maintenir ces connexions, on gaspille des gigaoctets de mémoire à ne rien faire, et on doit installer un Redis juste pour faire passer un message d'un utilisateur à l'autre.
  > - **L'apport conceptuel de Phoenix (1 min) :** Phoenix transpose le modèle d'acteurs d'Erlang au Web. Chaque onglet ouvert dans un navigateur devient un micro-processus isolé de 2 Ko. Le serveur peut ainsi gérer des millions de connexions persistantes naturellement, sans surchauffe et sans machinerie complexe.

---

#### Slide 20 : Le Moteur Sous le Capot : Le Contrat Plug
- **Type de slide** : slide
- **Durée estimée** : 2 min 30
- **Titre (title-slide)** : Fonctionnement Interne : Le Modèle Plug
- **Sous-titre (subtitle-slide)** : Une architecture web pensée comme un pipeline de transformations pures
- **Mise en page** : split-code
- **Contenu & Composants** :
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
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Objectif de la slide (2 min 30) :** Expliquer la plomberie interne sans entrer dans le code des contrôleurs.
  > - **Ce qu'est Plug :** Insister sur le fait que Plug est la spécification centrale. Contrairement à Java EE où on manipule HttpServletRequest et HttpServletResponse avec des états mutables, Phoenix regroupe tout dans une seule structure immuable : Conn.
  > - **L'avantage mental :** C'est un simple tuyau de fonctions pures. Cela rend le flux prévisible, traçable et instantanément testable sans avoir à émuler un serveur complet.

---

#### Slide 21 : Structuration Métier : Les Contextes Phoenix
- **Type de slide** : slide
- **Durée estimée** : 2 min 30
- **Titre (title-slide)** : Découplage : Le Web n'est qu'un Détail
- **Sous-titre (subtitle-slide)** : Séparer strictement le domaine métier des protocoles de transport
- **Mise en page** : grid-2
- **Contenu & Composants** :
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
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **Rôle de la slide (2 min 30) :** Montrer comment Phoenix structure une application avant de voir les contrôleurs.
  > - **Le problème résolu :** Dans beaucoup de frameworks, les modèles deviennent des fourre-tout géants. Phoenix impose dès la génération une séparation nette.
  > - **La frontière métier / web :** L'interface web (contrôleurs, vues) n'a pas le droit d'écrire directement dans la base de données : elle passe obligatoirement par un Contexte qui encapsule les règles métier.

---

#### Slide 22 : Comparaison : Phoenix face au SSR Traditionnel
- **Type de slide** : slide
- **Durée estimée** : 3 min
- **Titre (title-slide)** : Modèle de Rendu : Phoenix face à Thymeleaf
- **Sous-titre (subtitle-slide)** : De la régénération HTML complète au différentiel binaire sur socket
- **Mise en page** : grid-2
- **Contenu & Composants** :
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
- **Logos de pied de slide** :
- **Notes d'orateur (data-notes)** :
  > - **L'enjeu de la comparaison (3 min) :** Dans beaucoup de projets académiques ou d'entreprise, on utilise Spring Boot avec Thymeleaf.
  > - **Le point de blocage de Thymeleaf :** Dès qu'on veut du temps réel ou une mise à jour partielle, Thymeleaf ne suffit plus et oblige à introduire React ou Vue avec une API REST.
  > - **Comment Phoenix fait la différence :** Grâce à ses gabarits HEEx compilés, Phoenix garde l'état côté serveur et transmet uniquement les petites différences de texte. On garde la simplicité du SSR sans le surcoût d'un frontend séparé.
  > - **Passage de relais :** Maintenant que nous comprenons ce fonctionnement, nous allons pouvoir découvrir concrètement dans la partie suivante comment s'écrivent les routes, les contrôleurs et les composants interactifs.

---

#### Slide 23 : Le Routage Phoenix (Scopes, Pipelines & Live Sessions)
- **Type de slide** : slide
- **Durée estimée** : 2 min 30
- **Titre (title-slide)** : Le Routage Phoenix : Scopes, Pipelines & Live Sessions
- **Sous-titre (subtitle-slide)** : Coexistence native du Web classique, des APIs REST et des tunnels temps réel
- **Mise en page** : split-code
- **Contenu & Composants** :
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Aiguillage Réseau
    - Titre : Des flux étanches et composables
    - Liste (icon-bullet) :
      - Pipelines modulaires : `:browser` empile la gestion de session et la protection CSRF ; `:api` traite du JSON stateless pur.
      - Scopes hiérarchiques : Découpage explicite entre routes publiques, zone authentifiée et API externe `/api`.
      - Sécurisation live_session : La directive `on_mount` (`ensure_authenticated`) verrouille l'accès avant l'ouverture du canal WebSocket.
      - Vérification à la compilation : Le sigil de route vérifié `~p` élimine tout risque d'URLs cassées au runtime.
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/router.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.Router do
        use LesBonsComptesWeb, :router

        pipeline :browser do
          plug :accepts, ["html"]
          plug :fetch_session
          plug :protect_from_forgery
        end

        pipeline :api do
          plug :accepts, ["json"]
        end

        scope "/", LesBonsComptesWeb do
          pipe_through :browser

          # Pages temps réel sous tunnel WebSocket sécurisé
          live_session :authenticated_user,
            on_mount: [{LesBonsComptesWeb.UserAuth, :ensure_authenticated}] do
            live "/wallets", WalletLive.Index, :index
            live "/wallets/:id", WalletLive.Show, :show
            live "/wallets/:id/expenses/new", WalletLive.ExpenseNew, :new
          end
        end

        # API REST pour les services tiers
        scope "/api", LesBonsComptesWeb do
          pipe_through :api
          get "/wallets/:id/settlements", SettlementController, :index
        end
      end
  - **Pied de slide** : banner
    - Principe directeur : Un seul fichier pour gouverner tout le trafic : pages HTML, endpoints REST et applications LiveView.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Prise de parole (2 min 30) :** Regardons comment s'articule le routage dans notre application réelle « Les bons comptes ».
  > - **Les pipelines :** En haut, deux tuyaux distincts : `:browser` pour la navigation humaine avec gestion de session, et `:api` pour les échanges de données JSON.
  > - **La puissance de live_session :** Remarquez le bloc `live_session :authenticated_user`. Toutes nos pages de gestion (`WalletLive.Show`, `ExpenseNew`) sont protégées par le hook `ensure_authenticated` avant même d'ouvrir le WebSocket.
  > - **L'ouverture REST :** En bas, le même routeur expose aussi une API REST standard `/api/wallets/:id/settlements` pour des intégrations externes.
  > - **Transition :** Regardons maintenant comment fonctionne le contrôleur de cette API REST.

---

#### Slide 24 : Contrôleurs Standard & APIs JSON
- **Type de slide** : slide
- **Durée estimée** : 2 min 30
- **Titre (title-slide)** : Contrôleurs Standard : Fonctions Pures & Algorithmique Métier
- **Sous-titre (subtitle-slide)** : Pattern matching en signature, gestion d'erreurs et calcul des dettes
- **Mise en page** : split-code
- **Contenu & Composants** :
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Paradigme MVC Pur
    - Titre : Une transformation de données immuable
    - Liste (icon-bullet) :
      - Action = Fonction pure : L'action reçoit `(conn, params)` et renvoie une nouvelle structure `conn` transformée.
      - Pattern Matching en signature : Déstructuration immédiate des paramètres d'URL (`%{"id" => id}`).
      - Algorithmique dans le Contexte : Le contrôleur n'exécute pas de SQL, il appelle `Expenses.calculate_settlements/1`.
      - Rendu sans exception : Les cas d'erreur (`{:error, :not_found}`) sont gérés par retour de statuts HTTP propres sans crash.
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/controllers/settlement_controller.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.SettlementController do
        use LesBonsComptesWeb, :controller
        alias LesBonsComptes.{Expenses, Wallets}

        # 1. Extraction directe de l'identifiant URL
        def index(conn, %{"id" => id}) do
          case Wallets.get_wallet(id) do
            nil ->
              conn
              |> put_status(:not_found)
              |> json(%{error: "Porte-monnaie introuvable"})

            wallet ->
              settlements = Expenses.calculate_settlements(wallet)
              creditors = Expenses.calculate_creditors(wallet)

              render(conn, :index,
                wallet: wallet,
                settlements: settlements,
                creditors: creditors
              )
          end
        end
      end
  - **Pied de slide** : banner
    - Règle d'or : Zéro état persistant dans le contrôleur : f(conn, params) -> conn. Prévisible, testable et sans effets de bord.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Cas d'usage (2 min 30) :** Voici le contrôleur réel calculant les remboursements optimisés entre colocataires.
  > - **Le pattern matching imbriqué :** Admirez la lisibilité : on extrait l'identifiant, on tente de récupérer le wallet, et on calcule l'équilibrage.
  > - **Séparation des responsabilités :** Le contrôleur ne fait aucun calcul mathématique lui-même. Il sollicite le contexte métier `Expenses`.
  > - **Rendu JSON :** En cas de succès, il formate la réponse ; en cas d'erreur, il renvoie un code 404 sans jamais lever d'exception lourde.
  > - **Transition :** Ce contrôleur HTTP répond parfaitement au besoin d'une API. Mais pour notre interface utilisateur, nous voulons de la réactivité immédiate sans rechargement : c'est là qu'intervient Phoenix LiveView.

---

#### Slide 25 : Phoenix LiveView & PubSub Temps Réel
- **Type de slide** : slide
- **Durée estimée** : 3 min 30
- **Titre (title-slide)** : LiveView & PubSub : Collaboration Temps Réel Native
- **Sous-titre (subtitle-slide)** : Synchronisation instantanée entre utilisateurs sans Redis ni polling JavaScript
- **Mise en page** : split-code
- **Contenu & Composants** :
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Rupture Technologique
    - Titre : La Triade Réactive de Phoenix
    - Liste (icon-bullet) :
      - 1. Abonnement PubSub (mount/3) : À l'ouverture du WebSocket, le client s'abonne au topic `"wallet:#{id}"` sur la BEAM.
      - 2. Événement utilisateur (handle_event) : Clic sur supprimer une dépense -> mise à jour en base et diffusion instantanée.
      - 3. Réception synchrone (handle_info) : Tous les membres connectés reçoivent `{:wallet_updated, id}` et leur affichage s'actualise.
      - Diffing minimal : Seuls les quelques octets modifiés transitent sur le WebSocket (moins de 10 ms de latence).
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/live/wallet_live/show.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.WalletLive.Show do
        use LesBonsComptesWeb, :live_view
        alias LesBonsComptes.{Expenses, Wallets}

        # 1. Montage et abonnement au canal du porte-monnaie
        def mount(%{"id" => id}, _session, socket) do
          if connected?(socket) do
            Phoenix.PubSub.subscribe(LesBonsComptes.PubSub, "wallet:#{id}")
          end
          {:ok, assign(socket, wallet_id: id, wallet: Wallets.get_wallet!(id))}
        end

        # 2. Réaction à la suppression d'une dépense
        def handle_event("delete_expense", %{"id" => exp_id}, socket) do
          Expenses.delete_expense(socket.assigns.current_user, exp_id)
          {:noreply, socket |> put_flash(:info, "Dépense supprimée")}
        end

        # 3. Notification PubSub reçue par TOUS les participants
        def handle_info({:wallet_updated, wallet_id}, socket) do
          {:ok, data} = load_wallet_data(wallet_id)
          {:noreply, assign(socket, data)}
        end
      end
  - **Pied de slide** : banner
    - Révolution : Alice supprime une dépense -> l'écran de Bob ajuste ses soldes en direct sans recharger la page et sans une ligne de JS.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Le joyau technique (3 min 30) :** Voici le code réel le plus représentatif de la force de Phoenix dans notre application.
  > - **L'abonnement PubSub :** Dans `mount`, chaque participant connecté au porte-monnaie s'abonne au topic `"wallet:#{id}"`.
  > - **Le déclencheur :** Dès qu'un utilisateur clique sur supprimer une dépense, l'événement `delete_expense` est traité côté serveur.
  > - **La synchronisation collective :** Dans `handle_info`, TOUS les membres reçoivent la notification de mise à jour. LiveView recalcule le diff et pousse les nouveaux chiffres sur chaque écran.
  > - **Bilan d'infrastructure :** Pas de serveur Node.js séparé, pas de cluster Redis, pas de Redux dans le navigateur. Tout est géré par la machine virtuelle BEAM en 25 lignes.
  > - **Transition :** Faut-il alors tout coder en LiveView ? C'est ce que nous récapitulons dans la matrice suivante.

---

#### Slide 26 : Matrice Décisionnelle : REST vs Phoenix LiveView
- **Type de slide** : slide
- **Durée estimée** : 1 min 30
- **Titre (title-slide)** : Matrice Décisionnelle : Choisir l'Outil Adapté
- **Sous-titre (subtitle-slide)** : Pourquoi « Les bons comptes » combine harmonieusement contrôleurs HTTP et LiveView
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Le Modèle HTTP / REST)** : card
    - badge-gray : Contrôleurs Standard (HTTP)
    - Titre : Cas d'Usage Recommandés
    - Liste (icon-bullet) :
      - APIs REST / JSON publiques : Endpoints exposés aux tiers ou applications mobiles (`SettlementController`).
      - Cookies d'authentification : Écriture sécurisée des en-têtes HTTP de session (`UserSessionController`).
      - Webhooks externes : Réception des callbacks de passerelles de paiement (Stripe).
      - Téléchargements de fichiers : Streaming de bilans ou d'exports comptables PDF/CSV.
  - **Colonne Droite (La Révolution LiveView)** : card-featured
    - badge-solid : Phoenix LiveView (WebSocket)
    - Titre : Cas d'Usage Privilégiés
    - Liste (icon-bullet) :
      - Interfaces collaboratives : Modification partagée et temps réel de dépenses (`WalletLive.Show`).
      - Formulaires réactifs : Validation en direct à la frappe sans duplication de code front/back.
      - Tableaux de bord dynamiques : Visualisation instantanée des soldes et des dettes croisées.
      - Productivité maximale : Élimination du boilerplate d'API REST pour la majorité des vues.
  - **Pied de slide** : banner
    - Synthèse : Phoenix n'impose aucun dogme : il associe la robustesse du HTTP classique à la réactivité d'une SPA moderne.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Conclusion de mon passage (1 min 30) :** Pour résumer cette partie technique, Phoenix offre le meilleur des deux mondes.
  > - **L'équilibre dans notre projet :** Nous conservons des contrôleurs classiques pour notre API REST de règlements et pour la gestion des cookies de session.
  > - **Pour le reste :** LiveView prend en charge 90% de l'interface avec une réactivité et une économie de code incomparables.
  > - **Passage de relais vers la Démo :** Vous avez vu l'architecture et le code réel. Place maintenant à l'action : je passe la main à mon camarade pour la démonstration en direct de l'application « Les bons comptes » !

---

#### Slide 27 : Démo Livecoding
- **Type de slide** : slide
- **Durée estimée** : 5 min *(Partie 3 : Démo & TP Pratique)*
- **Titre (title-slide)** : Démo Livecoding
- **Sous-titre (subtitle-slide)** : Démonstration sur écran avec backup vidéo (Durée : 5 à 7 min)
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Session Live)** : card-featured
    - badge-solid : En Direct
    - Titre : Démonstration sur l'Écran
    - Liste (icon-bullet) :
      - Bascule immédiate sur l'écran partagé : Tout se déroule en direct dans l'éditeur et le terminal.
      - Session interactive : Démonstration pratique et observation en temps réel.
      - Validation concrète : Mise à l'épreuve des flux LiveView et de la synchronisation collaborative.
  - **Colonne Droite (Filet de Sécurité)** : card
    - badge-gray : Backup Vidéo
    - Titre : Vidéo de Secours (7 min)
    - Description : Enregistrement complet chapitré, prêt à être lancé immédiatement si besoin.
    - Lecteur / Bouton d'action :
      - link-btn : `▶ Lancer la Vidéo de Secours (backup_demo.mp4)` (cible : `assets/videos/backup_demo.mp4`)
  - **Pied de slide** : banner
    - Formule clé : Place à la pratique : bascule sur l'écran pour la démonstration en direct !
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Bascule immédiate :** Quitter la présentation pour afficher le terminal et l'IDE sur l'écran principal.
  > - **Plan B (Secours) :** En cas d'aléa réseau ou machine, cliquer sur « Lancer la Vidéo de Secours » pour diffuser la vidéo de 7 minutes et continuer le commentaire en voix off.

---

#### Slide 28 : Cadrage de l'Atelier Pratique & TP (Clôture)
- **Type de slide** : slide
- **Durée estimée** : 5 min *(Partie 3 : Démo & TP Pratique)*
- **Badge section** : badge-solid : PARTIE 3 : ATELIER PRATIQUE & TP
- **Titre (title-slide)** : Atelier Pratique : Déployer et Étendre « Les Bons Comptes »
- **Sous-titre (subtitle-slide)** : 2 heures en binôme : BDD Ecto, saisie réactive et synchronisation PubSub
- **Mise en page** : grid-3
- **Contenu & Composants** :
  - **Colonne 1 (Missions Ciblées)** : card
    - badge-solid : Missions Pédagogiques (2h)
    - Titre : Focus sur la Réactivité
    - Liste (icon-bullet) :
      - Base fournie clé en main : Dépôt GitHub prêt à forker avec auth et BDD préconfigurées.
      - Exploitation BDD (Ecto) : Requêter PostgreSQL et injecter les dépenses dans les templates HEEx.
      - Ajout de données en direct : Valider à la frappe via Changeset et persister en base.
      - Synchro collective PubSub : Diffuser l'ajout en direct sans rechargement de page.
  - **Colonne 2 (L'Environnement Technique)** : card-featured
    - badge-solid : Zéro Friction
    - Titre : Stack & Outils Intégrés
    - Liste (icon-bullet) :
      - Pile 100% Dockerisée : Phoenix 1.8 + PostgreSQL 16. Aucun runtime Elixir local requis.
      - Dataset « Think HUGE » : 130+ porte-monnaies et 440+ dépenses pré-générées pour les tests.
      - Phoenix LiveDashboard : Métriques machine et introspection des processus sur `/dev/dashboard`.
      - Identifiants prêts : `admin@exemple.com` / `admin123`.
  - **Colonne 3 (Procédure de Démarrage)** : card
    - badge-gray : Terminal Rapide
    - Titre : Fork & Boot en 3 Commandes
    - Code (terminal-box) :
      ```bash
      # 1. Forker sur GitHub puis cloner
      git clone git@github.com:VOTRE-PSEUDO/les_bons_comptes.git
      cd les_bons_comptes && docker compose up -d

      # 2. Initialiser la BDD PostgreSQL et les seeds
      docker compose exec web mix ecto.setup

      # 3. Ouvrir dans le navigateur :
      # Web app       : http://localhost:4000
      # LiveDashboard : http://localhost:4000/dev/dashboard
      ```
  - **Pied de slide** : banner
    - Consigne générale : Forkez le dépôt GitHub (`IF-LGAM/les_bons_comptes`) et travaillez en binôme. L'équipe passe dans les rangs pour vous accompagner.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **0:00 - 0:45 (Lancement & Cadrage) :** « Merci. Pour clore cette soutenance et passer de la théorie à la pratique, nous vous proposons un atelier de 2 heures en binôme autour de notre application « Les Bons Comptes ». »
  > - **0:45 - 1:45 (Pas de code from scratch & Fork) :** « Rassurez-vous : nous ne vous demandons pas de réinventer la roue. Le projet est hébergé sur GitHub sous l'organisation IF-LGAM. La première consigne est simple : forkez le dépôt sur votre propre compte GitHub et clonez votre copie en local. »
  > - **1:45 - 2:45 (Environnement Zéro Friction) :** « Côté environnement, nous avons éliminé toute friction : aucun besoin d'installer Elixir, Erlang ou PostgreSQL sur votre machine. Tout tourne dans deux conteneurs Docker Compose légers. Une commande `docker compose up -d`, un `mix ecto.setup` pour charger la base, et vous êtes prêts sur `localhost:4000`. »
  > - **2:45 - 4:00 (Le Cœur Pédagogique du TP) :** « Vos missions se concentrent sur ce qui fait la force unique de Phoenix : d'abord requêter et afficher les données avec Ecto, ensuite ajouter un formulaire de saisie avec validation instantanée, et enfin brancher PubSub pour que la dépense créée sur votre machine apparaisse instantanément sur celle de votre binôme. »
  > - **4:00 - 5:00 (Top Départ & Accompagnement) :** « La base de données embarque déjà plus de 130 porte-monnaies pour éprouver la scalabilité de l'application. Les dépôts sont ouverts, les commandes sont affichées à l'écran. Bon TP à tous, nous restons disponibles dans les rangs pour vous guider ! »

---

#### Slide 29 : Quiz 1 — Paradigme de Programmation
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 1/7
- **Titre (title-slide)** : Quel paradigme de programmation est au cœur d'Elixir ?
- **Sous-titre (subtitle-slide)** : Validez votre compréhension des fondations architecturales du langage
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn-correct : Option A : Le paradigme fonctionnel
      - quiz-btn : Option B : Le paradigme orienté objet
      - quiz-btn : Option C : Le paradigme procédural
      - quiz-btn : Option D : Il est multi-paradigme
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option A (Le paradigme fonctionnel)
      - Explication : Elixir est un langage purement fonctionnel : les données y sont strictement immuables, les fonctions sont des citoyennes de premier rang sans effets de bord cachés, et les classes ou l'héritage mutable sont totalement absents au profit de modules et de structures de données pures.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Passons à notre premier quiz interactif pour valider l'ensemble des concepts abordés ! Première question : quel est le paradigme fondamental d'Elixir ? »
  > - **Résolution & Débriefing :** « C'est évidemment la réponse A. Pas d'objets, pas d'état mutable partagé : tout repose sur des fonctions pures et la transformation continue de données. »

---

#### Slide 30 : Quiz 2 — Empreinte Mémoire des Processus BEAM
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 2/7
- **Titre (title-slide)** : Quel est le poids approximatif en RAM d'un micro-processus sur la BEAM ?
- **Sous-titre (subtitle-slide)** : Mesurez la légèreté de l'unité fondamentale de concurrence d'Erlang/Elixir
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn : Option A : Environ 2 Go
      - quiz-btn : Option B : Environ 2 Mo
      - quiz-btn-correct : Option C : Environ 2 Ko
      - quiz-btn : Option D : Environ 200 Ko
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option C (Environ 2 Ko)
      - Explication : Contrairement aux threads lourds des systèmes d'exploitation (qui réservent couramment 1 à 2 Mo de mémoire), un micro-processus BEAM démarre avec seulement environ 2 Ko de mémoire vive. Cette ultra-légèreté permet d'en faire tourner des millions simultanément sur un simple ordinateur portable.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Deuxième question, essentielle pour comprendre la scalabilité de Phoenix : combien pèse un micro-processus à sa création ? »
  > - **Résolution & Débriefing :** « Réponse C : 2 Ko seulement ! C'est ce qui permet à Phoenix d'ouvrir des millions de connexions WebSocket concurrentes là où d'autres architectures saturent dès quelques milliers. »

---

#### Slide 31 : Quiz 3 — Philosophie « Let it crash » & Supervision
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 3/7
- **Titre (title-slide)** : Que signifie la philosophie « Let it crash » ?
- **Sous-titre (subtitle-slide)** : Décryptez le secret de la haute disponibilité et de la tolérance aux pannes
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn-correct : Option A : Le processus meurt et est réinitialisé proprement
      - quiz-btn : Option B : Le système ralentit pour éviter les plantages
      - quiz-btn : Option C : Il faut redémarrer tout le serveur manuellement
      - quiz-btn : Option D : Il faut ignorer complètement les erreurs
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option A (Le processus meurt et est réinitialisé proprement)
      - Explication : En Elixir, on n'essaie pas d'entourer tout le code de blocs défensifs try/catch. Grâce à l'isolation totale des processus et aux superviseurs (Supervisors), un processus rencontrant une anomalie meurt immédiatement sans polluer la mémoire des autres, et son superviseur le recrée instantanément dans un état sain connu.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Troisième question sur la devise la plus célèbre de l'écosystème Erlang/Elixir : « Let it crash » ! »
  > - **Résolution & Débriefing :** « Réponse A : plutôt que de masquer un état corrompu, on laisse le micro-processus mourir pour que l'arbre de supervision le redémarre instantanément dans un état propre. C'est l'autoguérison native. »

---

#### Slide 32 : Quiz 4 — Le Modèle Plug & Pipeline Web
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 4/7
- **Titre (title-slide)** : Qu'est-ce qu'un Plug dans Elixir ?
- **Sous-titre (subtitle-slide)** : L'abstraction pivot pour concevoir des applications et des pipelines web
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn : Option A : Un outil surprise qui nous servira plus tard
      - quiz-btn : Option B : Un micro-processus BEAM dédié à chaque utilisateur connecté
      - quiz-btn : Option C : Un modèle de base de données contenant les règles métier
      - quiz-btn-correct : Option D : L'équivalent d'une Servlet HTTP en Java
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option D (L'équivalent d'une Servlet HTTP en Java)
      - Explication : Plug est la spécification formelle et l'abstraction centrale du web en Elixir (comparable aux Servlets Java ou aux middlewares Rack). Un Plug reçoit la structure de connexion `%Plug.Conn{}` en entrée et applique une transformation pure pour produire la réponse HTTP au travers d'un pipeline composable.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Quatrième question : nous avons vu le composant Plug lors de l'étude de Phoenix. Quelle est sa nature exacte ? »
  > - **Résolution & Débriefing :** « Réponse D : c'est l'équivalent direct des Servlets en Java ou des middlewares. Tout le web Phoenix est un pipeline de Plugs pures recevant et transformant une structure Conn. »

---

#### Slide 33 : Quiz 5 — Rôle des Contexts dans Phoenix
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 5/7
- **Titre (title-slide)** : À quoi servent les « Contexts » dans l'architecture Phoenix ?
- **Sous-titre (subtitle-slide)** : Structuration architecturale et découplage entre métier et couches web
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn : Option A : À créer des animations en temps réel
      - quiz-btn : Option B : À compiler le framework plus rapidement
      - quiz-btn-correct : Option C : À séparer le métier de l'interface web
      - quiz-btn : Option D : À gérer la sécurité du protocole HTTP
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option C (À séparer le métier de l'interface web)
      - Explication : Les Contexts sont des modules Elixir dédiés qui définissent les frontières et l'API publique de votre logique métier. Ils encapsulent la persistance (Ecto) et isolent strictement les règles métier des couches d'acheminement et de présentation (contrôleurs web, LiveView, API JSON).
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Cinquième question sur l'organisation interne de Phoenix : quel est le rôle d'un Context ? »
  > - **Résolution & Débriefing :** « Réponse C : les Contexts incarnent le principe « le web n'est qu'un détail ». Ils isolent la logique métier des contrôleurs et des sockets pour garder une architecture propre et pérenne. »

---

#### Slide 34 : Quiz 6 — Communication Concurrente & Modèle d'Acteurs
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 6/7
- **Titre (title-slide)** : Comment deux processus communiquent-ils entre eux ?
- **Sous-titre (subtitle-slide)** : L'application stricte du modèle d'acteurs sans verrous ni mémoire partagée
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn : Option A : Par des systèmes de verrous (mutex)
      - quiz-btn : Option B : Par des pointeurs mémoire partagés
      - quiz-btn : Option C : Par des bases de données externes
      - quiz-btn-correct : Option D : Par échange de messages asynchrones
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option D (Par échange de messages asynchrones)
      - Explication : Sur la BEAM, chaque processus possède son propre tas mémoire privé et étanche. Les processus ne partagent jamais d'adresse mémoire : ils communiquent exclusivement par passage de messages asynchrones déposés dans la boîte aux lettres (mailbox) du destinataire, éliminant totalement les verrous, conditions de course et blocages mutuels.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Sixième question sur la concurrence : comment s'échangent les données entre deux processus isolés ? »
  > - **Résolution & Débriefing :** « Réponse D : par échange de messages asynchrones. C'est l'essence même du modèle d'acteurs, qui garantit l'absence totale de verrous (locks) et de bugs de concurrence. »

---

#### Slide 35 : Quiz 7 — L'Opérateur de Match (=)
- **Type de slide** : slide
- **Durée estimée** : 1 min *(Partie 4 : Quiz & Validation des Connaissances)*
- **Badge section** : badge-solid : QUIZ & VALIDATION — QUESTION 7/7
- **Titre (title-slide)** : Que fait réellement le signe = en Elixir ?
- **Sous-titre (subtitle-slide)** : La syntaxe la plus fondamentale et polyvalente du langage
- **Mise en page** : standard
- **Contenu & Composants** :
  - **Module d'évaluation** : quiz
    - **Grille de sélection (grid-2)** :
      - quiz-btn : Option A : Il vérifie l'égalité stricte des types
      - quiz-btn : Option B : Il crée un pointeur vers la donnée
      - quiz-btn : Option C : Il assigne strictement une valeur
      - quiz-btn-correct : Option D : Il effectue un filtrage par motif
    - **Zone d'explication révélée au clic** : quiz-feedback
      - Titre statut : ✔ Bonne réponse : Option D (Il effectue un filtrage par motif)
      - Explication : En Elixir, le symbole `=` n'est pas une simple affectation, mais l'opérateur de filtrage par motif (Pattern Matching). Il vérifie la concordance des structures à gauche et à droite, valide la forme des données et extrait/lie directement les variables internes en cas de correspondance.
  - **Pied de slide** : banner
    - Formule clé : Cliquez sur une option pour valider votre réponse en direct et afficher l'explication détaillée.
- **Logos de pied de slide** :
  - `bottom-left logo-lg` : `assets/logos/faculte.svg`
- **Notes d'orateur (data-notes)** :
  > - **Animation de la question (1 min) :** « Dernière question pour clore ce quiz : que représente réellement le signe = en Elixir ? »
  > - **Résolution & Débriefing :** « Réponse D : le filtrage par motif (Pattern Matching). C'est la pierre angulaire de tout le code Elixir, de la déstructuration de tuples à la gestion des erreurs. Bravo à tous ! »