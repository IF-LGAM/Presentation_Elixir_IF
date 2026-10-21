### Structure des Slides :

#### Slide 1 : Annonce de Section / Sommaire (Intertitre)
- **Type de slide** : slide
- **Mise en page** : hero
- **Badge section** : badge-solid : PARTIE 1 — JALON 4
- **Titre (title-slide)** : Concepts Fondamentaux & Code en Action
- **Sous-titre (subtitle-slide)** : Variables, filtrage par motif, types, fonctions, objets et flux (Durée : 10 min)
- **Organisation (Sous-parties abordées)** : grid-3
  - **Jalon 1** : card
    - badge-gray : 2.5 min
    - Titre : Variables & Pattern Matching
    - Description : L'opérateur `=`, déstructuration instantanée, gestion d'erreurs et opérateur Pin `^`.
  - **Jalon 2** : card
    - badge-gray : 2 min
    - Titre : Les Types de Base
    - Description : Atoms, Tuples, Listes chaînées `[t|q]` et Maps associatives.
  - **Jalon 3** : card
    - badge-gray : 1 min
    - Titre : Les Fonctions
    - Description : Citoyennes de premier rang, fonctions anonymes, modules et notion d'arité.
  - **Jalon 4** : card
    - badge-gray : 1.5 min
    - Titre : Alternative aux Objets
    - Description : Séparation stricte données/méthodes avec Structs et Modules immuables.
  - **Jalon 5** : card
    - badge-gray : 1 min
    - Titre : Flux & Pipe Operator `|>`
    - Description : Chaînage limpide et transformation de données de haut en bas.
  - **Jalon 6** : card
    - badge-gray : 2 min
    - Titre : Pièges & Philosophies
    - Description : Immuabilité, « Let it crash », guillemets et disparition des boucles `for`/`while`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Prise de parole & Transition :** Merci. Je prends maintenant le relais pour vous plonger concrètement dans le code et les mécanismes essentiels du langage Elixir.
  > - **Objectif (10 min) :** Parcourir les fondations syntaxiques et conceptuelles qui font d'Elixir un langage si singulier et productif.
  > - **Au programme :** Le pattern matching, les structures de données, l'absence de classes objet remplacée par les Structs, le célèbre pipe operator, et enfin 4 pièges majeurs à éviter absolument quand on vient de Java ou Python.
  > - **Lancement :** Commençons immédiatement par la base de tout en Elixir : l'opérateur `=` et le pattern matching.

---

#### Slide 2 : Variables et l'opérateur de Pattern Matching
- **Type de slide** : slide
- **Titre (title-slide)** : Variables & Pattern Matching : Le Signe = Réinventé
- **Sous-titre (subtitle-slide)** : En Elixir, le signe = n'est pas une simple assignation, c'est un opérateur de filtrage par motif
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Filtrage par Motif
    - Titre : L'Équivalence & la Déstructuration
    - Liste (icon-bullet) :
      - Pas d'assignation classique : Le signe `=` agit comme une équation mathématique cherchant à faire correspondre le côté gauche et le côté droit.
      - Liaison (binding) : Si une variable nue est à gauche (`x = 1`), Elixir lie la valeur à cette variable.
      - Déstructuration directe : Extraction instantanée des sous-valeurs depuis des tuples ou des structures (`{status, message}`).
      - Gestion d'erreur native : Si le motif ne concorde pas, l'exécution s'interrompt immédiatement avec une `MatchError`.
      - Données immuables : Les structures liées ne sont jamais mutées en mémoire.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pattern_matching.ex
    - Code (language-elixir) :
      # "Assignation" classique (en réalité, on lie la valeur 1 à x)
      x = 1

      # Pattern matching puissant : on extrait les valeurs directement
      # et on continue l'execution si le motif correspond
      {status, message} = {:ok, "Connecté"}

      # Provoque une erreur si le motif ne correspond pas (très utile pour la gestion d'erreur)
      {:ok, resultat} = {:error, "Fichier introuvable"}
      # => ** (MatchError) no match of right hand side value: {:error, "Fichier introuvable"}
  - **Pied de slide** : banner
    - Règle d'or : Le signe `=` valide la forme des données et extrait les valeurs en une seule et unique opération.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Idée fondamentale :** Oubliez le `=` de Java ou C++. En Elixir, `=` s'appelle l'opérateur de match.
  > - **Exemple simple :** `x = 1` ressemble à une assignation, mais en réalité on lie 1 à x.
  > - **La déstructuration :** Avec `{status, message} = {:ok, "Connecté"}`, on dépaquette directement le tuple. Pas besoin de getters ou d'index.
  > - **La gestion d'erreur :** Ligne suivante, si on attend `{:ok, resultat}` mais qu'on reçoit `{:error, ...}`, Elixir lève immédiatement une `MatchError`. C'est la base de la programmation défensive et robuste en Elixir sans empiler des `if/else`.
  > - **Transition :** Mais que se passe-t-il si x a déjà une valeur et qu'on veut comparer sans réassigner ? C'est là qu'intervient l'opérateur Pin.

