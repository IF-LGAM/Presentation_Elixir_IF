# ⚡ HTML Slide Deck Engine

Un moteur de présentation moderne, autonome et zéro-dépendance locale, conçu pour générer des slides web au format 16:9 widescreen avec console présentateur synchronisée et export PDF haute fidélité.

---

## 🎯 Philosophie & Fonctionnement

L'outil repose sur une séparation stricte entre le fond et la forme :
1. **`CONSIGNES_TEMPLATE.md`** : Le cahier des charges et le template de contenu. Tu ne touches qu'à la section contenu pour renseigner tes textes, snippets de code, quiz et liens.
2. **`presentation.html`** : Le squelette autonome embarquant le moteur d'affichage, le design system, les scripts de navigation, la vue présentateur multi-écrans et les styles d'impression.

Aucun bundler, runtime Node.js ou serveur web local n'est requis : le fichier HTML s'exécute directement par un double-clic dans n'importe quel navigateur moderne (compatible protocole `file://`).

---

## ✨ Fonctionnalités Clés

- **Révélation Progressive & Fragments (`class="fragment"`)** :
  - Découpage et cadence dynamique de vos contenus (cartes, puces, jalons, blocs de code).
  - Apparition étape par étape via `→` ou `Espace` ; saut direct sans fragment via `Shift + →`.
  - Aperçu prévisionnel dans la console présentateur (opacité 35% avant révélation) et révélation totale automatique lors de l'export PDF.
- **Console Présentateur Dual-Screen (`S`) & Pacing Tracker** :
  - Ouvre une seconde fenêtre dédiée pour l'orateur.
  - Synchronisation bidirectionnelle en temps réel via l'API native `BroadcastChannel` (avec fallback automatique sur `localStorage`).
  - Aperçu direct de la slide actuelle et de la slide suivante (*Next Slide*).
  - **Indicateur de Rythme (*Pacing Tracker*) en direct** : calcul automatique du temps cible par slide, minuteur unitaire de diapositive, jauge comparative double (Temps écoulé vs Slides franchies), temps restant et badge de statut dynamique (🟢 *Dans les temps*, 🟡 *Accélérer*, 🔴 *Retard*, 🔵 *En avance*).
  - Chronomètre de séance (Play/Pause/Reset), sélecteur d'objectif (15 à 120 min), horloge réelle et réglage dynamique de la taille des notes (`A+` / `A-`).
- **Catalogue des 7 Ambiances Visuelles (`T`)** :
  - Menu popover interactif ou raccourci clavier `T` pour alterner séquentiellement entre 7 thèmes complets :
    1. **Midnight Charcoal** (Défaut sombre contrasté `#141414`)
    2. **Clean Slate** (Clair épuré papier & bureau `#F8FAFC`)
    3. **Polar Frost** (Nordic bleu ardoise glacial `#0F172A`)
    4. **Neon Matrix** (Cyberpunk noir profond & vert fluo `#07090E`)
    5. **Deep Forest** (Emerald vert végétal sombre `#06150F`)
    6. **Corporate Navy** (Bleu marine institutionnel `#080E1E`)
    7. **Editorial Warm** (Sepia café & cuivre chaud `#191614`)
  - Synchronisation temps réel avec la console présentateur et persistance automatique.
- **Personnalisation en direct de la Couleur d'Accent (`C`)** :
  - Palette de couleurs vibrantes ou ajout libre au format hexadécimal `#HEX` avec sauvegarde dans "Mes couleurs".
  - Persistance automatique en `localStorage`, support des paramètres URL (`?color=...`) et synchronisation instantanée avec la console présentateur.
- **Tiroir de Notes Écran Unique (`N`)** :
  - Panneau latéral rétractable pour consulter les notes de chaque slide lorsqu'aucun second écran n'est branché.
- **Vue Globale / Overview (`O` ou `Échap`)** :
  - Modal avec vue en grille de toutes les vignettes pour sauter instantanément à n'importe quelle étape du diaporama.
- **Export PDF 16:9 Haute Fidélité (`P`)** :
  - Feuille de style dédiée `@media print` calibrée en format paysage 16:9 (`16in x 9in`).
  - Strictement 1 page par slide, respect fidèle du thème clair/sombre, éléments d'interface masqués et zéro coupure de contenu.
- **Pointeur Laser Virtuel Haute Visibilité (`L`)** :
  - Active un pointeur laser lumineux rouge rubis avec halo de diffusion et onde de choc animée au clic pour guider le regard de l'audience.
  - Masque automatiquement le curseur flèche natif du système pour un rendu fluide et professionnel lors des présentations et captures d'écran.
- **Mode Masquage d'Écran — Blackout & Whiteout (`B` / `W`)** :
  - Masque instantanément l'écran de projection en noir complet (`B` ou `.`) ou en blanc pur (`W`) pour couper la lumière du vidéoprojecteur et recentrer 100% de l'attention de l'auditoire sur l'orateur.
  - Pilotable au clavier, via le bouton dédié dans le header, ou directement à distance depuis la console présentateur (dual-screen). Un simple clic ou n'importe quelle touche de navigation rétablit l'affichage normal.
- **Palette de Recherche Plein Texte Instantanée (`Cmd + K` / `Ctrl + K` / `/`)** :
  - Palette de commande flottante façon Spotlight/Raycast permettant de chercher instantanément dans les titres, sous-titres, contenus textuels et notes d'orateur de toutes les diapositives.
  - Surlignage dynamique des termes trouvés, navigation intégrale au clavier (`↑` / `↓` et `Entrée`) et saut immédiat vers la diapositive sélectionnée.
