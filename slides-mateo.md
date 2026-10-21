#### Slide 5 : Le Paradigme de Programmation
- **Type de slide** : slide
- **Titre (title-slide)** : Le Paradigme de Programmation
- **Sous-titre (subtitle-slide)** : Penser déclaratif et fonctionnel : exprimer l'intention plutôt que la mutation
- **Mise en page** : grid-2
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
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le choc culturel :** Expliquer qu'on oublie les boucles `for` classiques et les mutations d'objets (`compte.retirer(50)`).
  > - **L'immutabilité :** En maths, $x = 5$ ne devient jamais $x = 6$ une ligne plus bas. Modifier une donnée produit une nouvelle valeur propre.
  > - **Avantage concret :** Élimine 90% des bugs d'effets de bord et rend le code naturellement parallélisable.

---

#### Slide 6 : Le Système de Typage
- **Type de slide** : slide
- **Titre (title-slide)** : Le Système de Typage
- **Sous-titre (subtitle-slide)** : Dynamique à l'écriture, fort et rigoureux à l'exécution (Durée : 1 min 30)
- **Mise en page** : grid-2
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
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Démystifier le dynamique :** Dynamique ne veut pas dire laxiste. Contrairement à JavaScript (`"5" + 5 = "55"`), Elixir stoppe net toute incohérence.
  > - **Les atomes :** Ce sont les symboles d'Elixir (comme des enums légers et universels).
  > - **Lien vers la suite :** Ces types structurés (tuples, maps, atomes) sont la base du filtrage de données.

---

#### Slide 7 : Le Modèle d'Exécution
- **Type de slide** : slide
- **Titre (title-slide)** : Le Modèle d'Exécution
- **Sous-titre (subtitle-slide)** : Du code source au bytecode optimisé sur la machine virtuelle BEAM
- **Mise en page** : grid-2
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
      - Héritage industriel Erlang : Plus de 30 ans d'optimisation pour destiné aux télécoms et la disponibilité continue.
      - 1 Scheduler par cœur CPU : Exploite pleinement le matériel multi-cœur sans aucun verrou global.
      - Soft Real-Time : Conçu pour garantir des latences prévisibles et bornées même sous forte saturation.
- **Pied de slide** : banner
  - Règle d'or : "La BEAM est à Elixir ce que la JVM est à Java : un moteur d'exécution compilé taillé pour la vitesse et la haute disponibilité."
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Casser l'idée reçue :** Beaucoup d'étudiants croient qu'Elixir est interprété. C'est faux : il est compilé en bytecode.
  > - **La BEAM :** C'est le moteur le plus éprouvé au monde pour le temps réel et la concurrence (WhatsApp, Discord).
  > - **Parallélisme natif :** Tous les cœurs CPU travaillent simultanément sans se bloquer.

---

#### Slide 8 : La Gestion de la Mémoire
- **Type de slide** : slide
- **Titre (title-slide)** : La Gestion de la Mémoire
- **Sous-titre (subtitle-slide)** : Des tas isolés et un Garbage Collector
- **Mise en page** : grid-2
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
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le point fort d'Elixir :** En Java, le GC balaye des gigas de RAM et met en pause l'application entière (Stop-the-World).
  > - **Sur la BEAM :** Chaque processus nettoie ses 2 Ko tout seul dans son coin. Zéro impact sur les autres utilisateurs.
  > - **Cycle de vie court :** Pour une requête web, le processus naît, répond, et sa mémoire est relâchée instantanément à sa mort.

---

#### Slide 9 : La Concurrence et le Parallélisme
- **Type de slide** : slide
- **Titre (title-slide)** : La Concurrence & le Parallélisme
- **Sous-titre (subtitle-slide)** : Le modèle d'acteurs : des micro-processus légers sans mémoire partagée
- **Mise en page** : grid-2
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
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Précision clé :** Un processus BEAM n'est PAS un processus OS Linux, c'est un micro-thread virtuel ultra-léger.
  > - **La métaphore des SMS :** Deux personnes qui s'échangent des SMS : chacune a son téléphone, personne ne peut altérer la mémoire de l'autre.
  > - **Transition vers la démo :** "Nous avons posé les 5 piliers théoriques (8 min). Passons maintenant à l'écran pour la démonstration en direct !"

---

#### Slide 10 : Démo Livecoding
- **Type de slide** : slide
- **Titre (title-slide)** : Démo Livecoding
- **Sous-titre (subtitle-slide)** : Démonstration sur écran avec backup vidéo
- **Mise en page** : grid-2
  - **Colonne Gauche (Session Live)** : card-featured
    - badge-solid : En Direct
    - Titre : Démonstration sur l'Écran
    - Liste (icon-bullet) :
      - Bascule immédiate sur l'écran partagé : Tout se déroule en direct dans l'éditeur et le terminal.
      - Session interactive : Démonstration pratique et observation en temps réel.
  - **Colonne Droite (Filet de Sécurité)** : card
    - badge-gray : Backup Vidéo
    - Titre : Vidéo de Secours (7 min)
    - Description : Enregistrement complet chapitré, prêt à être lancé immédiatement si besoin.
    - Lecteur / Bouton d'action :
      - link-btn : `▶ Lancer la Vidéo de Secours (backup_demo.mp4)`
- **Pied de slide** : banner
  - Formule clé : Place à la pratique : bascule sur l'écran pour la démonstration en direct !
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Bascule immédiate :** Quitter la présentation pour afficher le terminal et l'IDE sur l'écran principal.
  > - **Plan B (Secours) :** En cas d'aléa réseau ou machine, cliquer sur « Lancer la Vidéo de Secours » pour diffuser la vidéo de 7 minutes et continuer le commentaire en voix off.