---

#### Slide 3 : L'Opérateur Pin (^)
- **Type de slide** : slide
- **Titre (title-slide)** : L'Opérateur Pin (^) : Forcer le Test d'Égalité
- **Sous-titre (subtitle-slide)** : Empêcher la réassignation d'une variable existante lors du filtrage par motif
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Contrôle du Motif
    - Titre : Le Verrouillage par Pin (^)
    - Liste (icon-bullet) :
      - Rebinding par défaut : En Elixir, si une variable déjà existante apparaît à gauche d'un `=`, elle est réassignée par défaut à la nouvelle valeur.
      - Rôle de l'opérateur Pin (`^`) : Préfixer une variable avec `^` force le test avec la valeur existante de cette variable.
      - Refus d'assignation : L'opérateur interdit toute nouvelle liaison de valeur et bascule en mode comparaison pure.
      - Assertion stricte : Si la valeur de droite ne coïncide pas exactement avec la valeur existante "épinglée", Elixir lève une `MatchError`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pin_operator.ex
    - Code (language-elixir) :
      x = 1

      # L'opérateur Pin (^) : force le test avec la valeur existante de x (qui est 1)
      # au lieu d'assigner une nouvelle valeur.
      ^x = 1
      # => OK, car x vaut bien 1

      ^x = 2
      # => MatchError !
      # (on refuse d'assigner 2 à x, on vérifie juste si 2 égale 1)
  - **Pied de slide** : banner
    - Principe : Sans `^`, `x = 2` écrase la liaison ; avec `^x = 2`, on teste si la variable vaut bien 2.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Problématique :** Comme Elixir autorise la réassignation de variable (rebinding), comment vérifier qu'une valeur reçue correspond bien à une variable calculée précédemment ?
  > - **Le symbole Pin :** C'est le rôle de l'accent circonflexe `^`. Il "épingle" la variable à sa valeur actuelle.
  > - **Lecture du code :** `^x = 1` réussit car x vaut bien 1. En revanche, `^x = 2` fait échouer le match avec une `MatchError`.
  > - **Cas d'usage :** Essentiel dans les clauses `case` ou dans les paramètres de fonctions pour matcher sur un identifiant précis sans créer de variable locale.

---

#### Slide 4 : Les Types de Base (1/2) : Atoms & Tuples
- **Type de slide** : slide
- **Titre (title-slide)** : Types Fondamentaux : Atoms & Tuples
- **Sous-titre (subtitle-slide)** : Typage dynamique fort, constantes symboliques et conteneurs à taille fixe
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Fondations & Retours
    - Titre : Symboles & Paires
    - Liste (icon-bullet) :
      - Typage dynamique fort : Les types sont vérifiés au runtime sans conversion implicite inattendue.
      - Les Atoms (`:ok`, `:error`) : Des constantes dont le nom est leur propre valeur, extrêmement légères en mémoire (comparables aux symboles Ruby).
      - Les Tuples (`{...}`) : Structures contiguës à taille fixe, idéales pour regrouper les valeurs de retour de fonctions.
      - Extraction de données : Principalement lue via Pattern Matching, ou ponctuellement via `elem(tuple, index)`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : atoms_and_tuples.ex
    - Code (language-elixir) :
      # 1. Les Atoms (des constantes dont le nom est la propre valeur)
      :ok
      :error

      # 2. Les Tuples (taille fixe, très utilisés pour grouper des retours de fonction)
      utilisateur = {:user, "Jean", 25}

      # -> Comment y accéder ? Principalement via Pattern Matching :
      {:user, nom, age} = utilisateur
      # nom vaut "Jean", age vaut 25

      # (Ou via la fonction elem/2 si besoin précis : elem(utilisateur, 1) => "Jean")
      nom_direct = elem(utilisateur, 1) # => "Jean"
  - **Pied de slide** : banner
    - Convention universelle : Le standard Elixir retourne presque toujours `{:ok, resultat}` en cas de succès et `{:error, raison}` en cas d'échec.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Typage en Elixir :** Typage dynamique, mais fort : pas de casting magique silencieux.
  > - **L'Atom :** Préfixé par `:`, son nom est sa valeur. Deux atoms `:ok` pointent vers la même adresse en mémoire.
  > - **Le Tuple :** Conçu pour des groupes de taille connue à l'avance. Remarquez comment la déstructuration par motif extrait `nom` et `age` sans aucun code superflu.
  > - **elem/2 :** Fonction utilitaire pour accéder par index (commence à 0), mais la convention préfère toujours le pattern matching.

