# Partie 2 — Jalon 3 : Fonctionnalités Clés de Phoenix (10 min)
## Routage, Contrôleurs & LiveView en Action

> ⏱️ **Durée d'intervention :** 10 minutes (Slides 12 à 15)  
> 👤 **Intervenant :** Gautier 
> 📂 **Dépôt applicatif de référence :** `les_bons_comptes` (Master MIAGE — IF)  
> 🎨 **Conformité visuelle :** `COMPOSANTS_DICTIONNAIRE.md` & thèmes Deck Engine  

---

### Structure des Slides :

#### Slide 12 : Le Routage Phoenix (Scopes, Pipelines & Live Sessions)
- **Type de slide** : slide
- **Titre (title-slide)** : Le Routage Phoenix : Scopes, Pipelines & Live Sessions
- **Sous-titre (subtitle-slide)** : Coexistence native du Web classique, des APIs REST et des tunnels temps réel
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Aiguillage Réseau
    - Titre : Des flux étanches et composables
    - Liste (icon-bullet) :
      - Pipelines modulaires : `:browser` empile la gestion de session et la protection CSRF ; `:api` traite du JSON stateless pur.
      - Scopes hiérarchiques : Découpage explicite entre routes publiques, zone authentifiée et API externe `/api`.
      - Sécurisation live_session : La directive `on_mount` (`ensure_authenticated`) verrouille l'accès avant l'ouverture du canal WebSocket.
      - Vérification à la compilation : Le sigil de route vérifié `~p` élimine tout risque d'URLs cassées au runtime.
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/router.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.Router do
        use LesBonsComptesWeb, :router

        pipeline :browser do
          plug :accepts, ["html"]
          plug :fetch_session
          plug :protect_from_forgery
        end

        pipeline :api do
          plug :accepts, ["json"]
        end

        scope "/", LesBonsComptesWeb do
          pipe_through :browser

          # Pages temps réel sous tunnel WebSocket sécurisé
          live_session :authenticated_user,
            on_mount: [{LesBonsComptesWeb.UserAuth, :ensure_authenticated}] do
            live "/wallets", WalletLive.Index, :index
            live "/wallets/:id", WalletLive.Show, :show
            live "/wallets/:id/expenses/new", WalletLive.ExpenseNew, :new
          end
        end

        # API REST pour les services tiers
        scope "/api", LesBonsComptesWeb do
          pipe_through :api
          get "/wallets/:id/settlements", SettlementController, :index
        end
      end
  - **Pied de slide** : banner
    - Principe directeur : Un seul fichier pour gouverner tout le trafic : pages HTML, endpoints REST et applications LiveView.
  - **Logo de slide** :
    - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Prise de parole (2 min 30) :** Regardons comment s'articule le routage dans notre application réelle « Les bons comptes ».
  > - **Les pipelines :** En haut, deux tuyaux distincts : `:browser` pour la navigation humaine avec gestion de session, et `:api` pour les échanges de données JSON.
  > - **La puissance de live_session :** Remarquez le bloc `live_session :authenticated_user`. Toutes nos pages de gestion (`WalletLive.Show`, `ExpenseNew`) sont protégées par le hook `ensure_authenticated` avant même d'ouvrir le WebSocket.
  > - **L'ouverture REST :** En bas, le même routeur expose aussi une API REST standard `/api/wallets/:id/settlements` pour des intégrations externes.
  > - **Transition :** Regardons maintenant comment fonctionne le contrôleur de cette API REST.

---

