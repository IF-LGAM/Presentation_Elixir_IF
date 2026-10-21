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
- **Titre de la présentation** : ⚡ Démonstrateur Deck Engine : Guide Visuel des Composants & Capacités
- **Sous-titre / Thème** : Catalogue Interactif des Modèles & Objets Prêts à l'Emploi
- **Durée totale estimée** : 40 min *(Alimente l'objectif de séance du Pacing Tracker)*
- **Public visé** : Présentateurs, Développeurs, Designers & Formateurs
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

#### Slide 1 : Couverture & Sommaire Exécutif (Hero)
- **Type de slide** : hero
- **Durée estimée** : 3 min
- **Titre (title-slide)** : ⚡ Deck Engine Showcase
- **Sous-titre (subtitle-slide)** : Le Moteur de Présentation HTML Augmenté par l'IA — Zéro Dépendance, Zéro Débordement
- **Mise en page** : hero
- **Contenu & Composants** :
  - En-tête : Badges `pill-tag.solid` ("Démonstrateur Officiel") et `pill-tag.gray` ("⏱ Durée globale : ~40 min • 11 Slides")
  - Grille centrale (`grid-3`) : 3 cartes `x-card.featured` présentant les grands axes du moteur :
    - Carte 1 : Badge "01" accentué + Titre "Mises en Page & Cartes" + Descriptif (Grilles 2 à 4 colonnes, comparatifs et blocs de synthèse)
    - Carte 2 : Badge "02" accentué + Titre "Données, Code & Schémas" + Descriptif (Tableaux de données, métriques KPI géantes, blocs Prism.js et SVG)
    - Carte 3 : Badge "03" accentué + Titre "Interactivité & Vecteurs" + Descriptif (Quizz cliquables, diagrammes Mermaid.js et console orateur)
  - Pied de hero : `summary-box` avec guide rapide des touches (<kbd>&larr;</kbd>/<kbd>&rarr;</kbd> naviguer, <kbd>S</kbd> console orateur, <kbd>O</kbd> aperçu grille, <kbd>T</kbd> thème, <kbd>P</kbd> export PDF).
- **Logos de pied de slide** :
  - `bottom-left logo-sm` : `assets/logos/elixir.svg` (Icône moteur)
  - `bottom-right logo-sm` : `assets/logos/erlang.svg` (Icône robustesse)
- **Notes d'orateur (data-notes)** :
  > • Bienvenue à cette démonstration complète du Slide Deck Engine.  
  > • Ce diaporama a un double objectif : vous montrer le rendu esthétique haut de gamme du moteur, et servir de banc d'essai exhaustif pour tous les composants décrits dans COMPOSANTS_DICTIONNAIRE.md.  
  > • Vous allez découvrir 11 diapositives calibrées, toutes animées et conçues pour être projetées sans aucun outil externe.  
  > • Appuyez sur Espace ou Flèche droite pour lancer le parcours !

---

#### Slide 2 : Comparatif & Révélation Progressive (Fragments)
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : Approches Traditionnelles vs Deck Engine
- **Sous-titre (subtitle-slide)** : Comparatif direct des paradigmes et démonstration de la révélation par étapes (Fragments)
- **Mise en page** : grid-2
- **Animation & Fragments** : Les 2 cartes comparatives ainsi que la boîte de synthèse apparaissent successivement au fil des clics (<kbd>&rarr;</kbd> ou <kbd>Espace</kbd>) grâce à la classe `fragment`.
- **Contenu & Composants** :
  - **Colonne Gauche (Le Modèle Traditionnel)** : `x-card` standard (classe `fragment`)
    - Badge : `pill-tag.gray` ("Outils Lourds & Slides Manuelles")
    - Titre : La Friction des Outils Classiques
    - Liste à puces coches (`bullet-check`) :
      - Mise en page chronophage : Des heures passées à aligner des blocs sur PowerPoint ou Keynote.
      - Rupture avec le code : Impossible d'embarquer facilement du code syntaxé ou des diagrammes texte.
      - Débordements d'écran imprévus : Mauvaise surprise selon la résolution du vidéoprojecteur de la salle.
  - **Colonne Droite (L'Approche Deck Engine)** : `x-card.featured` (classe `fragment`)
    - Badge : `pill-tag.solid` ("Paradigme Découplé & IA")
    - Titre : Automatisation & Rendu Sans Faille
    - Liste à puces coches (`bullet-check`) :
      - Rdaction pure en Markdown : L'utilisateur n'écrit que son contenu, l'IA produit le HTML final.
      - Auto-ajustement d'échelle adaptatif : Zéro débordement garanti sur n'importe quel moniteur.
      - Console orateur dual-screen : Pacing tracker et notes synchronisées en temps réel via WebSockets/BroadcastChannel.
  - **Pied de slide** : `summary-box` (classe `fragment`)
    - Icône ⚡ + Synthèse : « La séparation stricte entre le fond (Markdown) et la forme (Dictionnaire HTML) libère 100% de votre temps d'ingénierie. »
- **Notes d'orateur (data-notes)** :
  > • Observez comment les fragments permettent d'orchestrer le rythme : au premier clic, la colonne de gauche s'affiche pour poser le constat.  
  > • Au second clic, la colonne de droite apparaît pour apporter la solution avec sa bordure d'accent et sa lueur verte.  
  > • Enfin, la boîte de synthèse se dévoile pour ancrer le message clé dans l'esprit du public avant de changer de slide.

---

#### Slide 3 : Frise Chronologique Horizontale & Processus (Stepper)
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : Cycle de Production en 4 Jalons
- **Sous-titre (subtitle-slide)** : De la prise de notes brute à la diffusion en direct devant votre auditoire
- **Mise en page** : grid-1 avec stepper horizontal puis `grid-4`
- **Contenu & Composants** :
  - **Frise d'étapes (`stepper-horizontal`)** :
    - Étape 1 (`step-node.active`) : Cercle "1", Titre "1. Idéation Markdown", Descriptif "Remplissage de CONSIGNES_TEMPLATE.md"
    - Connecteur actif (`step-connector`)
    - Étape 2 (`step-node.active`) : Cercle "2", Titre "2. Compilation IA", Descriptif "Assemblage via COMPOSANTS_DICTIONNAIRE.md"
    - Connecteur actif (`step-connector`)
    - Étape 3 (`step-node.active`) : Cercle "3", Titre "3. Contrôle & Ajustement", Descriptif "Relecture locale sur presentation.html"
    - Connecteur (`step-connector`)
    - Étape 4 (`step-node`) : Cercle "4", Titre "4. Projection Direct", Descriptif "Mode plein écran F & Speaker View S"
  - **Grille de 4 piliers (`grid-4`)** :
    - Carte 1 : Chiffre "01" géant en accent + Titre "Simplicité" + Texte "Un fichier Markdown unique, lisible par tout le monde."
    - Carte 2 : Chiffre "02" géant en accent + Titre "Vitesse" + Texte "Génération complète d'un deck en moins de 60 secondes."
    - Carte 3 : Chiffre "03" géant en accent (`featured`) + Titre "Autonomie" + Texte "Fichier HTML 100% autonome, zéro serveur requis."
    - Carte 4 : Chiffre "04" géant en accent (`featured`) + Titre "Rythme" + Texte "Pacing tracker pour rester parfaitement dans les temps."
  - **Pied de slide** : `summary-box` avec constat de productivité.
- **Notes d'orateur (data-notes)** :
  > • Le composant stepper-horizontal est idéal pour illustrer des cycles de déploiement, des frises historiques ou des méthodologies projet.  
  > • Chaque jalon possède son état actif rétro-éclairé et son connecteur visuel.  
  > • En dessous, la grille grid-4 permet de décliner immédiatement les vertus ou métriques associées à chaque étape.

---

#### Slide 4 : Données Structurées, KPIs & Métriques (Data Table)
- **Type de slide** : slide
- **Durée estimée** : 3 min 30
- **Titre (title-slide)** : Benchmarks d'Impact & Indicateurs Clés
- **Sous-titre (subtitle-slide)** : Présentation de données quantitatives via tableaux zébrés et cartes de métriques géantes
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Tableau comparatif `data-table`)** :
    - Tableau avec colonnes : "Critère Technique", "Présentation Standard", "Deck Engine HTML"
    - Ligne 1 : Poids moyen du fichier / 45 Mo (PPTX lourd) / `<span class="pill-tag solid">&lt; 350 Ko</span>`
    - Ligne 2 : Temps d'assemblage / 4 à 6 heures / `<span class="pill-tag solid">3 minutes</span>`
    - Ligne 3 : Compatibilité multi-écrans / Souvent altérée / `<span class="pill-tag">Auto-fit vectoriel</span>`
    - Ligne 4 : Synchronisation orateur / Matériel additionnel / `<span class="pill-tag">WebSockets / Broadcast</span>`
  - **Colonne Droite (Cartes KPI `x-card.metric`)** : Grille 2x2
    - Carte Métrique 1 (`x-card.metric`) : `metric-value` ("x12"), Titre "Vitesse de Conception", Descriptif "Par rapport aux outils graphiques manuels"
    - Carte Métrique 2 (`x-card.metric.featured`) : `metric-value` ("-90%"), Titre "Temps de Préparation", Descriptif "Grâce à l'automatisation IA"
    - Carte Métrique 3 (`x-card.metric.featured` étendue 2 cols) : `metric-value` ("100%"), Titre "Fidélité Vectorielle & Zéro Débordement", Descriptif "Contrôlé par deck-fit.js sur chaque slide", Jauge visuelle `progress-track` avec `progress-fill` (largeur 100%)
  - **Pied de slide** : `summary-box` avec synthèse chiffrée.
- **Notes d'orateur (data-notes)** :
  > • Cette slide démontre la complémentarité entre un tableau bien structuré et des cartes métriques géantes.  
  > • Les badges pilules dans le tableau attirent l'œil sur les valeurs remarquables.  
  > • À droite, les valeurs métriques en Montserrat 900 créent un point focal fort pour les chiffres percutants.

---

#### Slide 5 : Développement, Code & Terminaux (Split-Code)
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : Coloration Syntaxique & Terminaux Annotés
- **Sous-titre (subtitle-slide)** : Blocs de code Prism.js avec coloration haute fidélité et console système avec copie en 1 clic
- **Mise en page** : split-code
- **Contenu & Composants** :
  - **Colonne Gauche (Concept & Liens d'action)** : `x-card`
    - Badge : `pill-tag.solid` ("Composant Développeur")
    - Titre : Un Environnement Dédié au Code
    - Liste `bullet-check` :
      - Coloration Prism.js intégrée : Prise en charge de Python, JavaScript, Elixir, SQL, Shell, etc.
      - Copie instantanée dans le presse-papiers avec toast de confirmation.
      - Boutons d'action : Composants `.btn-action` et `.repo-link` cliquables.
    - Rangée d'actions en bas de carte :
      - Lien bouton `btn-action` : "Voir la documentation &rarr;"
      - Lien dépôt `repo-link` : "📦 GitHub Template"
  - **Colonne Droite (Code & Terminal)** :
    - Bloc de code `code-box` contenant un extrait Python ou JavaScript élégant avec en-tête `code-header` et bouton copier.
    - Terminal console `terminal-box` avec commande d'initialisation rapide : `git clone https://github.com/votre-orga/html-slides-template.git && open presentation.html`
- **Notes d'orateur (data-notes)** :
  > • La mise en page split-code est idéale pour les soutenances techniques et les cours de programmation.  
  > • Le bloc de code à droite utilise le thème Tomorrow Dark de Prism.js avec un contraste optimal.  
  > • Le terminal en dessous invite directement l'auditeur à tester la commande sur son propre ordinateur.

---

#### Slide 6 : Architecture & Grand Schéma Système (Split-Schema)
- **Type de slide** : slide
- **Durée estimée** : 3 min 30
- **Titre (title-slide)** : Schémas d'Architecture & Flux de Données
- **Sous-titre (subtitle-slide)** : Intégration de visuels vectoriels SVG avec calibrage strict et légende descriptive
- **Mise en page** : split-schema
- **Contenu & Composants** :
  - **Colonne Gauche (Explication conceptuelle)** : `x-card.featured`
    - Badge : `pill-tag.solid` ("Architecture Modulaire")
    - Titre : Découplage Moteur & Présentation
    - Liste `bullet-check` :
      - Noyau autonome : Le script `deck.js` injecte automatiquement le bandeau supérieur, la barre de défilement et le tiroir de notes.
      - Passerelle BroadcastChannel : Synchronisation bidirectionnelle entre l'écran public et la console privée du présentateur.
      - Moteur d'auto-redimensionnement : Le fichier `deck-fit.js` mesure en continu la boîte englobante pour appliquer une échelle optimale.
  - **Colonne Droite (Grand Schéma `schema-box`)** :
    - Image d'architecture : `assets/schemas/architecture-demo.svg` avec classe `schema-img`
    - Légende normalisée : `schema-caption` ("Figure 1 : Topologie de synchronisation temps réel entre fenêtre publique et console orateur")
- **Notes d'orateur (data-notes)** :
  > • Le composant split-schema garantit que le texte explicatif et le schéma graphique restent au même niveau sans se gêner.  
  > • La classe schema-img contraint automatiquement la hauteur pour empêcher tout dépassement vertical.  
  > • Vous pouvez remplacer cette image par n'importe quel fichier SVG ou PNG exporté depuis draw.io ou Excalidraw.

---

#### Slide 7 : Cycles Vertueux & Boucles Systémiques (Virtuous Circle)
- **Type de slide** : slide
- **Durée estimée** : 3 min 30
- **Titre (title-slide)** : Modélisation Circulaire & Boucles d'Amélioration
- **Sous-titre (subtitle-slide)** : Visualisation de processus continus grâce au composant virtuous-circle
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Diagramme circulaire `virtuous-circle`)** :
    - Piste vectorielle `cycle-track` : Cercle en pointillés avec 4 flèches orientées dans le sens des aiguilles d'une montre
    - Noyau central `cycle-core` : "BOUCLE VERTUEUSE DU DECK"
    - 4 nœuds périphériques `cycle-step` avec attributs de positionnement sans chevauchement :
      - `data-pos="top"` : ✍️ 1. Rédaction Markdown
      - `data-pos="right"` : 🤖 2. Assemblage IA
      - `data-pos="bottom"` : ⚡ 3. Rendu HTML Pro
      - `data-pos="left"` : 🎯 4. Présentation Direct
  - **Colonne Droite (Détail des 4 phases)** : `x-card`
    - Badge : `pill-tag.gray` ("Dynamique Vertueuse")
    - Titre : Pourquoi une Boucle Fermée ?
    - Liste `bullet-check` :
      - Phase 1 : Concentrez-vous uniquement sur vos idées et vos arguments dans CONSIGNES_TEMPLATE.md.
      - Phase 2 : L'agent IA sélectionne les composants visuels optimaux dans le dictionnaire.
      - Phase 3 : Le navigateur projette instantanément sans temps de compilation ni outil lourd.
      - Phase 4 : La console de rythme affine vos durées orales pour la prochaine itération.
  - **Pied de slide** : `summary-box` synthétisant la boucle vertueuse.
- **Notes d'orateur (data-notes)** :
  > • Le composant virtuous-circle est une exclusivité de notre dictionnaire : il permet de schématiser des boucles de rétroaction sans outil de dessin externe.  
  > • Les 4 nœuds périphériques s'articulent autour du noyau central grâce à des coordonnées absolues fluides.  
  > • C'est un composant visuel très marquant pour expliquer des cycles Scrum, DevOps ou des boucles de rentabilité.

---

#### Slide 8 : Jalons Historiques & Frise Verticale (Timeline)
- **Type de slide** : slide
- **Durée estimée** : 3 min
- **Titre (title-slide)** : Évolution & Jalons de Conception
- **Sous-titre (subtitle-slide)** : Chronologie verticale structurée avec pastilles d'ancrage temporelles
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Timeline verticale `timeline-vertical`)** :
    - Événement 1 (`timeline-card`) :
      - Badge : `pill-tag.gray` ("V1 — Genèse")
      - Titre : Slides HTML Statiques (2023)
      - Texte : Premiers gabarits HTML/CSS bruts sans découplage ni console orateur.
    - Événement 2 (`timeline-card`) :
      - Badge : `pill-tag.gray` ("V2 — Modularité")
      - Titre : Moteur d'Auto-Fit & Pacing Tracker (2024)
      - Texte : Introduction de l'algorithme d'échelle vectorielle et de la console dual-screen synchronisée.
    - Événement 3 (`timeline-card.featured`) :
      - Badge : `pill-tag.solid` ("V3 — Maturité Actuelle")
      - Titre : Découplage Intégral & Dictionnaire IA (Aujourd'hui)
      - Texte : Génération 100% automatisée par IA, diagrammes Mermaid à chaud et 7 thèmes dynamiques.
  - **Colonne Droite (Bénéfices constatés)** : `x-card.featured`
    - Titre : Synthèse des Bénéfices
    - Liste `bullet-check` :
      - Rétrocompatibilité totale avec tous les navigateurs modernes.
      - Aucune dépendance npm à installer pour démarrer.
      - Export PDF vectoriel 16:9 sans coupure de page via raccourci <kbd>P</kbd>.
  - **Pied de slide** : `summary-box` sur la maturité de la solution.
- **Notes d'orateur (data-notes)** :
  > • La timeline verticale est parfaite pour relater l'historique d'un produit, une trajectoire de carrière ou une feuille de route trimestrielle.  
  > • Les puces lumineuses sur la ligne verticale guident naturellement la lecture de haut en bas.  
  > • À droite, nous rappelons les bénéfices tangibles atteints avec la version actuelle du moteur.

---

#### Slide 9 : Diagrammes Vectoriels Natifs Mermaid.js (Mermaid)
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : Diagrammes Vectoriels Interactifs à Chaud
- **Sous-titre (subtitle-slide)** : Génération automatique de diagrammes de séquence ou de flux sans image externe
- **Mise en page** : grid-1 avec conteneur Mermaid
- **Contenu & Composants** :
  - En-tête : Badges `pill-tag.solid` ("Mermaid.js Natif") et `pill-tag.gray` ("Rendu vectoriel adaptatif")
  - Carte `x-card` englobant le diagramme Mermaid :
    - Conteneur `<div class="mermaid">` avec syntaxe de séquence :
      ```mermaid
      sequenceDiagram
          autonumber
          actor Orateur as 🎙️ Orateur (Écran Privé)
          participant Channel as 📡 BroadcastChannel
          participant Public as 📺 Écran Public (Vidéoprojecteur)
          participant Fit as 📐 deck-fit.js

          Orateur->>Channel: Touche Flèche Droite (Next Slide)
          Channel-->>Public: Événement SLIDE_CHANGE {slide: 9, frag: 0}
          Public->>Fit: Mesure de la boîte englobante
          Fit-->>Public: Ajustement d'échelle vectoriel (Zero Overflow)
          Public-->>Orateur: Accusé de synchronisation et Pacing Tracker
      ```
  - **Pied de slide** : `summary-box` rappelant que le diagramme change de couleur instantanément quand on modifie la palette (<kbd>T</kbd> ou sélecteur de couleurs).
- **Notes d'orateur (data-notes)** :
  > • L'intégration de Mermaid.js transforme votre fichier HTML en outil de visualisation complet.  
  > • Aucun outil de capture d'écran n'a été utilisé ici : le schéma est calculé dynamiquement par le navigateur.  
  > • Si vous changez de thème (en appuyant sur T) ou de couleur d'accentuation, le diagramme se recolore automatiquement pour rester harmonieux !

---

#### Slide 10 : Évaluation & Quizz Interactif en Direct (Quiz)
- **Type de slide** : slide
- **Durée estimée** : 3 min 30
- **Titre (title-slide)** : Quizz Interactif : Validez les Acquis
- **Sous-titre (subtitle-slide)** : Module de test avec rétroaction visuelle immédiate et explication argumentée
- **Mise en page** : grid-1 avec `quiz-container`
- **Contenu & Composants** :
  - **Module de Quizz (`quiz-container`)** :
    - Question : « Comment le Deck Engine garantit-il qu'aucune slide ne déborde de l'écran lors d'une projection ? »
    - Grille des 4 options (`grid-2`) :
      - Option A : `quiz-opt-btn` (`data-correct="false"`, onclick : mauvaise réponse) : « En coupant brutalement le texte qui dépasse via overflow: hidden sans avertissement. »
      - Option B : `quiz-opt-btn` (`data-correct="true"`, onclick : bonne réponse) : « En mesurant la hauteur du contenu et en appliquant un auto-fit vectoriel centré par transform: scale. »
      - Option C : `quiz-opt-btn` (`data-correct="false"`, onclick : mauvaise réponse) : « En forçant obligatoirement l'utilisateur à installer un serveur Node.js lourd en local. »
      - Option D : `quiz-opt-btn` (`data-correct="false"`, onclick : mauvaise réponse) : « En limitant chaque slide à 10 mots au maximum de manière arbitraire. »
    - Zone d'explication révélée (`quiz-explanation-box`) :
      - Message de succès vert émeraude avec explication détaillée de l'algorithme `deck-fit.js` et du respect des ratios 16:9.
  - **Pied de slide** : `summary-box` sur l'intérêt pédagogique des quiz en réunion ou formation.
- **Notes d'orateur (data-notes)** :
  > • Cette slide est interactive : invitez l'auditoire à voter à main levée pour les options A, B, C ou D.  
  > • Cliquez sur l'option B : la boîte passe instantanément en vert émeraude avec son badge contrasté et fait apparaître l'explication argumentée.  
  > • Si quelqu'un clique sur une mauvaise option, celle-ci devient rouge bordeaux pour clarifier l'erreur.

---

#### Slide 11 : Conclusion & Ressources (Ressources & Mémento)
- **Type de slide** : slide
- **Durée estimée** : 4 min
- **Titre (title-slide)** : À Vous de Jouer : Créez Vos Présentations !
- **Sous-titre (subtitle-slide)** : Ressources de démarrage rapide, mémento de conception et prochaines étapes
- **Mise en page** : grid-2
- **Contenu & Composants** :
  - **Colonne Gauche (Les 3 Règles Clés)** : `x-card.featured`
    - Badge : `pill-tag.solid` ("Mémento Conception")
    - Titre : Les 3 Règles d'Or
    - Liste `bullet-check` :
      - 1. Ne touchez qu'au contenu Markdown dans CONSIGNES_TEMPLATE.md.
      - 2. Spécifiez vos composants préférés en vous appuyant sur COMPOSANTS_DICTIONNAIRE.md.
      - 3. Confiez la génération à l'IA pour obtenir presentation.html en un instant.
  - **Colonne Droite (Cartes de Liens & Actions)** : 2 cartes `link-card` + bouton
    - Carte de lien 1 (`link-card`) : Titre "Dictionnaire de Composants", Descriptif "Consulter toutes les classes dans COMPOSANTS_DICTIONNAIRE.md", Flèche &rarr;
    - Carte de lien 2 (`link-card`) : Titre "Dépôt & Mises à Jour", Descriptif "Télécharger les dernières améliorations du moteur", Flèche &rarr;
    - Bouton d'action principal : `btn-action` ("Recommencer la Démonstration &rarr;") pointant vers `#slide-1`.
  - **Pied de slide** : `summary-box` de conclusion.
- **Logos de pied de slide** :
  - `bottom-left logo-sm` : `assets/logos/elixir.svg`
  - `bottom-center logo-sm framed` : `assets/logos/python.svg`
  - `bottom-right logo-sm` : `assets/logos/ruby.svg`
- **Notes d'orateur (data-notes)** :
  > • Nous voilà au terme de la démonstration du Deck Engine.  
  > • Toutes les diapositives s'adaptent automatiquement à 100% au thème actif sélectionné par l'orateur (Touche T).  
  > • Le public et l'orateur disposent maintenant de toutes les ressources et du dictionnaire pour créer leurs propres présentations sans coder.