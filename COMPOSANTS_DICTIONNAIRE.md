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
| `split-schema` | `<div class="split-schema">` | Disposition 50/50 : explications conceptuelles à gauche, grand schéma ou architecture à droite. |
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

## 10. Schémas, Figures & Médias (Diagrams & Images)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `schema` / `diagram` | `<div class="schema-box">` | Conteneur avec centrage, fond sombre/clair et bordure fine pour schémas d'architecture. |
| `schema-framed` | `<div class="schema-box framed">` | Schéma avec fond blanc contrasté (recommandé pour les schémas exportés sur fond blanc). |
| `schema-img` | `<img class="schema-img" src="...">` | Image calibrée en hauteur (`object-fit: contain;`) pour garantir zéro débordement 16:9. |
| `caption` | `<div class="schema-caption">` | Légende descriptive sous le schéma ou la figure. |
| `split-schema` | `<div class="split-schema">` | Mise en page 50/50 avec texte explicatif à gauche et grand schéma à droite. |
| `mermaid` | `<div class="mermaid">` | Diagramme vectoriel interactif Mermaid.js à chaud (séquence, flux, architecture). Auto-adapté au thème (`dark`/`light`) et à la couleur d'accent. |

---

## 11. Logos de Pied de Slide (Positionnement & Redimensionnement Multi-Niveaux)

Le moteur gère l'affichage, le redimensionnement précis et l'auto-calibrage de logos positionnés **en bas à gauche**, **au milieu** ou **en bas à droite**.
> 🛡️ **Anti-chevauchement garanti** : la présence d'un logo applique automatiquement un dégagement de sécurité en bas de slide (`padding-bottom: clamp(48px, 7vh, 64px)`), et l'auto-fit adapte la hauteur du contenu pour que celui-ci s'arrête strictement **au-dessus** du logo sans jamais passer par-dessus.
>
> 📏 **Contrôle total de la taille** :
> 1. **Style inline direct** : `<img src="..." style="height: 22px;">` ou `style="width: 40px;">`
> 2. **Attribut de taille** : `<div class="slide-logo bottom-center" data-size="20px">`
> 3. **Variable CSS** : `style="--logo-height: 20px;"`
> 4. **Classes prêtes à l'emploi** : `.logo-xs` (16px), `.logo-sm` (22px), `.logo-md` (30px), `.logo-lg` (42px), `.logo-xl` (56px)

| Alias court | Classe / Balise HTML | Utilisation & Description |
| :--- | :--- | :--- |
| `logo-left` / `bottom-left` | `<div class="slide-logo bottom-left"><img src="..."></div>` | Ancre un ou plusieurs logos **en bas à gauche** de la diapositive. |
| `logo-center` / `bottom-center`| `<div class="slide-logo bottom-center"><img src="..."></div>` | Ancre un ou plusieurs logos **au milieu (centré)** en pied de slide. |
| `logo-right` / `bottom-right` | `<div class="slide-logo bottom-right"><img src="..."></div>` | Ancre un ou plusieurs logos **en bas à droite** de la diapositive. |
| `logo-bar` | `<div class="slide-bottom-logos">` | Barre de pied de slide complète avec 3 slots : `.logo-group.left`, `.logo-group.center`, `.logo-group.right`. |
| `logo-direct` | `<img class="slide-logo bottom-left" src="...">` | Balise image directe portant les classes de positionnement. |
| `logo-xs` | `<div class="slide-logo bottom-center logo-xs">` | Format miniature (`height: 16px`). |
| `logo-sm` | `<div class="slide-logo bottom-center logo-sm">` | Format compact (`height: 22px`). |
| `logo-md` | `<div class="slide-logo bottom-center logo-md">` | Format standard par défaut (`height: 30px`). |
| `logo-lg` | `<div class="slide-logo bottom-center logo-lg">` | Format agrandi (`height: 42px`). |
| `logo-xl` | `<div class="slide-logo bottom-center logo-xl">` | Format imposant (`height: 56px`). |
| `data-size="..."` | Sur `.slide-logo` ou `img` | Règle directement la hauteur souhaitée (ex: `data-size="20px"`). |
| `logo-framed` | `<div class="slide-logo bottom-center framed">` | Ajoute un cadre discret semi-transparent (glassmorphism) pour assurer le contraste de logos sombres sur fond sombre. |
| `data-logo-left\|center\|right` | Sur `.deck-container` ou `<section class="slide">` | **Mode automatique (Zero-config)** : injecte automatiquement les logos spécifiés sans écrire de balises HTML manuelles. |
| `data-no-logos="true"` | Sur `<section class="slide">` | Masque les logos globaux sur une slide spécifique (ex: slide de titre ou conclusion). |

