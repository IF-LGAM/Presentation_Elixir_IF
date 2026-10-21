# Partie 3 : Atelier Pratique & TP (5 min)
## Cadrage Opérationnel de l'Atelier « Les Bons Comptes »

> ⏱️ **Durée d'intervention :** 5 minutes (Slide 16 / Clôture de soutenance)  
> 👤 **Intervenant :** fgogo  
> 📂 **Dépôt TP de référence :** `IF-LGAM/les_bons_comptes`  
> 🛠️ **Environnement :** Docker Compose (Phoenix 1.7 + PostgreSQL 15)  
> 🎨 **Conformité visuelle :** `COMPOSANTS_DICTIONNAIRE.md` (Layout `grid-3`)  

---

### Spécification Markdown pour le Deck Engine :

#### Slide 16 : Cadrage de l'Atelier Pratique & TP (Clôture)
- **Type de slide** : slide
- **Titre (title-slide)** : Atelier Pratique : Déployer et Étendre « Les Bons Comptes »
- **Sous-titre (subtitle-slide)** : Une application fonctionnelle fournie pour se concentrer sur l'affichage et l'ajout temps réel
- **Mise en page** : grid-3
  - **Colonne 1 (Missions Ciblées)** : card
    - badge-solid : Missions Ciblées
    - Titre : Focus sur la Réactivité
    - Liste (icon-bullet) :
      - Base fournie clé en main : Aucun temps perdu sur la configuration : l'architecture, l'authentification et la BDD sont déjà en place.
      - Exploitation BDD (Ecto) : Requêter la base PostgreSQL et afficher dynamiquement les dépenses dans les templates HEEx (`~H`).
      - Ajout de données en direct : Implémenter le formulaire de saisie réactif et valider les données côté serveur.
      - Synchronisation collective : Diffuser l'ajout via PubSub pour que la dépense apparaisse chez tout le monde en direct.
  - **Colonne 2 (L'Environnement Technique)** : card-featured
    - badge-solid : Zéro Friction
    - Titre : Stack & Outils Intégrés
    - Liste (icon-bullet) :
      - Pile 100% Conteneurisée : Docker Compose (Phoenix 1.7 + PostgreSQL 15). Aucun runtime Elixir local requis sur machine hôte.
      - Jeu de test « Think HUGE » : 130+ porte-monnaies et 440+ dépenses pré-générées pour observer la scalabilité.
      - Phoenix LiveDashboard : Métriques machine et introspection des processus BEAM en direct sur `/dev/dashboard`.
      - Identifiants de test : Compte démonstrateur prêt à l'emploi (`admin@exemple.com` / `admin123`).
  - **Colonne 3 (Commandes de Boot)** : card
    - badge-gray : Terminal Rapide
    - Titre : Démarrage en 3 Commandes
    - Code (terminal-box) :
      # 1. Cloner et lancer la pile Docker
      git clone git@github.com:IF-LGAM/les_bons_comptes.git
      cd les_bons_comptes
      docker compose up -d

      # 2. Initialiser la base et le jeu de données
      docker compose exec web mix ecto.setup

      # 3. Ouvrir dans le navigateur :
      # Application web   : http://localhost:4000
      # LiveDashboard     : http://localhost:4000/dev/dashboard
  - **Pied de slide** : banner
    - Consigne générale : Suivez le guide pas-à-pas documenté dans le README du dépôt. L'équipe reste disponible pour vous débloquer.
  - **Logo de slide** :
    - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Lancement de la Partie 3 (5 min) :** Merci. Je reprends la parole pour clore cette présentation et cadrer notre atelier pratique de 2 heures.
  > - **Pas de code from scratch :** Rassurez-vous, vous n'allez pas tout recoder. L'application est fournie clé en main avec sa base de données PostgreSQL pré-remplie.
  > - **Votre mission concrète :** Vous allez vous concentrer sur une brique précise : afficher les données existantes avec Ecto, implémenter l'ajout d'une nouvelle dépense, et voir la magie de LiveView où votre saisie s'affiche en temps réel sur l'écran de votre voisin sans recharger la page.
  > - **L'environnement zéro friction :** Pas besoin d'installer Elixir ni PostgreSQL. Trois commandes Docker Compose suffisent pour être immédiatement opérationnel sur localhost:4000.
  > - **Le jeu de test de charge :** La base de données embarque déjà plus de 130 porte-monnaies et 440 dépenses. Vous constaterez que même sous ce volume, les calculs et le rendu restent instantanés.
  > - **Top départ :** Les dépôts sont ouverts, les commandes sont affichées au tableau. Bon atelier à tous, nous passons dans les rangs pour vous accompagner !

---

### 💡 Pistes d'Exercices à Soumettre à Votre Groupe :

| Option | Thématique | Complexité | Intérêt Pédagogique |
| :--- | :--- | :--- | :--- |
| **Option 1 (Recommandée)** | **Filtrage en direct des dépenses** | Accessible (1h) | Manipuler `handle_event("filter", params, socket)` et la syntaxe HEEx sans rechargement. |
| **Option 2** | **Alerte temps réel PubSub** | Intermédiaire (1h30) | Brancher `Phoenix.PubSub.broadcast/3` pour afficher un toast flash vert sur tous les navigateurs connectés. |
| **Option 3** | **Calcul d'un nouvel indicateur** | Algorithmique (1h30) | Écrire une fonction pure Elixir avec pattern matching pour calculer la plus grosse dépense individuelle. |
