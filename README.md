# ⚡ HTML Slide Deck Engine (AI-Assisted)

> **Vous rédigez votre contenu en Markdown. L'IA génère une présentation HTML de classe mondiale. Vous ne touchez jamais au code.**
> 
> Un moteur de présentation autonome, zéro-dépendance et calibré pour l'impact visuel, combinant une console orateur dual-screen avec indicateur de rythme (*Pacing Tracker*), recherche instantanée, zoom interactif et export PDF haute fidélité.

---

## 💡 Le Concept : Zéro Code pour l'Utilisateur

Créer des slides percutantes dans des outils traditionnels (PowerPoint, Keynote) prend des heures de mise en page manuelle, tandis que coder des slides en HTML/CSS est fastidieux.

Ce projet résout l'équation grâce à une **séparation stricte** et un **workflow piloté par l'IA** :

- **Vous** : Vous ne touchez qu'à la section contenu de **`CONSIGNES_TEMPLATE.md`** pour décrire vos idées, vos puces, vos snippets de code et vos notes d'orateur en Markdown simple. Vous ne codez jamais.
- **Le Dictionnaire de Composants (`COMPOSANTS_DICTIONNAIRE.md`)** : Il regroupe **l'intégralité des formes et composants visuels nécessaires** pour illustrer n'importe quelle idée ou architecture sans jamais avoir à écrire de CSS :
  - *Mises en page & Grilles* : 1 à 4 colonnes (`grid-2`, `grid-3`, `grid-4`), split code/schéma, slides de garde hero.
  - *Cartes & Conteneurs* : cartes standard, mises en avant (`featured`), blocs de métriques, bandeaux de synthèse.
  - *Processus & Frises* : steppers horizontaux, timelines verticales, cycles vertueux et boucles d'itération.
  - *Données & Tableaux* : tableaux comparatifs stylisés, indicateurs KPI et jauges de progression.
  - *Code, Terminaux & Diagrammes* : blocs de code colorés (Prism.js), terminaux avec copie en 1 clic, diagrammes vectoriels Mermaid.js.
  - *Interactivité & Pédagogie* : quiz QCM interactifs avec validation dynamique et explication argumentée.
  - *Badges, Puces & Logos* : tags pilules, puces coches contrastées et logos partenaires auto-calibrés.
- **L'IA** : Elle lit vos consignes, pioche dans ce dictionnaire pour assembler les formes parfaites et génère votre fichier HTML final (`presentation.html`).
- **Le Navigateur** : Ouvrez directement votre fichier pour projeter. Zéro serveur, zéro bundler, zéro installation.

---

## ⚡ Démonstration Immédiate (Exemple Prêt à l'Emploi)

> 🌐 **Démo en ligne immédiate** : [**Tester le Slide Deck en direct sur GitHub Pages**](https://antonindeloison.github.io/html-slides-template/) *(zéro téléchargement)*

Une présentation vitrine complète de **11 diapositives** est directement fournie dans le fichier **`template_presentation.html`** !  
Elle illustre et teste concrètement l'intégralité des fonctionnalités et des formes du dictionnaire (*fragments progressifs, steppers, tableaux et indicateurs KPI, snippets de code Prism.js, schémas d'architecture SVG, cercles vertueux avec flèches vectorielles, timeline verticale, diagrammes vectoriels Mermaid.js et quiz interactif avec validation en direct*).

Lancez-la immédiatement en local par double-clic ou via votre terminal :

```bash
open template_presentation.html
# Ou avec npm : npm run demo
# Ou avec make : make demo
```

- <kbd>→</kbd> / <kbd>Espace</kbd> : Naviguer et révéler les étapes progressives (fragments).
- <kbd>F</kbd> : Activer le mode plein écran pour la projection.
- <kbd>S</kbd> : Ouvrir la **Console Présentateur Dual-Screen** synchronisée avec le Pacing Tracker.
- <kbd>O</kbd> ou <kbd>Échap</kbd> : Afficher la planche contact de toutes les diapositives (Overview).
- <kbd>T</kbd> : Tester en direct la rotation parmi les **7 ambiances visuelles**.
- <kbd>P</kbd> : Générer l'export PDF vectoriel 16:9 haute fidélité (exactement 1 page par slide).