---

#### Slide 5 : Les Types de Base (2/2) : Listes Chaînées & Maps
- **Type de slide** : slide
- **Titre (title-slide)** : Collections : Listes Chaînées & Maps
- **Sous-titre (subtitle-slide)** : Décomposition Tête/Queue et dictionnaires associatifs clé/valeur
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Structures de Données
    - Titre : Listes vs Dictionnaires
    - Liste (icon-bullet) :
      - Listes chaînées (`[...]`) : Ce ne sont PAS des tableaux indexés contigus, mais des listes récursives Tête (*Head*) / Queue (*Tail*).
      - Décomposition `[tete | queue]` : Permet d'isoler le premier élément du reste pour des traitements récursifs très rapides.
      - Ajout en tête O(1) : Ajouter au début avec `[0 | liste]` est instantané et préserve la mémoire existante (partage structurel).
      - Maps (`%{...}`) : Dictionnaires clé/valeur avec recherche rapide, accès par `Map.get/2`, syntaxe `map.cle` (si clé atom) et pattern matching.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : lists_and_maps.ex
    - Code (language-elixir) :
      # 3. Les Listes (Ce sont des listes chaînées, pas des tableaux fixes !)
      liste = [1, 2, 3]

      # -> Comment travailler avec ? On sépare souvent la "Tête" (1er élément) de la "Queue" (le reste)
      [tete | queue] = liste 
      # tete vaut 1, queue vaut [2, 3]

      # -> Ajouter un élément ? On l'ajoute toujours au DÉBUT (très rapide en liste chaînée)
      nouvelle_liste = [0 | liste] # => [0, 1, 2, 3]

      # 4. Les Maps (Dictionnaires Clé/Valeur)
      map = %{"role" => "admin", :age => 30}

      # -> Comment accéder aux valeurs ? 
      Map.get(map, "role") # => "admin"

      # -> LE raccourci très utilisé : si la clé est un Atom, on peut utiliser le point (.)
      map.age # => 30

      # -> Le Pattern Matching marche aussi sur les Maps (pour vérifier la présence d'une clé)
      %{age: age_recupere} = map # => age_recupere vaut 30
  - **Pied de slide** : banner
    - À retenir : Les listes chaînées s'alimentent toujours par la tête ; les maps fournissent la flexibilité clé/valeur.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Attention piège :** Une liste Elixir n'est pas un tableau `ArrayList`. Accéder au 1000ème élément oblige à parcourir les 999 précédents.
  > - **L'opérateur pipe `|` dans les listes :** Il sépare la tête (1er élément) de la queue (le reste). L'ajout au début `[0 | liste]` est instantané en O(1).
  > - **Les Maps :** Dictionnaires très puissants. Si les clés sont des atoms, on accède via le point `map.age`. Et notez qu'on peut filtrer par pattern matching pour extraire seulement les clés qui nous intéressent.

---

