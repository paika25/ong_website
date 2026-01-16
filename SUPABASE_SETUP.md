# 🚀 Configuration Supabase pour Nuxt Folio

Ce guide explique comment configurer Supabase pour utiliser votre base de données PostgreSQL avec l'application.

## 📋 Prérequis

1. Un compte Supabase (gratuit) : https://supabase.com
2. Les scripts SQL (`db_squelette.sql` et `db2_data.sql`)

## 🔧 Étape 1 : Créer un projet Supabase

1. Connectez-vous à https://app.supabase.com
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : `nuxt-folio-db` (ou votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche (ex: Europe West)
4. Cliquez sur **"Create new project"**
5. ⏳ Attendez 2-3 minutes que le projet soit créé

## 🗄️ Étape 2 : Créer les tables

1. Dans le tableau de bord Supabase, allez dans **"SQL Editor"** (icône </> dans le menu latéral)
2. Cliquez sur **"+ New Query"**
3. Copiez tout le contenu de `db_squelette.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **"Run"** (ou Ctrl+Enter)
6. ✅ Vous devriez voir "Success. No rows returned"

## 📊 Étape 3 : Insérer les données de test

1. Toujours dans le **SQL Editor**, créez une nouvelle requête
2. Copiez tout le contenu de `db2_data.sql`
3. Collez-le dans l'éditeur
4. Cliquez sur **"Run"**
5. ✅ Vous devriez voir les statistiques d'insertion

## 🔑 Étape 4 : Récupérer les clés API

1. Allez dans **"Settings"** > **"API"** dans le menu latéral
2. Vous verrez deux informations importantes :

   **Project URL** :
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

3. **Copiez ces deux valeurs** (gardez-les secrètes !)

## ⚙️ Étape 5 : Configurer les variables d'environnement

1. Dans votre projet Nuxt, créez un fichier `.env` à la racine :

```bash
# .env
NUXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

2. **Important** : Ajoutez `.env` dans votre `.gitignore` :

```bash
# .gitignore
.env
.env.*
!.env.example
```

## 🔒 Étape 6 : Configurer les politiques de sécurité (RLS)

Les politiques Row Level Security sont déjà créées dans `db_squelette.sql`.

Pour vérifier qu'elles sont actives :

1. Allez dans **"Authentication"** > **"Policies"**
2. Vous devriez voir les politiques pour chaque table :
   - `accounts` : 4 politiques
   - `ongs` : 4 politiques
   - `donations` : 4 politiques
   - etc.

## ✅ Étape 7 : Tester la connexion

1. Démarrez votre application :

```bash
npm run dev
```

2. Vérifiez la console du navigateur, vous devriez voir :

```
✅ 5 ONGs récupérées depuis Supabase
```

3. Si vous voyez `📦 Utilisation des données mockées`, vérifiez que :
   - Les variables d'environnement sont correctement définies
   - Vous avez redémarré le serveur après avoir créé `.env`

## 🎯 Mode Développement vs Production

### Mode Développement (sans Supabase)
Si `.env` n'est pas configuré, l'application utilisera automatiquement les données mockées.

### Mode Production (avec Supabase)
Une fois les variables configurées, l'application se connectera à Supabase automatiquement.

## 📊 Vérifier les données dans Supabase

1. Allez dans **"Table Editor"** dans le menu latéral
2. Sélectionnez la table `ongs`
3. Vous devriez voir 5 ONGs :
   - Éducation pour Tous Madagascar
   - Santé Communautaire Océan Indien
   - Reboisement Vert Madagascar
   - Solidarité Urbaine Tana
   - Culture et Patrimoine Malagasy

## 🔍 Comptes de test disponibles

Tous les comptes utilisent le mot de passe : **`password123`**

### Gestionnaires d'ONG (user_agent) :
- `marius@example.com`
- `marie.dubois@example.com`
- `sophie@education-madagascar.org`
- `jean.rakoto@sante-oi.mg`
- `paul@reboisement-mg.org`

### Partenaires/Donateurs (user_partner) :
- `contact@techforgood.mg`
- `info@fondation-sante.mg`
- `jean.rakoto.donor@example.com`
- `support@greenplanet.org`

## 🚨 Dépannage

### Erreur : "Invalid API key"
- Vérifiez que vous avez bien copié la **anon key** complète
- Vérifiez qu'il n'y a pas d'espaces au début/fin de la clé

### Erreur : "relation does not exist"
- Les tables n'ont pas été créées correctement
- Réexécutez `db_squelette.sql` dans le SQL Editor

### Toujours en mode mock
- Vérifiez que `.env` existe à la racine du projet
- Redémarrez le serveur (`npm run dev`)
- Vérifiez dans la console : les variables doivent être définies

### Erreur CORS
- C'est normal en développement local
- Supabase autorise automatiquement localhost

## 🌐 Déploiement sur Netlify

Quand vous déployez sur Netlify, ajoutez les variables d'environnement :

1. Allez dans **Site settings** > **Environment variables**
2. Ajoutez :
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

✨ Votre base de données est maintenant configurée et prête à l'emploi !