---

## 🚀 Le Workflow en 3 Étapes

### Étape 1 : Renseigner votre contenu dans `CONSIGNES_TEMPLATE.md`
Ouvrez le fichier [CONSIGNES_TEMPLATE.md](CONSIGNES_TEMPLATE.md) et remplissez la section **3. Plan de Présentation & Contenu** avec vos propres informations :
- Sujet et durée totale prévue (ex: 45 min).
- Pour chaque slide : titre, sous-titre, durée estimée, points clés, cartes, quiz ou diagrammes souhaités.
- Vos notes d'orateur détaillées (`Notes présentateur`).

> ℹ️ *Vous n'avez besoin d'aucune connaissance en HTML, CSS ou JavaScript. Rédigez simplement en texte brut avec la syntaxe Markdown.*

### Étape 2 : Demander à l'IA d'exécuter la génération
Fournissez `CONSIGNES_TEMPLATE.md` à votre assistant IA préféré (*Claude 3.7 / 3.5 Sonnet, ChatGPT 4o / o1, Gemini 2.5 Flash / Pro, Cursor, Copilot, etc.*) avec la consigne suivante :

```text
Génère ou mets à jour le fichier presentation.html en appliquant 
scrupuleusement les consignes et le plan définis dans CONSIGNES_TEMPLATE.md 
et en instanciant les composants du fichier COMPOSANTS_DICTIONNAIRE.md.
```

L'IA prend en charge l'écriture complète du HTML : sélection des mises en page adaptées, formatage du code, création des diagrammes vectoriels Mermaid, intégration des fragments et des notes orateur.

### Étape 3 : Projeter et présenter
Ouvrez simplement le fichier généré dans votre navigateur web (*Chrome, Edge, Safari, Firefox*), soit par double-clic, soit directement depuis votre terminal :

```bash
open presentation.html
# Ou sous Linux : xdg-open presentation.html
# Ou sous Windows : start presentation.html
```

- Appuyez sur <kbd>F</kbd> pour passer en mode Plein écran sur le vidéoprojecteur.
- Appuyez sur <kbd>S</kbd> pour ouvrir la **Console Orateur** synchronisée sur votre écran d'ordinateur portable.

---

## 🖥️ Ce que le Moteur Génère Automatiquement

Quand l'IA compile votre plan Markdown, elle produit un diaporama riche doté de toutes les fonctionnalités modernes :

### 1. 🎯 Rythme de Présentation & Attention de l'Auditoire
- **Révélation progressive par étapes (`class="fragment"`)** : Vos cartes, listes à puces et jalons chronologiques apparaissent un par un avec un fondu fluide lors de l'appui sur <kbd>→</kbd> ou <kbd>Espace</kbd>.
- **Mode Masquage d'Écran — Blackout & Whiteout (<kbd>B</kbd> / <kbd>W</kbd>)** : Coupez la lumière du vidéoprojecteur en noir (<kbd>B</kbd> ou <kbd>.</kbd>) ou en blanc (<kbd>W</kbd>) d'une simple touche pour ramener 100% de l'attention de la salle sur votre explication orale.
- **Pointeur Laser Virtuel (<kbd>L</kbd>)** : Un faisceau lumineux rouge rubis avec halo et onde de choc animée au clic pour guider le regard de l'audience sans matériel additionnel.
- **Zoom Interactif Plein Écran (*Click to Zoom*)** : Cliquez sur n'importe quel schéma, extrait de code ou carte pour l'afficher instantanément en grand format centré sur fond flou.