#### Slide 6 : Les Fonctions & la Notion d'Arité
- **Type de slide** : slide
- **Titre (title-slide)** : Les Fonctions : Citoyennes de Premier Rang
- **Sous-titre (subtitle-slide)** : Fonctions anonymes, fonctions nommées et identification stricte par nom et arité
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Fonctions Pures
    - Titre : Définition & Identification
    - Liste (icon-bullet) :
      - Citoyennes de 1er rang : Les fonctions peuvent être stockées dans des variables, transmises comme arguments ou retournées.
      - Notion d'arité (`nom/arité`) : Une fonction est strictement caractérisée par son nom ET son nombre d'arguments (ex: `add/2` est distincte de `add/3`).
      - Fonctions anonymes : Définies avec `fn -> ... end` et appelées impérativement avec un point `.(args)`.
      - Fonctions nommées : Résident obligatoirement au sein d'un `defmodule` avec syntaxe standard `do...end` ou syntaxe courte en une ligne `do: ...`.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : functions.ex
    - Code (language-elixir) :
      # Fonction anonyme
      addition = fn a, b -> a + b end
      addition.(2, 3) # => 5

      # Fonction nommée (doit vivre dans un module)
      defmodule Math do
        def add(a, b) do
          a + b
        end

        # Syntaxe raccourcie très courante
        def sub(a, b), do: a - b
      end
  - **Pied de slide** : banner
    - Convention : En Elixir, on ne parle jamais de la fonction `add`, mais toujours de `Math.add/2`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Citoyennes de 1er rang :** On manipule les fonctions comme des valeurs classiques.
  > - **L'appel anonyme :** Notez le point `addition.(2, 3)`. C'est une distinction syntaxique voulue pour ne pas confondre fonction anonyme et fonction nommée d'un module.
  > - **L'arité :** Retenez bien cette notation slash `/` (`add/2`), vous la retrouverez dans toute la documentation officielle et les messages d'erreur.

---

#### Slide 7 : L'Alternative aux "Objets" : Structs et Modules
- **Type de slide** : slide
- **Titre (title-slide)** : Structs & Modules : Séparer Données et Comportement
- **Sous-titre (subtitle-slide)** : En l'absence de classes objet, découpler l'état (Structs) des transformations (Modules)
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Paradigme Fonctionnel
    - Titre : Pas d'Encapsulation Mutable
    - Liste (icon-bullet) :
      - Rupture avec l'Orienté Objet : En Elixir, on ne regroupe pas données et méthodes au sein d'une même classe.
      - Les Structs (`defstruct`) : Ce sont des Maps typées et nommées définissant la structure de données avec des valeurs par défaut.
      - Les Modules (`defmodule`) : Regroupent les fonctions métier pures qui reçoivent les données, les transforment et retournent une nouvelle copie.
      - Immuabilité stricte : `%{user | age: age + 1}` ne modifie pas l'utilisateur initial en mémoire, mais renvoie un nouvel utilisateur cloné et mis à jour.
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : user_struct.ex
    - Code (language-elixir) :
      defmodule User do
        # Définition de la structure de données
        defstruct name: "Anonyme", age: 0

        # Comportement
        def grandir(%User{age: age} = user) do
          %{user | age: age + 1}
          # Retourne un NOUVEL utilisateur, ne modifie pas l'ancien (immuabilité)
        end
      end

      jean = %User{name: "Jean", age: 30}
      jean_plus_vieux = User.grandir(jean)
  - **Pied de slide** : banner
    - Formule clé : Données pures (`Struct`) + Fonctions de transformation (`Module`) = Code prévisible et sans effets de bord.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le choc de l'OO vers le fonctionnel :** En Java, on écrirait `jean.grandir()`, modifiant l'état interne de l'objet.
  > - **L'approche Elixir :** On sépare strictement le conteneur de données (`User` avec son `defstruct`) des fonctions qui le manipulent.
  > - **L'immuabilité en action :** `User.grandir(jean)` ne touche pas à la variable `jean` (qui a toujours 30 ans). Elle renvoie une nouvelle structure avec `age: 31`.
  > - **Élimination des bugs :** Fini les effets de bord où une méthode tierce mute subrepticement votre objet sans que vous le sachiez.

---

#### Slide 8 : Les Flux / Le Pipe Operator (|>)
- **Type de slide** : slide
- **Titre (title-slide)** : Le Pipe Operator (|>) : L'Élégance des Flux
- **Sous-titre (subtitle-slide)** : Transformer les imbrications de parenthèses en un pipeline limpide et naturel
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Fonctionnalité Favorite
    - Titre : Lisibilité & Composition de Flux
    - Liste (icon-bullet) :
      - Mécanisme : L'opérateur `|>` injecte automatiquement le résultat de l'expression de gauche comme premier argument de la fonction de droite.
      - Fin des poupées russes : Supprime les imbrications illisibles de l'intérieur vers l'extérieur `f(g(h(x)))`.
      - Sens de lecture naturel : Le flux se lit de haut en bas et de gauche à droite, comme une chaîne de transformation.
      - Fondement de Phoenix : C'est ce mécanisme exact qui orchestre le passage des requêtes HTTP à travers les Plugs (`conn |> plug1 |> plug2`).
  - **Colonne Droite (Snippet de Code)** : code-box
    - code-header : pipe_operator.ex
    - Code (language-elixir) :
      # Sans le pipe operator (lecture difficile, de l'intérieur vers l'extérieur)
      Enum.sum(Enum.filter(1..10, fn x -> rem(x, 2) == 0 end))

      # AVEC le pipe operator (lecture naturelle, de haut en bas)
      1..10
      |> Enum.filter(fn x -> rem(x, 2) == 0 end)
      |> Enum.sum()
  - **Pied de slide** : banner
    - Équation de lisibilité : `donnée |> étape_1() |> étape_2() |> résultat_final`.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le pipe operator :** C'est la fonctionnalité préférée des développeurs Elixir.
  > - **Comparaison visuelle :** En haut, pour comprendre ce que fait le code, il faut commencer par lire au milieu `1..10`, puis reculer vers `Enum.filter`, puis encore vers `Enum.sum`.
  > - **Avec le pipe :** C'est limpide : je prends les nombres de 1 à 10, je garde les pairs, je calcule la somme.
  > - **Lien vers Phoenix :** Retenez bien cette syntaxe, car Phoenix repose à 100% là-dessus pour traiter les connexions web d'étape en étape.

