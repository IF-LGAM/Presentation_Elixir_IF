# CONSIGNES : Génération de Présentation Slide Deck HTML

Génère une présentation complète au format fichier unique HTML (`presentation.html`) autonome et moderne, basée sur le moteur de template fourni.

---

## 🎨 1. Système de Design & Charte Graphique

- **Palette de base (Dark Mode contrasté)** :
  - Fond global : `#141414` (Noir mat)
  - Cartes et conteneurs : `#1F1F1F` (Anthracite de base) et `#2B2B2B` (Survol / Accentuation)
  - Bordures : `1px solid #333333`
  - Blocs de code : `#0B0B0B`
- **Couleurs d'accentuation** :
  - Couleur primaire : `#E50914` (Rouge vif)
  - Couleur secondaire / hover : `#FF2A2A`
  - Succès / validation : `#10B981` (Vert émeraude)
  - Erreur / avertissement : `#EF4444`
- **Typographie** :
  - Titres : Montserrat (gras 800/900)
  - Corps de texte : Inter (400, 500, 600)
  - Code et terminaux : Fira Code ou monospace
- **Mise en page** : Ratio 16:9 widescreen, conteneur centré (`max-width: 1240px`), paddings aérés (adaptatifs en hauteur et largeur pour éviter tout effet de bord collé), badges pills pour les métadonnées et le timing.

---

## ⚙️ 2. Spécifications Techniques & Fonctionnalités du Fichier

1. **Fichier HTML autonome** : Fonctionne directement via un simple double-clic dans le navigateur (aucune installation de serveur nécessaire, compatible `file://`).
2. **Bibliothèques externes (via CDN)** :
   - Prism.js (thème sombre `prism-tomorrow`) pour la coloration syntaxique.
   - Google Fonts (Montserrat, Inter, Fira Code).
3. **Fonctionnalités natives intégrées au Deck Engine** :
   - **Navigation fluide** : flèches `←` / `→`, touches `Espace`, `PageUp` / `PageDown`.
   - **Mode plein écran** : touche `F` ou bouton dédié.
   - **Vue globale en grille (Overview)** : touche `O` ou `Échap` avec vignettes cliquables.
   - **Export PDF haute fidélité** : touche `P` ou bouton dédié (mode paysage 16:9 strict, exactement 1 page par slide, fond sombre forcé, 0 coupure de page).
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
