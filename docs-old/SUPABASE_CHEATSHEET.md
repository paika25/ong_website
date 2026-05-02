# 🎯 Aide-mémoire Supabase

## Configuration rapide (5 minutes)

```bash
# 1. Créer un projet sur https://supabase.com
# 2. SQL Editor → Nouveau → Copier/coller db_squelette.sql → Run
# 3. SQL Editor → Nouveau → Copier/coller db2_data.sql → Run
# 4. Settings → API → Copier URL et anon key
# 5. Éditer .env et coller les valeurs
```

## Commandes

```bash
# Tester la connexion Supabase
npm run test:supabase

# Développement
npm run dev

# Build
npm run build
```

## Vérification rapide

### ✅ Supabase configuré
Console navigateur : `✅ X ONGs récupérées depuis Supabase`

### 📦 Mode mock
Console navigateur : `📦 Utilisation des données mockées`

## Structure base de données

```
accounts (9)          → Utilisateurs (agents + partenaires)
  ├── user_agent (5)  → Gestionnaires d'ONG
  └── user_partner (4) → Donateurs

ongs (5)              → Organisations
  ├── projects []     → Projets (JSONB)
  ├── financials {}   → Finances (JSONB)
  └── impact {}       → Impact (JSONB)

donations (18)        → Dons
  ├── completed (16)
  └── pending (2)

agent_ong_managers (7) → Gestion multi-ONG

partner_profiles (4)  → Profils donateurs
```

## Comptes de test

Mot de passe pour tous : `password123`

### Agents (gestionnaires)
```
marius@example.com
sophie@education-madagascar.org
jean.rakoto@sante-oi.mg
```

### Partenaires (donateurs)
```
contact@techforgood.mg
info@fondation-sante.mg
```

## Requêtes SQL utiles

```sql
-- Voir toutes les ONGs
SELECT name, category, status FROM ongs;

-- Voir les donations avec détails
SELECT 
  a.email as donateur,
  o.name as ong,
  d.amount,
  d.status
FROM donations d
JOIN accounts a ON d.donor_account_id = a.id
JOIN ongs o ON d.ong_id = o.id;

-- Statistiques donations par ONG
SELECT 
  o.name,
  COUNT(d.id) as nb_dons,
  SUM(d.amount) as total
FROM ongs o
LEFT JOIN donations d ON o.id = d.ong_id AND d.status = 'completed'
GROUP BY o.id, o.name
ORDER BY total DESC;
```

## Dépannage

| Problème | Solution |
|----------|----------|
| "Invalid API key" | Vérifier la clé dans .env |
| "relation does not exist" | Exécuter db_squelette.sql |
| Toujours en mock | Redémarrer le serveur |
| Données vides | Exécuter db2_data.sql |

## Documentation

- 📖 `SUPABASE_README.md` - Récapitulatif complet
- 📖 `SUPABASE_SETUP.md` - Guide pas à pas détaillé
- 🔧 `scripts/test-supabase.js` - Script de diagnostic

## Architecture

```
Application Nuxt
    ↓
lib/supabase.ts (Client)
    ↓
features/ong/services/ongService.ts
    ↓
USE_SUPABASE ?
    ├─ Oui → Supabase (.env configuré)
    └─ Non → Mock data (développement)
```

---

💡 **Astuce** : Gardez ce fichier sous la main pendant la configuration !