#### Slide 13 : Contrôleurs Standard & APIs JSON
- **Type de slide** : slide
- **Titre (title-slide)** : Contrôleurs Standard : Fonctions Pures & Algorithmique Métier
- **Sous-titre (subtitle-slide)** : Pattern matching en signature, gestion d'erreurs et calcul des dettes
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card
    - badge-solid : Paradigme MVC Pur
    - Titre : Une transformation de données immuable
    - Liste (icon-bullet) :
      - Action = Fonction pure : L'action reçoit `(conn, params)` et renvoie une nouvelle structure `conn` transformée.
      - Pattern Matching en signature : Déstructuration immédiate des paramètres d'URL (`%{"id" => id}`).
      - Algorithmique dans le Contexte : Le contrôleur n'exécute pas de SQL, il appelle `Expenses.calculate_settlements/1`.
      - Rendu sans exception : Les cas d'erreur (`{:error, :not_found}`) sont gérés par retour de statuts HTTP propres sans crash.
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/controllers/settlement_controller.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.SettlementController do
        use LesBonsComptesWeb, :controller
        alias LesBonsComptes.{Expenses, Wallets}

        # 1. Extraction directe de l'identifiant URL
        def index(conn, %{"id" => id}) do
          case Wallets.get_wallet(id) do
            nil ->
              conn
              |> put_status(:not_found)
              |> json(%{error: "Porte-monnaie introuvable"})

            wallet ->
              settlements = Expenses.calculate_settlements(wallet)
              creditors = Expenses.calculate_creditors(wallet)

              render(conn, :index,
                wallet: wallet,
                settlements: settlements,
                creditors: creditors
              )
          end
        end
      end
  - **Pied de slide** : banner
    - Règle d'or : Zéro état persistant dans le contrôleur : f(conn, params) -> conn. Prévisible, testable et sans effets de bord.
  - **Logo de slide** :
    - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Cas d'usage (2 min 30) :** Voici le contrôleur réel calculant les remboursements optimisés entre colocataires.
  > - **Le pattern matching imbriqué :** Admirez la lisibilité : on extrait l'identifiant, on tente de récupérer le wallet, et on calcule l'équilibrage.
  > - **Séparation des responsabilités :** Le contrôleur ne fait aucun calcul mathématique lui-même. Il sollicite le contexte métier `Expenses`.
  > - **Rendu JSON :** En cas de succès, il formate la réponse ; en cas d'erreur, il renvoie un code 404 sans jamais lever d'exception lourde.
  > - **Transition :** Ce contrôleur HTTP répond parfaitement au besoin d'une API. Mais pour notre interface utilisateur, nous voulons de la réactivité immédiate sans rechargement : c'est là qu'intervient Phoenix LiveView.

---

#### Slide 14 : Phoenix LiveView & PubSub Temps Réel
- **Type de slide** : slide
- **Titre (title-slide)** : LiveView & PubSub : Collaboration Temps Réel Native
- **Sous-titre (subtitle-slide)** : Synchronisation instantanée entre utilisateurs sans Redis ni polling JavaScript
- **Mise en page** : split-code
  - **Colonne Gauche (Explication Conceptuelle)** : card-featured
    - badge-solid : Rupture Technologique
    - Titre : La Triade Réactive de Phoenix
    - Liste (icon-bullet) :
      - 1. Abonnement PubSub (mount/3) : À l'ouverture du WebSocket, le client s'abonne au topic `"wallet:#{id}"` sur la BEAM.
      - 2. Événement utilisateur (handle_event) : Clic sur supprimer une dépense -> mise à jour en base et diffusion instantanée.
      - 3. Réception synchrone (handle_info) : Tous les membres connectés reçoivent `{:wallet_updated, id}` et leur affichage s'actualise.
      - Diffing minimal : Seuls les quelques octets modifiés transitent sur le WebSocket (moins de 10 ms de latence).
  - **Colonne Droite (Snippet de Code Réel)** : code-box
    - code-header : lib/les_bons_comptes_web/live/wallet_live/show.ex
    - Code (language-elixir) :
      defmodule LesBonsComptesWeb.WalletLive.Show do
        use LesBonsComptesWeb, :live_view
        alias LesBonsComptes.{Expenses, Wallets}

        # 1. Montage et abonnement au canal du porte-monnaie
        def mount(%{"id" => id}, _session, socket) do
          if connected?(socket) do
            Phoenix.PubSub.subscribe(LesBonsComptes.PubSub, "wallet:#{id}")
          end
          {:ok, assign(socket, wallet_id: id, wallet: Wallets.get_wallet!(id))}
        end

        # 2. Réaction à la suppression d'une dépense
        def handle_event("delete_expense", %{"id" => exp_id}, socket) do
          Expenses.delete_expense(socket.assigns.current_user, exp_id)
          {:noreply, socket |> put_flash(:info, "Dépense supprimée")}
        end

        # 3. Notification PubSub reçue par TOUS les participants
        def handle_info({:wallet_updated, wallet_id}, socket) do
          {:ok, data} = load_wallet_data(wallet_id)
          {:noreply, assign(socket, data)}
        end
      end
  - **Pied de slide** : banner
    - Révolution : Alice supprime une dépense -> l'écran de Bob ajuste ses soldes en direct sans recharger la page et sans une ligne de JS.
  - **Logo de slide** :
    - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Le joyau technique (3 min 30) :** Voici le code réel le plus représentatif de la force de Phoenix dans notre application.
  > - **L'abonnement PubSub :** Dans `mount`, chaque participant connecté au porte-monnaie s'abonne au topic `"wallet:#{id}"`.
  > - **Le déclencheur :** Dès qu'un utilisateur clique sur supprimer une dépense, l'événement `delete_expense` est traité côté serveur.
  > - **La synchronisation collective :** Dans `handle_info`, TOUS les membres reçoivent la notification de mise à jour. LiveView recalcule le diff et pousse les nouveaux chiffres sur chaque écran.
  > - **Bilan d'infrastructure :** Pas de serveur Node.js séparé, pas de cluster Redis, pas de Redux dans le navigateur. Tout est géré par la machine virtuelle BEAM en 25 lignes.
  > - **Transition :** Faut-il alors tout coder en LiveView ? C'est ce que nous récapitulons dans la matrice suivante.