### 2. ⏱️ Console Présentateur Dual-Screen & Pacing Tracker (<kbd>S</kbd>)
- **Deuxième fenêtre synchronisée en temps réel** via l'API native `BroadcastChannel` (avec secours automatique sur `localStorage`).
- **Indicateur de Rythme (*Pacing Tracker*) en direct** : En fonction de la durée totale de votre session, la console calcule la durée théorique idéale et affiche une jauge comparative :
  - 🟢 **Dans les temps** : Rythme équilibré.
  - 🟡 **Léger retard** : Invite discrète à synthétiser.
  - 🔴 **Retard critique** : Alerte de dépassement.
  - 🔵 **En avance** : Marge pour approfondir ou prendre des questions.
- **Vue Slide Suivante (*Next Slide*)** et gestion dynamique de la taille du texte des notes (`A+` / `A-`).
- **Tiroir de Notes Écran Unique (<kbd>N</kbd>)** : Pour répéter ou présenter sans moniteur secondaire.

### 3. 🔍 Navigation & Découverte Pendant le Direct
- **Recherche Plein Texte Instantanée (<kbd>Cmd + K</kbd> / <kbd>Ctrl + K</kbd> / <kbd>/</kbd>)** : Palette de commande flottante façon Spotlight pour chercher par mot-clé dans les titres, textes et notes, avec navigation au clavier et saut immédiat.
- **Vue Globale des Slides en Grille — Overview (<kbd>O</kbd> ou <kbd>Échap</kbd>)** : Planche contact de toutes les miniatures 16:9 pour naviguer instantanément pendant la session de questions/réponses.
- **Navigation Clicker** : Clic gauche ou molette en plein écran pour faire défiler les étapes comme avec une télécommande de présentation.

### 4. 📊 Diagrammes, Code & Interactivité
- **Support Natif des Diagrammes Vectoriels Mermaid.js (`.mermaid`)** : Génération de diagrammes de séquence, de flux ou d'architecture directement à partir de syntaxe texte, sans aucun logiciel de dessin externe.
- **Coloration Syntaxique Prism.js** avec bouton de copie en 1 clic dans le presse-papiers.
- **Quiz Interactifs** avec validation visuelle dynamique et affichage de l'explication argumentée.
- **Zéro Débordement Garanti** : Le moteur `deck-fit.js` mesure chaque slide et applique un auto-ajustement d'échelle vectoriel adaptatif pour qu'aucun contenu ne déborde, quelle que soit la résolution d'écran.

### 5. 🎨 Ambiances Visuelles & Palette Personnalisable
- **7 Thèmes Complets en Rotation (<kbd>T</kbd>)** :
  - 🌑 *Midnight Charcoal* (Noir sombre par défaut)
  - ☀️ *Clean Slate* (Blanc épuré salle lumineuse)
  - ❄️ *Polar Frost* (Nordic bleu ardoise)
  - ⚡ *Neon Matrix* (Cyberpunk noir & vert néon)
  - 🌲 *Deep Forest* (Vert sombre végétal)
  - ⚓ *Corporate Navy* (Bleu institutionnel)
  - ☕ *Editorial Warm* (Sépia café & cuivre)