---

## 12. Métadonnées d'Orateur & Système
 
| Alias court | Attribut / Balise | Utilisation & Description |
| :--- | :--- | :--- |
| `notes` | `data-notes="..."` ou `<aside class="speaker-notes">` | Notes d'orateur lues par le Speaker Engine (`S` ou tiroir `N`). |
| `theme-global` | `data-theme="dark\|light\|nordic\|cyberpunk\|emerald\|navy\|sepia"` sur `.deck-container` | **Thème global du deck** (catalogue de 7 ambiances visuelles). Touche `T` pour alterner. |
| `theme-slide` | `data-theme="..."` sur `.slide` | **OPTIONNEL / EXCEPTIONNEL** : surcharge ponctuelle pour une slide isolée différente du deck (`dark`, `light`, `nordic`, `cyberpunk`, `emerald`, `navy`, `sepia`). |
| `title-slide` | `<h2 class="slide-title">` | Titre standardisé en Montserrat gras avec accent dynamique. |
| `subtitle-slide`| `<p class="slide-subtitle">` | Sous-titre explicatif en Inter ardoise moyen (`#475569`). |

---

## 13. Exemples Concrets d'Intégration HTML

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
```

### Exemple B : Grand Schéma Centré avec Légende (`schema-box`)
```html
<div class="schema-box">
  <img src="assets/schemas/cluster-nodes.svg" alt="Architecture Cluster" class="schema-img">
  <div class="schema-caption"><strong>Figure 1 :</strong> Topologie maillée et isolation des processus BEAM</div>
</div>
```

### Exemple C : Disposition 50/50 Texte & Schéma (`split-schema`)
```html
<div class="split-schema">
  <div>
    <div class="x-card featured">
      <h3>Principes de l'Arbre de Supervision</h3>
      <ul style="padding-left: 0; margin-top: 0.5rem;">
        <li class="bullet-check"><strong>Stratégie One for One :</strong> Seul le processus défaillant est relancé.</li>
        <li class="bullet-check"><strong>Stratégie One for All :</strong> Tout le groupe redémarre dans un état propre.</li>
        <li class="bullet-check"><strong>Tolérance aux pannes :</strong> Zéro effet de bord sur le reste de la grappe.</li>
      </ul>
    </div>
  </div>
  <div class="schema-box">
    <img src="assets/schemas/supervision-tree.svg" alt="Arbre OTP" class="schema-img">
    <div class="schema-caption">Arbre de supervision hiérarchique OTP</div>
  </div>
</div>
```

### Exemple D : Logos de Pied de Slide (Gauche, Milieu, Droite)

#### Option 1 : Blocs unitaires dans la slide
```html
<section class="slide" data-slide="3">
  <div class="slide-content">
    <!-- Contenu principal de la diapositive -->
  </div>

  <!-- Logo en bas à gauche -->
  <div class="slide-logo bottom-left">
    <img src="assets/logos/elixir.svg" alt="Elixir">
  </div>

  <!-- Logo ou texte institutionnel au milieu -->
  <div class="slide-logo bottom-center framed">
    <img src="assets/logos/erlang.svg" alt="BEAM">
  </div>

  <!-- Logos partenaires/écoles en bas à droite -->
  <div class="slide-logo bottom-right">
    <a href="https://example.com" target="_blank">
      <img src="assets/logos/ruby.svg" alt="Partner">
    </a>
  </div>
</section>
```

#### Option 2 : Barre de logos unifiée (`slide-bottom-logos`)
```html
<div class="slide-bottom-logos">
  <div class="logo-group left">
    <img src="assets/logos/elixir.svg" alt="Logo">
  </div>
  <div class="logo-group center">
    <img src="assets/logos/erlang.svg" alt="Erlang">
  </div>
  <div class="logo-group right">
    <img src="assets/logos/ruby.svg" alt="Ruby">
  </div>
</div>
```

#### Option 3 : Zero-Configuration au niveau global ou slide
```html
<!-- Défini une fois sur le conteneur du diaporama : appliqué sur toutes les slides -->
<div class="deck-container"
     data-logo-left="assets/logos/elixir.svg"
     data-logo-center="assets/logos/erlang.svg"
     data-logo-right="assets/logos/ruby.svg">
  ...