---

#### Slide 15 : Matrice Décisionnelle : REST vs Phoenix LiveView
- **Type de slide** : slide
- **Titre (title-slide)** : Matrice Décisionnelle : Choisir l'Outil Adapté
- **Sous-titre (subtitle-slide)** : Pourquoi « Les bons comptes » combine harmonieusement contrôleurs HTTP et LiveView
- **Mise en page** : grid-2
  - **Colonne Gauche (Le Modèle HTTP / REST)** : card
    - badge-gray : Contrôleurs Standard (HTTP)
    - Titre : Cas d'Usage Recommandés
    - Liste (icon-bullet) :
      - APIs REST / JSON publiques : Endpoints exposés aux tiers ou applications mobiles (`SettlementController`).
      - Cookies d'authentification : Écriture sécurisée des en-têtes HTTP de session (`UserSessionController`).
      - Webhooks externes : Réception des callbacks de passerelles de paiement (Stripe).
      - Téléchargements de fichiers : Streaming de bilans ou d'exports comptables PDF/CSV.
  - **Colonne Droite (La Révolution LiveView)** : card-featured
    - badge-solid : Phoenix LiveView (WebSocket)
    - Titre : Cas d'Usage Privilégiés
    - Liste (icon-bullet) :
      - Interfaces collaboratives : Modification partagée et temps réel de dépenses (`WalletLive.Show`).
      - Formulaires réactifs : Validation en direct à la frappe sans duplication de code front/back.
      - Tableaux de bord dynamiques : Visualisation instantanée des soldes et des dettes croisées.
      - Productivité maximale : Élimination du boilerplate d'API REST pour la majorité des vues.
  - **Pied de slide** : banner
    - Synthèse : Phoenix n'impose aucun dogme : il associe la robustesse du HTTP classique à la réactivité d'une SPA moderne.
  - **Logo de slide** :
    - `bottom-left logo-sm` : `assets/logos/elixir.svg`
- **Notes présentateur (notes : data-notes ou speaker-notes)** :
  > - **Conclusion de mon passage (1 min 30) :** Pour résumer cette partie technique, Phoenix offre le meilleur des deux mondes.
  > - **L'équilibre dans notre projet :** Nous conservons des contrôleurs classiques pour notre API REST de règlements et pour la gestion des cookies de session.
  > - **Pour le reste :** LiveView prend en charge 90% de l'interface avec une réactivité et une économie de code incomparables.
  > - **Passage de relais vers la Démo :** Vous avez vu l'architecture et le code réel. Place maintenant à l'action : je passe la main à mon camarade pour la démonstration en direct de l'application « Les bons comptes » !
