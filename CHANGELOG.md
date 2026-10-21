# Journal des Modifications (Changelog)

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.1.0] - 2026-10-21

### 🚀 Nouveautés majeures

#### 1. Inspecteur & Styliseur Visuel de Composants en direct (Touche `I`)
- **Inspection et sélection universelle** : Possibilité de cliquer sur n'importe quel élément d'une diapositive (titres hero, en-têtes, paragraphes, cartes `.x-card`, badges, citations, puces coches) pour le personnaliser visuellement en temps réel.
- **Support des éléments vectoriels SVG** : Sélection et coloration ciblée des tracés et têtes de flèches des diagrammes de cycle vertueux (`.cycle-track-line`, `.cycle-arrow-head`).
- **Moteur de survol ultra-fluide (60 FPS)** : Remplacement de l'observation DOM lourde par une règle CSS pure exploitant le pseudo-sélecteur `:has(*:hover)` ciblant uniquement l'élément terminal survolé.
- **Palette libre & Nuancier personnalisé** :
  - Palette officielle du Design System en un clic.
  - Sélecteur de couleurs libre (pipette native du système ou saisie de code `#HEX`).
  - Section dynamique **« Mes nuances »** permettant de sauvegarder, réutiliser ou purger ses couleurs favorites.
- **Formes géométriques & Arrondis de bordures** :
  - 4 presets instantanés : *Carré* (`0px`), *Léger* (`6px`), *Arrondi* (`14px`), *Pilule* (`999px`).
  - Curseur de précision fin de `0` à `48px`.
  - Style de bordure configurable (Aucune, Fine, Moyenne, Épaisse, Tirets, Pointillés).
  - Découplage strict évitant toute mutation accidentelle de la disposition flex interne des conteneurs (`.cycle-core`, `.x-card`, etc.).
- **Padding interactif & Alignement typographique strict** :
  - Curseur d'espacement interne (0 à 24px) avec 5 presets (*0*, *Fin*, *Moyen*, *Aéré*, *Large*).
  - Intégration d'un padding natif compact compensé par une marge négative dans le CSS de base (`3px 12px; margin-left: -12px`) garantissant un alignement horizontal pixel-perfect des textes entre les diapositives par défaut et les diapositives personnalisées.
- **Persistance automatique & Export instantané** :
  - Tous les styles personnalisés sont sauvegardés localement dans le navigateur (`localStorage`) : l'utilisateur conserve ses personnalisations même en rafraîchissant la page sans avoir à modifier le fichier HTML source.
  - Bouton **Copier style inline** (`style="..."`) prêt à coller dans son template.
  - Bouton **Copier bloc HTML** pour exporter l'élément complet avec ses attributs et contenus.
  - Bouton **Réinitialiser** ciblé avec nettoyage propre (préservant les tracés SVG sans artefact de fond noir).

#### 2. Gestion de Marque, Favicon d'Onglet & Logo d'Entête
- **Suppression du globe gris vide du navigateur** : Remplacement de l'icône générique d'onglet par un favicon vectoriel SVG haute résolution (`assets/favicon.svg` et `assets/logo.svg`).
- **Injection automatique** : Le moteur `deck-dom.js` injecte automatiquement le favicon s'il est absent du document, garantissant une présentation professionnelle immédiate.
- **Transmission à la Console Présentateur** : La fenêtre orateur dual-screen (`speaker.js`) hérite automatiquement du même logo d'onglet.
- **Support des attributs `data-logo` et `data-favicon`** :
  - `data-logo="chemin/ou/emoji"` sur `.deck-container` habille simultanément l'onglet du navigateur et l'en-tête de la diapositive (à côté du titre brand).
  - `data-favicon="chemin"` permet de spécifier une icône d'onglet distincte.

#### 3. Outillage CLI & Documentation
- **Contrôle Qualité dans `npm run validate`** : Ajout de la vérification de la présence du logo/favicon d'onglet dans l'analyseur de conformité.
- **Génération assistée par IA enrichie** : Le prompt d'assemblage (`npm run prompt`, `npm run copy`) intègre désormais la règle d'intégration du favicon et des métadonnées de marque.
- **Documentation exhaustive** : Mise à jour complète de `README.md` et de `CONSIGNES_TEMPLATE.md` avec toutes les nouvelles fonctionnalités.

---

## [1.0.0] - 2026-10-21

### 🌟 Version Initiale (MVP)

- **Moteur autonome zéro-dépendance** : Fonctionne nativement dans tout navigateur moderne (Chrome, Safari, Firefox, Edge) sans serveur ni bundler (compatible `file://`).
- **Cockpit Markdown (`CONSIGNES_TEMPLATE.md`)** : Rédaction du contenu en Markdown pur, découplé à 100% du code HTML.
- **Dictionnaire de Composants visuels (`COMPOSANTS_DICTIONNAIRE.md`)** : Grilles modulables (2, 3, 4 colonnes), cartes standard, métriques et synthèses, steppers horizontaux, timelines verticales, cycles vertueux vectoriels, tableaux comparatifs zébrés, blocs de code Prism.js, terminaux cliquables, diagrammes Mermaid.js et quiz QCM interactifs avec validation dynamique.
- **Présentation Démo Vitrine (`template_presentation.html`)** : Diaporama complet de 11 slides démontrant l'intégralité des composants.
- **Console Présentateur Dual-Screen (`speaker.js`)** :
  - Synchronisation temps réel via `BroadcastChannel` (avec fallback `localStorage`).
  - **Pacing Tracker** avec calcul du rythme théorique, chronomètre et jauges colorées (Dans les temps, Léger retard, Retard critique, En avance).
  - Vue slide suivante (*Next Slide*), aperçu filigrane des fragments et contrôle de taille de police des notes (`A+` / `A-`).
- **Tiroir de notes rapide écran unique** (Touche `N`).
- **Recherche plein texte instantanée Spotlight** (Touches `Cmd+K` / `Ctrl+K` / `/`).
- **Planche contact miniature Overview** (Touches `O` / `Échap`).
- **Pointeur laser virtuel** (Touche `L`) et masquage d'écran Blackout/Whiteout (Touches `B` / `W`).
- **Zoom interactif plein écran** sur les cartes et blocs de code au clic.
- **Auto-ajustement d'échelle adaptatif (Zero Overflow)** via `deck-fit.js`.
- **7 Thèmes graphiques en rotation** (Touche `T`) : Midnight Charcoal, Clean Slate, Polar Frost, Neon Matrix, Deep Forest, Corporate Navy, Editorial Warm.
- **Sélecteur de couleur d'accentuation en direct** (Touche `C`).
- **Export PDF 16:9 haute fidélité** (Touche `P`) via `@media print` paysage strict.
- **Suite d'outillage CLI** : validation de conformité (`npm run validate`), assemblage de prompt IA (`npm run prompt`, `npm run copy`) et déploiement CI/CD automatique vers GitHub Pages.