- **Palette d'Accentuation Dynamique (<kbd>C</kbd>)** : Changez la couleur primaire en direct via un sélecteur interactif (presets, pipette, code `#HEX`), synchronisée avec la console orateur et persistée dans le navigateur.
- **Inspecteur & Styliseur Visuel de Composants (<kbd>I</kbd>)** : Cliquez sur n'importe quel élément de la diapositive (titres, cartes, badges, citations, mais aussi tracés et flèches vectorielles SVG de cycles) pour personnaliser en direct :
  - **Couleurs** : fond, texte, bordure ou SVG (`fill` / `stroke`) via la palette du Design System ou le sélecteur libre `#HEX` avec sauvegarde de vos nuances favorites.
  - **Formes & Arrondis** : presets géométriques (*Carré*, *Léger*, *Arrondi*, *Pilule*) ou curseur fin (0 à 48px).
  - **Bordures & Espacements** : épaisseur, style de trait et padding interactif (calibré pour préserver l'alignement typographique strict sans décalage inter-slides).
  - **Persistance & Export** : vos styles restent enregistrés localement dans le navigateur (`localStorage`) pour préserver votre mise en forme sans modifier le code source, avec boutons en 1 clic pour copier le style inline (`style="..."`) ou le bloc HTML complet.
- **Logo d'Entête & Favicon d'Onglet Automatique (`data-logo` / `data-favicon`)** : Finis les onglets de navigateur affichant un globe gris vide. Le moteur injecte automatiquement un favicon vectoriel SVG net (`assets/favicon.svg`) dans l'onglet du navigateur et la console orateur, et permet d'afficher votre logo de marque dans l'entête en un seul attribut `data-logo="..."` ou balise `<link rel="icon">`.

### 6. 🖨️ Export PDF 16:9 Haute Fidélité (<kbd>P</kbd>)
- Feuille de style `@media print` calibrée en format paysage exact (`16in x 9in`).
- **1 slide = 1 page stricte**, sans coupure de paragraphe, avec révélation automatique de tous les fragments et masquage des éléments de contrôle.

---

## ⌨️ Raccourcis Clavier en Présentation

| Raccourci | Action |
| :--- | :--- |
| <kbd>→</kbd> / <kbd>Espace</kbd> / <kbd>PageDown</kbd> | Étape suivante / Révéler le fragment suivant |
| <kbd>←</kbd> / <kbd>PageUp</kbd> | Étape précédente / Masquer le fragment précédent |
| <kbd>Shift</kbd> + <kbd>→</kbd> / <kbd>Shift</kbd> + <kbd>←</kbd> | Saut direct à la slide suivante / précédente (sans fragment) |
| <kbd>Clic gauche</kbd> *(plein écran)* | Avancer à l'étape suivante (mode télécommande) |
| <kbd>Molette</kbd> *(plein écran)* | Navigation rapide |
| <kbd>F</kbd> | Activer / Désactiver le Plein écran (*Fullscreen*) |
| <kbd>S</kbd> | Ouvrir la Console Présentateur (dual-screen) |
| <kbd>N</kbd> | Ouvrir / Fermer le tiroir latéral de notes (écran simple) |
| <kbd>Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>/</kbd> | Ouvrir la recherche plein texte instantanée (*Spotlight*) |
| <kbd>O</kbd> / <kbd>Échap</kbd> | Vue d'ensemble en grille de miniatures (*Overview*) |
| <kbd>T</kbd> | Changer d'ambiance visuelle (parmi les 7 thèmes) |
| <kbd>C</kbd> | Changer la couleur d'accentuation globale |
| <kbd>I</kbd> | **Inspecter & Styliser un composant** (couleurs, bordure, forme, padding, SVG) |
| <kbd>L</kbd> | Activer / Désactiver le Pointeur Laser Virtuel |
| <kbd>B</kbd> / <kbd>.</kbd> | Masquer l'écran en noir (*Blackout*) |
| <kbd>W</kbd> | Masquer l'écran en blanc (*Whiteout*) |
| <kbd>Clic sur carte/code</kbd> | Agrandir en plein écran (*Click to Zoom*) |
| <kbd>P</kbd> | Lancer l'export PDF haute définition |
| <kbd>?</kbd> | Afficher l'aide des raccourcis |

---

---

## 🛠️ Outillage CLI & Automatisation (Optionnel)

Pour les développeurs qui aiment piloter leurs projets depuis le terminal, des commandes sans dépendances externes sont disponibles (via `npm` ou `make`) :

| Commande `npm` | Commande `make` | Description |
| :--- | :--- | :--- |
| `npm run demo` | `make demo` | Ouvre instantanément la présentation vitrine dans votre navigateur |
| `npm run copy` | `make copy` | Assemble le prompt complet et le copie directement dans votre presse-papiers |
| `npm run prompt` | `make prompt` | Affiche dans le terminal le prompt complet prêt à coller dans ChatGPT / Claude / Gemini |
| `npm run validate` | `make validate` | Lance l'analyseur de conformité sur `template_presentation.html` |
| `npm run validate:pres` | — | Valide la conformité de votre fichier généré `presentation.html` |
| `npm run generate` | `make generate` | *(Optionnel)* Déclenche la génération automatique via API LLM (si `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` ou `GEMINI_API_KEY` est configurée) |

---

## 📂 Organisation du Dépôt

```text
.
├── index.html                     # 🌐 Point d'entrée GitHub Pages (redirection automatique)
├── CONSIGNES_TEMPLATE.md          # ✍️ VOTRE COCKPIT : Cahier des charges & contenu Markdown à remplir
├── COMPOSANTS_DICTIONNAIRE.md     # 📚 LE DICTIONNAIRE : Référentiel des composants pour l'IA
├── template_presentation.html     # 🌟 LA VITRINE : Présentation exemple complète prête à lancer
├── assets/                        # 🎨 Médias vectoriels (logos SVG, favicons et schémas d'architecture)
│   ├── favicon.svg                # ⚡ Favicon vectoriel haute résolution (onglet du navigateur)
│   ├── logo.svg                   # ⚡ Logo principal du diaporama
│   ├── logos/                     # Logos partenaires & technologies
│   └── schemas/                   # Schémas d'architecture vectoriels
├── scripts/                       # 🛠️ Scripts utilitaires autonomes (générateur & validateur)
│   └── generate.mjs               # CLI autonome (zéro dépendance)
├── package.json                   # Définition des scripts npm (demo, copy, prompt, validate)
├── Makefile                       # Raccourcis make (make demo, make validate, etc.)
├── .nojekyll                      # Désactivation de Jekyll pour GitHub Pages
├── .github/workflows/             # Déploiement CI/CD
│   └── deploy-pages.yml           # Déploiement automatique vers GitHub Pages
├── src/
│   ├── css/                       # Design system modulaire (thèmes, cartes, modales, print, styler)
│   │   ├── deck.css               # Point d'entrée CSS principal
│   │   ├── variables.css          # Design tokens & 7 thèmes
│   │   ├── components.css         # Styles des cartes, quiz, frises et Mermaid
│   │   ├── modals.css             # Modales (Recherche Spotlight, Zoom, Overview)
│   │   ├── styler.css             # Interface & panneau flottant du styliseur de composants
│   │   └── print.css              # Calibrage PDF 16:9 paysage
│   └── js/                        # Moteur autonome du diaporama (zéro runtime externe)
│       ├── deck.js                # Orchestrateur maître
│       ├── deck-dom.js            # Injection dynamique de l'interface
│       ├── deck-fit.js            # Auto-ajustement d'échelle anti-débordement
│       ├── deck-navigation.js     # Moteur de navigation & raccourcis clavier
│       ├── deck-styler.js         # Inspecteur visuel, sélecteur de couleurs, formes & persistance
│       ├── speaker.js             # Console orateur dual-screen & Pacing Tracker
│       └── interactive.js         # Fragments, laser, blackout, zoom et Mermaid
├── CHANGELOG.md                   # 📝 Historique des versions et notes de release
├── LICENSE.md                     # 📄 Licence open-source MIT
└── README.md                      # Documentation centrale du projet
```

---

## 📝 Historique des Versions

Consultez le fichier [CHANGELOG.md](CHANGELOG.md) pour le détail complet des nouveautés et correctifs de chaque version.

---

## 📄 Licence

Ce projet est distribué sous licence [MIT](LICENSE.md). Libre d'utilisation pour vos présentations académiques, soutenances, conférences et réunions professionnelles.