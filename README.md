# Milano Studio – Site de réservation

Frontend : Angular 18 • Backend : Node.js + Express + MongoDB (Atlas)

## Lancer
```bash
# Backend
cd backend && npm install && npm run dev      # fichier .env requis (voir .env.example)

# Frontend (autre terminal)
cd frontend && npm install && npm start       # http://localhost:4200
```

## Réglages
- `frontend/src/app/studio.config.ts` : email, téléphones, Instagram, Facebook, prix.
- `backend/.env` : `ADMIN_KEY` (mot de passe admin) et `MAX_SOIREES_PER_DAY` (3 par défaut).
- Logo : `frontend/src/assets/logo.jpg` et `logo-icon.png`.

## Limite de soirées par jour
Au-delà de `MAX_SOIREES_PER_DAY` soirées (en attente ou confirmées) pour une même date,
la date est refusée (message « date complète »). Une réservation annulée libère la place.

## Admin
`/admin` : statistiques, disponibilité des dates à venir, recherche, filtres, confirmer / annuler / supprimer.

## Email à chaque réservation
Chaque nouvelle réservation envoie un email à `NOTIFY_EMAIL` (par défaut `faresfaleh47@gmail.com`).
1. Dans `backend/.env`, renseignez `SMTP_USER` (adresse Gmail qui envoie) et `SMTP_PASS`.
2. `SMTP_PASS` est un « mot de passe d'application » Google : compte Google → Sécurité → Validation en 2 étapes (à activer) → Mots de passe des applications.
3. Relancez le backend (`npm install` puis `npm run dev`).
Sans ces deux valeurs, la réservation fonctionne quand même, mais aucun email n'est envoyé (un avertissement s'affiche dans la console).

## Flash de soirée (prêt / pas prêt)
- **Client** : page `/flash` (menu « Mon flash »). Il choisit *Homme*, *Femme* ou *Homme et femme* (mariage), saisit la date (et, pour un mariage, le prénom de l'homme et de la femme), et voit « prêt » ou « pas encore prêt ». Le formulaire de réservation d'un mariage demande maintenant ces deux prénoms.
  Si plusieurs soirées du même type ont lieu le même jour, on lui demande son nom pour identifier la sienne. Aucune donnée personnelle n'est affichée.
- **Monteur** : 3 clics rapides sur les **photos** de la page d'accueil (le cercle) → `/monteur` → mot de passe `MONTEUR_KEY` (à définir dans `backend/.env`, par ex. `MONTEUR_KEY=monteur-2026` — changez-le). Il ne voit que le suivi des flashs (bouton « Pas prêt » / « Prêt » par soirée).
- **Admin** : 3 clics rapides sur le **logo** (en haut ou en bas de page) → `/admin` → clé `ADMIN_KEY` : tableau de bord des réservations (sans le suivi des flashs).

## Sécurité
- **Mots de passe** : `ADMIN_KEY` et `MONTEUR_KEY` (12 caractères minimum, différents l'un de l'autre). Le serveur refuse de démarrer s'ils sont trop faibles ou absents. Le fichier `.env` n'est jamais envoyé sur GitHub.
- **Anti-force brute** : après 10 clés incorrectes en 15 minutes, l'adresse IP est bloquée un moment. Les clés sont comparées en temps constant.
- **Anti-spam** : 8 réservations par heure et par IP, 30 vérifications « Mon flash » par 10 minutes, 300 requêtes par 15 minutes au total.
- **CORS** : seuls les sites listés dans `ALLOWED_ORIGINS` peuvent appeler l'API depuis un navigateur.
- **Données** : tous les champs sont vérifiés (type, longueur), le prix est recalculé par le serveur, les envois de plus de 20 Ko sont refusés, aucune erreur technique n'est montrée aux visiteurs.
- **En-têtes HTTP** de sécurité sur toutes les réponses de l'API.
- **En ligne** : utilisez HTTPS (automatique chez Netlify, Vercel, Render), `NODE_ENV=production`, `TRUST_PROXY=1`, et dans MongoDB Atlas limitez l'accès réseau à votre hébergeur.
- Le CIN des clients est stocké en clair dans la base : limitez l'accès à Atlas et changez les mots de passe si besoin.
