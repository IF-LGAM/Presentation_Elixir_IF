# ⚡ HTML Slide Deck Engine

Un moteur de présentation moderne, autonome et zéro-dépendance locale, conçu pour générer des slides web au format 16:9 widescreen avec console présentateur synchronisée et export PDF haute fidélité.


 ### ⚠️ AVERTISSEMENT STRICT & RÈGLE D'OR D'ÉDITION
**NE RIEN MODIFIER DANS CONSIGNES_TEMPLATES AVANT LA SECTION SUIVANTE :**
`## 📝 3. Schéma & Contenu des Slides`
---

## 🎯 Philosophie & Fonctionnement

L'outil repose sur une séparation stricte entre le fond et la forme :
1. **`CONSIGNES_TEMPLATE.md`** : Le cahier des charges et le template de contenu. Tu ne touches qu'à la section 3. Schéma & Contenu des Slides pour renseigner tes textes, snippets de code, quiz et liens.
2. **`presentation.html`** : Le squelette autonome embarquant le moteur d'affichage, le design system, les scripts de navigation, la vue présentateur multi-écrans et les styles d'impression.

Aucun bundler, runtime Node.js ou serveur web local n'est requis : le fichier HTML s'exécute directement par un double-clic dans n'importe quel navigateur moderne (compatible protocole `file://`).

---

## ✨ Fonctionnalités Clés

- **Console Présentateur Dual-Screen (`S`)** :
  - Ouvre une seconde fenêtre dédiée pour l'orateur.
  - Synchronisation bidirectionnelle en temps réel via l'API native `BroadcastChannel` (avec fallback automatique sur `localStorage`).
  - Aperçu direct de la slide actuelle et de la slide suivante (*Next Slide*).
  - Chronomètre de séance (Play/Pause/Reset), horloge réelle et réglage dynamique de la taille des notes (`A+` / `A-`).
- **Bascule Thème Clair / Sombre (`T`)** :
  - Adaptation automatique ou bascule manuelle en un clic (mode sombre contrasté `#141414` ou mode clair épuré `#F8FAFC`).
- **Personnalisation en direct de la Couleur d'Accent (`C`)** :
  - Palette de couleurs vibrantes (Rouge Crimson, Bleu Cobalt, Vert Émeraude, Violet Cyber, Ambre, Rose Néon, Cyan) ou sélecteur libre sur mesure.
  - Persistance automatique en `localStorage`, support des paramètres URL (`?color=...`) et synchronisation instantanée avec la console présentateur.
- **Tiroir de Notes Écran Unique (`N`)** :
  - Panneau latéral rétractable pour consulter les notes de chaque slide lorsqu'aucun second écran n'est branché.
- **Vue Globale / Overview (`O` ou `Échap`)** :
  - Modal avec vue en grille de toutes les vignettes pour sauter instantanément à n'importe quelle étape du diaporama.
- **Export PDF 16:9 Haute Fidélité (`P`)** :
  - Feuille de style dédiée `@media print` calibrée en format paysage 16:9 (`16in x 9in`).
  - Strictement 1 page par slide, respect fidèle du thème clair/sombre, éléments d'interface masqués et zéro coupure de contenu.
- **Coloration Syntaxique Intégrée** :
  - Rendu de code optimisé via Prism.js (thème sombre *Tomorrow*).
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
| `→` / `Espace` / `PageDown` | Slide suivante |
| `←` / `PageUp` | Slide précédente |
| `Home` / `End` | Première / Dernière slide |
| `S` | Ouvrir la Console Présentateur (dual-screen) |
| `N` | Ouvrir/Fermer le panneau latéral de notes (écran simple) |
| `O` / `Échap` | Vue globale en grille (*Overview*) |
| `F` | Basculer en mode Plein écran (*Fullscreen*) |
| `P` | Lancer l'export PDF via la boîte d'impression navigateur |
| `?` | Afficher la fenêtre d'aide des raccourcis |

---

## 📂 Structure du Projet

```text
.
├── CONSIGNES_TEMPLATE.md          # Schéma et prompt-type pour la génération du contenu
├── template_presentation.html     # Squelette HTML épuré des slides et composants
├── src/
│   ├── css/
│   │   └── deck.css               # Design system, layout, responsive & styles print PDF
│   └── js/
│       ├── deck.js                # Moteur de navigation, raccourcis clavier & modales
│       ├── speaker.js             # Console présentateur dual-screen & synchro BroadcastChannel
│       └── interactive.js         # Widgets interactifs (Quizz cliquable, copie terminal)
└── README.md                      # Documentation du projet
```

## 🚀 Prise en Main Rapide

1. Clone ou duplique le projet :
   ```bash
   git clone git@github.com:antonindeloison/html-slides-template.git
   cd html-slides-template


## Générer la présentation HTML

Prompt dans votre agent : 

Génères une présentation HTML en te basant sur le contenu de CONSIGNES_TEMPLATE.md. 