</div>
```

#### Contrôle Total du Redimensionnement & Zéro Chevauchement
Toutes les approches suivantes sont supportées nativement pour redimensionner les logos sans jamais risquer de chevaucher le contenu :

1. **Classes utilitaires calibrées** : `.logo-xs` (16px), `.logo-sm` (22px), `.logo-md` (30px), `.logo-lg` (42px), `.logo-xl` (56px)
   ```html
   <div class="slide-logo bottom-center logo-sm">
     <img src="assets/logos/elixir.svg" alt="Elixir">
   </div>
   ```

2. **Style inline direct** (`height: ...` ou `width: ...`) :
   ```html
   <div class="slide-logo bottom-center" style="height: 24px;">
     <img src="assets/logos/elixir.svg" alt="Elixir">
   </div>
   ```

3. **Attribut `data-size="..."`** :
   ```html
   <div class="slide-logo bottom-center" data-size="24px">
     <img src="assets/logos/elixir.svg" alt="Elixir">
   </div>
   ```

4. **Variables CSS personnalisées** :
   ```html
   <div class="slide-logo bottom-center" style="--logo-height: 24px;">
     <img src="assets/logos/elixir.svg" alt="Elixir">
   </div>
   ```

> 🛡️ **Garantie Zéro Chevauchement** : Le moteur `deck-fit.js` et le layout CSS réservent automatiquement une zone de sécurité dynamique au bas de chaque diapositive dotée de logos (`logoReserve = maxLogoHeight + 44px`). Le contenu de la slide (`.slide-content`) est automatiquement mis à l'échelle pour s'arrêter strictement au-dessus du logo avec une marge respirante.

---

## 11. Révélation Progressive & Fragments (Animations & Rythme)

Pour cadencer l'apparition des éléments à l'écran sans changer de slide (cartes, puces, jalons, blocs de code), il suffit d'ajouter la classe `.fragment` sur n'importe quel élément HTML :

| Alias / Classe | Exemple HTML | Comportement & Rendu |
| :--- | :--- | :--- |
| `fragment` | `<div class="x-card fragment">` | Apparaît au clic suivant avec un fondu et glissement doux vers le haut. |
| `fragment fade-only` | `<p class="fragment fade-only">` | Fondu simple d'opacité (sans translation verticale). |
| `fragment zoom-in` | `<div class="metric-value fragment zoom-in">` | Apparition avec léger zoom (scale `0.88` &rarr; `1`). |
| `fragment semi-fade` | `<li class="fragment semi-fade">` | Visible initialement à 22% d'opacité, puis devient 100% au focus. |
| `fragment highlight-current`| `<div class="x-card fragment highlight-current">` | Met en exergue l'élément avec la couleur d'accent lorsqu'il est actif. |
| `fragment fade-out` | `<div class="fragment fade-out">` | Visible au départ, s'estompe et disparaît à l'étape suivante. |

### Ordonnancement sur-mesure (`data-fragment-index`)
Par défaut, les fragments apparaissent dans l'ordre du DOM. Pour révéler plusieurs éléments en simultané ou dans un ordre précis :
```html
<div class="x-card fragment" data-fragment-index="1">Étape A</div>
<div class="x-card fragment" data-fragment-index="1">Étape A (simultanée)</div>
<div class="x-card fragment" data-fragment-index="2">Étape B</div>
```

> 💡 **Console Présentateur & PDF** :
> - Dans la console orateur, les fragments non encore révélés apparaissent en filigrane (opacité atténuée 35%) pour anticiper la suite.
> - Dans l'aperçu de la prochaine slide et dans l'export PDF (`@media print`), tous les fragments sont automatiquement 100% visibles.

---

## 12. Diagrammes Vectoriels Mermaid.js (À Chaud & Adaptatifs)

Pour intégrer un schéma d'architecture, un diagramme de séquence ou un organigramme sans image externe, écrivez directement le code Mermaid dans une balise `<div class="mermaid">` :

```html
<div class="x-card">
  <div class="mermaid">
    sequenceDiagram
      autonumber
      Client->>Phoenix: WebSocket Handshake
      Phoenix->>Channel: Join Topic "room:lobby"
      Channel-->>Client: {:ok, %{status: "connected"}}
      Client->>Channel: push("new_msg", payload)
      Channel->>PubSub: broadcast(payload)
      PubSub-->>Client: {:msg, payload}
  </div>
</div>
```

> 🎨 **Adaptation Automatique au Design System** :
> - **Thèmes** : Le diagramme s'adapte automatiquement en mode sombre (`dark`) ou clair (`light`).
> - **Couleur d'Accent** : Les bordures principales, flèches et nœuds actifs adoptent instantanément la couleur d'accent sélectionnée (`C` ou palette).
> - **Chargement à la Demande** : Le moteur DeckEngine ne télécharge la bibliothèque Mermaid.js que si la page contient au moins un bloc `.mermaid`.