- **Coloration Syntaxique Intégrée** :
  - Rendu de code optimisé via Prism.js (thème sombre *Tomorrow*).
- **Support Natif des Diagrammes Vectoriels Mermaid.js (`.mermaid`)** :
  - Écriture directe de code Mermaid dans le HTML (`sequenceDiagram`, `flowchart`, `classDiagram`, `stateDiagram`...).
  - Chargement à chaud et à la demande (CDN zéro overhead si aucun diagramme n'est présent).
  - Rendu vectoriel SVG net s'adaptant automatiquement au thème (`dark`/`light`) et à la couleur d'accentuation en temps réel.
- **Composants Interactifs Intégrés** :
  - Disposition adaptative en grilles (`.grid-2`, `.grid-3`, `.grid-4`).
  - Module de Quiz interactif à main levée avec validation visuelle et révélation de la solution argumentée.
  - Blocs terminal avec bouton de copie en un clic dans le presse-papiers.
  - Emplacement réservé pour démonstrations vidéo ou widgets dynamiques.

---

## 🎨 Design System

Le template utilise une esthétique *Dark Mode* sobre et contrastée :
- **Fond global** : `#141414` (Noir mat profond)
- **Cartes & Conteneurs** : `#1F1F1F` (Anthracite) / `#2B2B2B` (Survol)
- **Bordures** : `1px solid #333333`
- **Accentuation Primaire** : `#E50914` (Rouge vif)
- **Validation / Succès** : `#10B981` (Vert émeraude)
- **Erreur / Alerte** : `#EF4444` (Rouge clair)
- **Typographies** :
  - Titres : *Montserrat* (Gras 800/900)
  - Corps de texte : *Inter* (400, 500, 600)
  - Code & Terminaux : *Fira Code*

---

## ⌨️ Raccourcis Clavier

| Raccourci | Action |
| :--- | :--- |
| `→` / `Espace` / `PageDown` | Slide suivante / Révéler le fragment suivant |
| `←` / `PageUp` | Slide précédente / Masquer le fragment précédent |
| `Shift + →` / `Shift + ←` | Saut direct vers slide suivante / précédente (sans fragment) |
| `Clic gauche` *(en plein écran)* | Étape suivante (style télécommande / clicker) |
| `Molette` *(en plein écran)* | Étape suivante / précédente |
| `Home` / `End` | Première / Dernière slide |
| `T` | Changer d'ambiance visuelle (parmi les 7 thèmes) |
| `C` | Changer la couleur d'accentuation (ou ouvrir la palette) |
| `S` | Ouvrir la Console Présentateur (dual-screen) |
| `N` | Ouvrir/Fermer le panneau latéral de notes (écran simple) |
| `Cmd + K` / `Ctrl + K` / `/` | Ouvrir la Palette de Recherche Plein Texte (Spotlight) |
| `O` / `Échap` | Vue globale en grille (*Overview*) |
| `F` | Basculer en mode Plein écran (*Fullscreen*) |
| `B` / `.` | Masquer l'écran en noir (*Blackout*) |
| `W` | Masquer l'écran en blanc (*Whiteout*) |
| `L` | Activer / Désactiver le Pointeur Laser Virtuel (avec onde de choc au clic) |
| `P` | Lancer l'export PDF via la boîte d'impression navigateur |
| `?` | Afficher la fenêtre d'aide des raccourcis |

---

## 📂 Structure du Projet

```text
.
├── CONSIGNES_TEMPLATE.md          # Schéma et prompt-type pour la génération du contenu
├── COMPOSANTS_DICTIONNAIRE.md     # Référentiel des balises et structures graphiques
├── template_presentation.html     # Squelette HTML épuré des slides et composants
├── presentation.html              # Exemple complet de présentation autonome (Elixir & Phoenix)
├── src/
│   ├── css/
│   │   ├── deck.css               # Point d'entrée CSS principal (@import des sous-modules)
│   │   ├── variables.css          # Design tokens, variables CSS & transitions de thème
│   │   ├── base.css               # Reset global & échelle typographique responsive
│   │   ├── layout.css             # Conteneur deck, viewport et disposition des slides 16:9
│   │   ├── chrome.css             # Header, footer, barre de progression & boutons de commande
│   │   ├── components.css         # Dictionnaire des composants (cartes, grilles, code, quizz...)
│   │   ├── modals.css             # Tiroir de notes, modales d'aide & vue grille (Overview)
│   │   ├── color-picker.css       # Palette d'accent dynamique & popover de couleur
│   │   └── print.css              # Export PDF 16:9 paysage & styles d'impression
│   └── js/
│       ├── deck.js                # Orchestrateur principal du Deck Engine
│       ├── deck-dom.js            # Injection dynamique du chrome d'interface et des modales
│       ├── deck-navigation.js     # Moteur de navigation, raccourcis clavier & BroadcastChannel
│       ├── deck-theme.js          # Gestion des thèmes Clair / Sombre & auto-détection
│       ├── deck-palette.js        # Gestionnaire de couleur d'accent (hex, pipette, presets)
│       ├── deck-overview.js       # Vue d'ensemble en grille avec aperçus miniatures 16:9
│       ├── deck-print.js          # Synchronisation des thèmes avant export PDF (Print)
│       ├── speaker.js             # Console présentateur dual-screen & synchro BroadcastChannel
│       └── interactive.js         # Widgets interactifs (Quizz cliquable, copie terminal)
└── README.md                      # Documentation du projet
```

## 🚀 Prise en Main Rapide

1. Clone ou duplique le projet :
   ```bash
   git clone git@github.com:antonindeloison/html-slides-template.git
   cd html-slides-template