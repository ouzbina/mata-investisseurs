# MATA GROUP — Positionnement des investisseurs

Application interne pour recueillir le positionnement officiel de chaque
investisseur/actionnaire (10 questions issues de la réunion des
investisseurs de septembre 2026), et un espace admin pour consulter et
exporter les réponses.

- **Formulaire public** : `/` — nom/prénom, pas d'authentification requise.
- **Espace admin** : `/admin` — protégé par mot de passe, tableau de bord
  avec statistiques + export CSV.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Prisma 7 (driver adapter `@prisma/adapter-pg`) + PostgreSQL
- Session admin : cookie signé (JWT via `jose`), pas de compte utilisateur

## Développement local

```bash
npm install
npx prisma dev --detach        # base Postgres locale embarquée par Prisma
npx prisma migrate dev
npm run dev
```

Copier `.env.example` vers `.env` et renseigner :

- `DATABASE_URL` — donnée par `prisma dev` en local
- `ADMIN_PASSWORD` — mot de passe de l'espace admin
- `SESSION_SECRET` — générer avec `openssl rand -base64 32`

## Déploiement sur Render

1. **Créer la base de données**
   - Sur [render.com](https://dashboard.render.com), New → PostgreSQL.
   - Nommer l'instance (ex. `mata-investisseurs-db`), région au choix,
     plan gratuit ou payant selon besoin.
   - Une fois créée, copier l'**Internal Database URL** (utilisée par le
     service web ci-dessous).

2. **Créer le service web**
   - New → Web Service → connecter le repo GitHub `mata-investisseurs`
     (pousser d'abord ce projet sur GitHub si ce n'est pas déjà fait).
   - Runtime : Node.
   - **Build Command** :
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command** :
     ```bash
     npm run start
     ```

3. **Variables d'environnement** (onglet Environment du service) :
   - `DATABASE_URL` = Internal Database URL de l'étape 1
   - `ADMIN_PASSWORD` = mot de passe choisi pour l'admin
   - `SESSION_SECRET` = générer une valeur aléatoire (`openssl rand -base64 32`)
   - `NODE_ENV` = `production`

4. **Déployer**
   - Render build et démarre automatiquement à chaque push sur la branche
     principale. La première mise en ligne applique les migrations
     (`prisma migrate deploy`) sur la base créée à l'étape 1.

5. **Vérification**
   - Ouvrir l'URL Render fournie → le formulaire investisseurs doit
     s'afficher.
   - Aller sur `/admin`, se connecter avec `ADMIN_PASSWORD`, vérifier que
     le tableau de bord se charge (0 réponse au départ) et que le bouton
     « Exporter en CSV » fonctionne.

### Mettre à jour le schéma plus tard

Toute nouvelle migration créée localement (`npx prisma migrate dev`) doit
être committée (dossier `prisma/migrations`) ; Render l'applique
automatiquement au prochain déploiement via `prisma migrate deploy` dans
le build command.
