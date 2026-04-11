# 🚀 Guide de Déploiement Netlify - Nuxt 3 SSR + API

## ✅ Configuration locale complétée

Les fichiers suivants ont été créés/configurés :
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `nuxt.config.ts` - Preset Netlify ajouté
- ✅ `.env.production` - Variables d'environnement

## 📋 Étapes de déploiement

### Option 1 : Déploiement via l'interface Netlify (Recommandé)

#### 1. **Créer un compte Netlify**
   - Allez sur https://app.netlify.com/signup
   - Connectez-vous avec GitHub

#### 2. **Importer le projet**
   ```
   Sites → Add new site → Import an existing project
   ```

#### 3. **Configurer le build**
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build` (déjà dans netlify.toml)
   - **Publish directory**: `.output/public` (déjà dans netlify.toml)
   - **Node version**: 18 (déjà configuré)

#### 4. **Variables d'environnement**
   Dans `Site settings → Environment variables`, ajoutez :
   ```
   NODE_VERSION = 18
   NUXT_PUBLIC_SITE_URL = https://votre-site.netlify.app
   ```

#### 5. **Deploy**
   - Cliquez sur "Deploy site"
   - Attendez le build (2-5 minutes)
   - Votre site sera disponible sur `https://random-name.netlify.app`

#### 6. **Configurer un domaine personnalisé** (optionnel)
   ```
   Site settings → Domain management → Add custom domain
   ```

---

### Option 2 : Déploiement via Netlify CLI

#### 1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

#### 2. **Login**
   ```bash
   netlify login
   ```

#### 3. **Initialiser**
   ```bash
   netlify init
   ```

#### 4. **Déployer**
   ```bash
   # Build local
   npm run build
   
   # Deploy
   netlify deploy --prod
   ```

---

## 🔧 Vérifications importantes

### ✅ SSR (Server-Side Rendering)
- Les pages seront rendues côté serveur
- Les composants avec `ClientOnly` fonctionneront
- Les routes API `/api/*` seront disponibles

### ✅ Routes API
Vos routes dans `server/api/` seront automatiquement déployées comme **Netlify Functions**

Exemple : 
```
/api/hello → /.netlify/functions/server/api/hello
```

### ✅ Assets statiques
Les fichiers dans `/public` seront servis directement par le CDN Netlify

---

## 🐛 Debugging

### Si le build échoue :

#### 1. **Erreur de mémoire**
   Ajoutez dans `netlify.toml` :
   ```toml
   [build.environment]
     NODE_OPTIONS = "--max-old-space-size=4096"
   ```

#### 2. **Erreur de dépendances**
   ```bash
   # Localement
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

#### 3. **Erreur SSR**
   Vérifiez que vous n'utilisez pas `window` ou `document` au niveau du setup
   ```vue
   <!-- ❌ Mauvais -->
   <script setup>
   const width = window.innerWidth
   </script>
   
   <!-- ✅ Bon -->
   <script setup>
   const width = ref(0)
   onMounted(() => {
     width.value = window.innerWidth
   })
   </script>
   ```

### Logs de déploiement
```bash
# Via CLI
netlify logs

# Via interface
Site → Deploys → [Votre deploy] → Deploy log
```

---

## 🎯 Optimisations post-déploiement

### 1. **Activer les Edge Functions**
   Netlify Edge Functions exécutent le code au plus près de l'utilisateur

### 2. **Configurer le cache**
   Le `netlify.toml` inclut déjà des headers de cache optimaux

### 3. **Activer les Build Plugins**
   ```toml
   [[plugins]]
     package = "@netlify/plugin-lighthouse"
   ```

### 4. **Split Testing (A/B Testing)**
   Netlify permet de tester plusieurs branches en production

---

## 📊 Monitoring

### Analytics Netlify
```
Site settings → Analytics → Enable Netlify Analytics
```

### Performance
- Core Web Vitals disponibles dans le dashboard
- Rapports Lighthouse automatiques

---

## 🔐 Sécurité

Le `netlify.toml` inclut déjà des headers de sécurité :
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Referrer-Policy`

---

## 💡 Commandes utiles

```bash
# Build local pour tester
npm run build
npm run preview

# Deploy preview (branche de test)
netlify deploy

# Deploy production
netlify deploy --prod

# Ouvrir le site
netlify open

# Voir les logs
netlify logs

# Variables d'environnement
netlify env:list
netlify env:set KEY value
```

---

## 📚 Ressources

- [Nuxt on Netlify](https://docs.netlify.com/integrations/frameworks/nuxt/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Nuxt Nitro Presets](https://nitro.unjs.io/deploy/providers/netlify)

---

## ⚠️ Limites Netlify Free Tier

- ✅ 100 GB bandwidth/mois
- ✅ 300 build minutes/mois
- ✅ Fonctions serverless: 125k requêtes/mois
- ⚠️ Timeout fonctions: 10s (26s sur Pro)
- ⚠️ Taille build: 2 GB max

---

## 🎉 C'est prêt !

Votre application Nuxt 3 avec SSR et routes API est maintenant configurée pour Netlify !

Pour déployer :
1. Push votre code sur GitHub
2. Connectez le repo à Netlify
3. Cliquez sur Deploy

🚀 **Bonne chance !**
