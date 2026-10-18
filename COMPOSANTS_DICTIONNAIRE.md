# 📚 Dictionnaire des Objets & Composants HTML (Deck Engine DSL)

Ce référentiel sert de table de correspondance stricte pour l'agent de génération HTML. Chaque alias textuel ou bloc conceptuel doit être traduit par la structure HTML et les classes standardisées ci-dessous.

---

## 1. Conteneurs & Mises en Page (Layouts)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `deck` / `container` | `<div class="deck-container" data-theme="dark">` | Conteneur racine du diaporama. Définit le thème global (`dark` ou `light`). |
| `slide` | `<section class="slide">` | Conteneur racine d'une diapositive (format 16:9). Hérite automatiquement du thème global. |
| `grid-2` | `<div class="grid-2">` | Grille à 2 colonnes égales (comparatifs, problème/solution). |
| `grid-3` | `<div class="grid-3">` | Grille à 3 colonnes (triades, processus en 3 étapes). |
| `grid-4` | `<div class="grid-4">` | Grille à 4 colonnes (piliers, métriques, KPIs). |
| `split-code` | `<div class="split-code">` | Disposition 50/50 : explication conceptuelle à gauche, code à droite. |
| `hero` | `<div class="slide-hero">` | Mise en page centrée avec espacements aérés pour slide de titre. |

---

## 2. Cartes & Blocs de Contenu (Cards)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `card` | `<div class="x-card">` | Carte blanche standard avec bordure fine et padding interne. |
| `card-featured` | `<div class="x-card featured">` | Carte mise en avant (bordure vert primaire `#15803D`, fond menthe léger). |
| `card-metric` | `<div class="x-card metric">` | Carte optimisée pour afficher un grand chiffre clé et son libellé. |
| `banner` / `box-summary` | `<div class="summary-box">` | Bandeau horizontal en pied de slide pour synthèse ou citation clé. |

---

## 3. Données & Tableaux (Data Presentation)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `tab` / `table` | `<table class="data-table">` | Tableau structuré avec en-têtes contrastées et lignes zébrées. |
| `metric` / `kpi` | `<div class="metric-value">` | Affichage d'un indicateur clé en typographie géante (Montserrat 900). |
| `progress-bar` | `<div class="progress-track"><div class="progress-fill" style="width: ..."></div></div>` | Jauge visuelle de progression ou pourcentage. |

---

## 4. Frises Chronologiques & Étapes (Process & Timelines)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `stepper` / `step-bar` | `<div class="stepper-horizontal">` | Frise horizontale numérotée connectée par des lignes de liaison. |
| `step-item` | `<div class="step-node">` | Une étape unitaire (numéro dans un cercle vert + titre + descriptif). |
| `timeline` | `<div class="timeline-vertical">` | Frise verticale jalonnée avec puces temporelles et contenu aligné. |
| `timeline-event` | `<div class="timeline-card">` | Bloc jalon associé à une date ou un repère temporel. |

---

## 5. Cercles Vertueux & Diagrammes Cycliques (Loops & Cycles)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `cycle` / `loop` | `<div class="virtuous-circle">` | Diagramme circulaire représentant une boucle vertueuse à 3, 4 ou 5 nœuds. |
| `cycle-node` | `<div class="cycle-step" data-pos="...">` | Nœud unitaire du cercle positionné avec son titre et son impact. |
| `cycle-center` | `<div class="cycle-core">` | Noyau central du cycle (ex: « Sol Vivant », « Résilience »). |
| `cycle-arrow` | `<div class="cycle-connector">` | Indicateur vectoriel ou SVG de rotation continue entre les étapes. |

---

## 6. Liens, Boutons d'Action & Décharges (Links & Actions)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `link` | `<a class="text-link" href="..." target="_blank">` | Lien textuel souligné en vert avec icône de sortie externe. |
| `link-btn` | `<a class="btn-action" href="...">` | Bouton rectangulaire cliquable (fond vert émeraude, texte blanc). |
| `link-card` | `<a class="link-card" href="...">` | Carte cliquable complète (titre, description, logo ou flèche droite). |
| `link-github` | `<a class="repo-link" href="...">` | Bloc prêt à l'emploi avec icône Git/GitHub pour dépôts ou TP. |