---

#### Slide 9 : Les 4 Pièges & Concepts Clés à Retenir
- **Type de slide** : slide
- **Titre (title-slide)** : Les 4 Pièges & Changements de Paradigme
- **Sous-titre (subtitle-slide)** : Les réflexes impératifs à désapprendre pour maîtriser l'esprit d'Elixir
- **Mise en page** : grid-4
  - **Colonne 1 (Piège 1)** : card
    - badge-gray : Piège #1
    - Titre : Le Piège de l'Immuabilité
    - Liste (icon-bullet) :
      - Perte de modification : Modifier une liste ou une structure sans récupérer et réassigner le résultat entraîne la perte immédiate du calcul.
      - Zéro mutation sur place : Aucune méthode ne modifie l'objet en mémoire.
  - **Colonne 2 (Concept 2)** : card-featured
    - badge-solid : Philosophie BEAM
    - Titre : La Philosophie « Let it crash »
    - Liste (icon-bullet) :
      - Pas de try/catch à outrance : Contrairement à Java ou C#, on n'encapsule pas tout dans des blocs d'exception.
      - Redémarrage sain : On laisse délibérément le processus planter ; un « Superviseur » le redémarre instantanément dans un état connu et sain.
  - **Colonne 3 (Piège 3)** : card
    - badge-gray : Piège #2
    - Titre : Le Piège des Guillemets
    - Liste (icon-bullet) :
      - Double guillemet `"texte"` : C'est un String binaire UTF-8 classique.
      - Simple guillemet `'texte'` : C'est une Charlist (liste de codes ASCII issue d'Erlang).
      - En mémoire : Écrire `'hello'` équivaut strictement à `[104, 101, 108, 108, 111]`.
  - **Colonne 4 (Concept 4)** : card
    - badge-gray : Piège #3
    - Titre : Adieu while et for
    - Liste (icon-bullet) :
      - Pas de mutation de variable : Les boucles traditionnelles `for`/`while` avec compteurs incrémentés sont impossibles.
      - Transformations pures : Tout se gère par récursivité ou via le module `Enum` (`Enum.map`, `Enum.reduce`). On ne boucle pas, on transforme un flux.
- **Pied de slide** : banner
  - Mindset Elixir : L'immuabilité et la supervision changent radicalement la façon d'écrire et de fiabiliser un logiciel.
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Synthèse des pièges :** Pour conclure ma partie, voici les 4 points où les nouveaux venus trébuchent le plus :
  > - **1. L'immuabilité :** Si vous faites un `List.delete(l, 1)` sans écrire `l = List.delete(l, 1)`, votre liste d'origine n'a pas bougé !
  > - **2. Let it crash :** Ne cherchez pas à blinder votre code avec des try/catch partout. En Elixir, on laisse planter les micro-processus car l'arbre de supervision les relance instantanément.
  > - **3. Les guillemets :** Attention : `"texte"` (String binaire) n'est pas `'texte'` (Charlist / liste d'entiers Erlang). Les libs Erlang demandent souvent des simples guillemets.
  > - **4. Fin des boucles :** Pas de `while` ni de `for` mutable. On utilise `Enum.map` ou la récursion. On transforme la donnée.
  > - **Transition vers la Partie 2 :** Vous avez maintenant en main tous les concepts fondamentaux d'Elixir. Je passe la parole à mon camarade pour découvrir comment le framework Phoenix exploite toute cette puissance pour révolutionner le web temps réel !