---

## 7. Blocs de Code, Snippets & Terminaux (Developer Blocks)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `code` / `code-box` | `<pre class="code-box"><code class="language-python">` | Bloc de code formaté par Prism.js avec coloration syntaxique. |
| `code-header` | `<div class="code-header">` | Barre supérieure affichant le nom du fichier (`main.py`) et bouton « Copier ». |
| `code-tabs` | `<div class="code-tab-group">` | Onglets permettant de basculer entre plusieurs langages (Python, YAML, JSON). |
| `terminal` / `cli` | `<div class="terminal-box">` | Console système stylisée avec invite de commande (`$`) et bouton copier. |
| `inline-code` | `<code class="inline-code">` | Nom de variable, classe ou commande courte dans une phrase. |

---

## 8. Typographie & Puces Décoratives (Badges & Pills)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `badge` / `pill` | `<span class="pill-tag">` | Pastille avec fond vert menthe doux (`#DCFCE7`) et texte vert foncé. |
| `badge-solid` | `<span class="pill-tag solid">` | Pastille à fond vert émeraude plein (`#10B981`) et texte blanc. |
| `badge-gray` | `<span class="pill-tag gray">` | Pastille neutre en gris ardoise (`#E2E8F0`). |
| `icon-bullet` | `<li class="bullet-check">` | Élément de liste avec icône végétale ou coche verte stylisée. |

---

## 9. Composants d'Interactivité & Quiz

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `quiz` | `<div class="quiz-container">` | Conteneur global du module de test interactif. |
| `quiz-btn` | `<button class="quiz-opt-btn" data-correct="false">` | Option de réponse cliquable. |
| `quiz-btn-correct`| `<button class="quiz-opt-btn" data-correct="true">` | Option exacte qui déclenche le feedback positif (vert). |
| `quiz-feedback`| `<div class="quiz-explanation-box">` | Zone masquée par défaut, révélée au clic avec l'explication détaillée. |

---

## 10. Métadonnées d'Orateur & Système
 
| Alias court | Attribut / Balise | Utilisation & Description |
| :--- | :--- | :--- |
| `notes` | `data-notes="..."` ou `<aside class="speaker-notes">` | Notes d'orateur lues par le Speaker Engine (`S` ou tiroir `N`). |
| `theme-global` | `data-theme="dark\|light"` sur `.deck-container` | **Thème global du deck** (sombre par défaut ou clair). |
| `theme-slide` | `data-theme="light\|dark"` sur `.slide` | **OPTIONNEL / EXCEPTIONNEL** : surcharge ponctuelle pour une slide isolée différente du deck. |
| `title-slide` | `<h2 class="slide-title">` | Titre standardisé en Montserrat gras avec accent vert. |
| `subtitle-slide`| `<p class="slide-subtitle">` | Sous-titre explicatif en Inter ardoise moyen (`#475569`). |

---

## 11. Exemples Concrets d'Intégration HTML

### Exemple A : Frise chronologique à étapes (`stepper`)
```html
<div class="stepper-horizontal">
  <div class="step-node active">
    <div class="step-circle">1</div>
    <div class="step-title">Diagnostic Sol</div>
    <p class="step-desc">Analyse conductivité & sondes</p>
  </div>
  <div class="step-connector"></div>
  <div class="step-node">
    <div class="step-circle">2</div>
    <div class="step-title">Modulation</div>
    <p class="step-desc">Cartes d'application VRA</p>
  </div>
  <div class="step-connector"></div>
  <div class="step-node">
    <div class="step-circle">3</div>
    <div class="step-title">Régénération</div>
    <p class="step-desc">Couvert végétal & crédits C</p>
  </div>
</div>