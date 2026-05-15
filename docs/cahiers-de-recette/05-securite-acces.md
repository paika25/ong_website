# CR-05 — Sécurité et Contrôle d'Accès (RLS)

**Objectif** : Vérifier que Supabase RLS cloisonne réellement les données.  
Ces tests sont **bloquants** pour tout déploiement en production.  
Ils nécessitent les JWT de chaque compte (récupérables via DevTools → Application → localStorage → `sb-*-auth-token`).

---

## S1 — Isolation des dons (user_partner)

### S1-01 — PARTNER_A ne voit que ses dons dans le dashboard
`[ ]` `P1`

1. Connexion PARTNER_A → `/dashboard`
2. Relever la liste des dons et le total
3. Déconnecter → connexion PARTNER_B → relever sa liste
4. ✅ Les deux listes sont distinctes, aucun don de B dans la session de A

---

### S1-02 — Requête directe Supabase retourne uniquement ses propres dons
`[ ]` `P1`

```bash
curl -X GET "https://[SUPABASE_URL]/rest/v1/donations?select=*" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_PARTNER_A]"
```
✅ Toutes les lignes retournées ont `donor_account_id` = ID de PARTNER_A  
✅ Aucun don de PARTNER_B dans la réponse

---

### S1-03 — PARTNER_A ne peut pas créer un don au nom de PARTNER_B
`[ ]` `P1`

```bash
curl -X POST "https://[SUPABASE_URL]/rest/v1/donations" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_PARTNER_A]" \
  -H "Content-Type: application/json" \
  -d '{"donor_account_id":"[ID_PARTNER_B]","ong_id":"[ID_ONG_A]","amount":10}'
```
✅ Erreur RLS (violation de `WITH CHECK (auth.uid() = donor_account_id)`)  
✅ Aucune ligne insérée avec l'ID de PARTNER_B

---

## S2 — Isolation des ONGs (user_agent)

### S2-01 — AGENT_B ne peut pas modifier ONG_A via API directe
`[ ]` `P1`

```bash
curl -X PATCH "https://[SUPABASE_URL]/rest/v1/ongs?id=eq.[ID_ONG_A]" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_AGENT_B]" \
  -H "Content-Type: application/json" \
  -d '{"name":"ONG Compromise"}'
```
✅ Réponse : 0 lignes modifiées (RLS bloque silencieusement)  
✅ Nom de ONG_A inchangé en base

---

### S2-02 — AGENT_B ne peut pas créer une ONG au nom de AGENT_A
`[ ]` `P1`

```bash
curl -X POST "https://[SUPABASE_URL]/rest/v1/ongs" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_AGENT_B]" \
  -H "Content-Type: application/json" \
  -d '{"account_id":"[ID_AGENT_A]","name":"Fausse ONG"}'
```
✅ Erreur RLS (policy INSERT : `auth.uid() = account_id`)  
✅ Aucune ONG créée avec l'ID de AGENT_A

---

### S2-03 — Un user_partner ne peut pas créer une ONG
`[ ]` `P1`

```bash
curl -X POST "https://[SUPABASE_URL]/rest/v1/ongs" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_PARTNER_A]" \
  -H "Content-Type: application/json" \
  -d '{"account_id":"[ID_PARTNER_A]","name":"ONG Partenaire"}'
```
✅ Erreur (trigger `ensure_ong_owned_by_agent`)  
✅ Message : "L'ONG doit être liée à un compte de type user_agent"

---

### S2-04 — ONGs inactives invisibles pour un visiteur
`[ ]` `P1`

**Précondition** : ONG_B existe avec `status = 'pending'`

```bash
curl -X GET "https://[SUPABASE_URL]/rest/v1/ongs?select=id,name,status" \
  -H "apikey: [ANON_KEY]"
```
✅ ONG_B absente de la réponse  
✅ Seules les ONGs `status = 'active'` retournées

---

### S2-05 — AGENT_A voit son ONG inactive dans son dashboard
`[ ]` `P2`

**Précondition** : Passer ONG_A en `status = 'pending'`

1. Connexion AGENT_A → `/dashboard`
2. ✅ ONG_A toujours visible (la clause `auth.uid() = account_id` lui donne accès)

---

## S3 — Isolation des comptes

### S3-01 — Un utilisateur ne peut pas modifier le compte d'un autre
`[ ]` `P1`

```bash
curl -X PATCH "https://[SUPABASE_URL]/rest/v1/accounts?id=eq.[ID_PARTNER_B]" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [JWT_PARTNER_A]" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Compromis"}'
```
✅ 0 lignes modifiées (RLS UPDATE : `auth.uid() = id`)  
✅ Prénom de PARTNER_B inchangé

---

## S4 — Intégrité des triggers

### S4-01 — Trigger type : user_partner ne peut pas être manager d'ONG
`[ ]` `P1`

Tenter (via service_role ou SQL direct en staging) d'insérer dans `agent_ong_managers` avec `agent_account_id` = ID de PARTNER_A  
✅ Trigger `ensure_manager_is_agent` lève une exception  
✅ Message : "Seuls les user_agent peuvent gérer des ONGs"

---

### S4-02 — Trigger auto-permissions : créateur devient owner
`[ ]` `P2`

1. AGENT_B crée une nouvelle ONG
2. Vérifier dans `agent_ong_managers` l'entrée créée pour AGENT_B
3. ✅ `role = 'owner'`
4. ✅ Toutes les permissions à `true` (`manageProjects`, `manageDonations`, etc.)

---

### S4-03 — Trigger updated_at automatique
`[ ]` `P3`

1. Modifier le nom de ONG_A, sauvegarder
2. Lire `updated_at` en base avant et après
3. ✅ `updated_at` postérieur à la modification

---

## S5 — Middleware Nitro (couche API serveur)

Le middleware `server/middleware/auth.ts` est une deuxième couche de sécurité **au-dessus de RLS**. Il bloque les requêtes sans token avant même qu'elles atteignent Supabase.

### S5-01 — Route protégée sans token → 401
`[ ]` `P1`

```bash
curl http://localhost:3000/api/admin/dossiers
```
✅ `401 Non authentifié`

---

### S5-02 — Route admin avec token non-admin → 403
`[ ]` `P1`

```bash
curl http://localhost:3000/api/admin/dossiers \
  -H "Authorization: Bearer [JWT_AGENT_A]"
```
✅ `403 Rôle admin requis`  
✅ Le middleware lit `app_metadata.role` dans le JWT (pas `user_metadata` qui est modifiable par l'utilisateur)

---

### S5-03 — Route publique sans token → 200
`[ ]` `P2`

```bash
curl http://localhost:3000/api/score/ong/[ID_ONG]
# Pas de token
```
✅ `200` — routes publiques (`/api/ongs`, `/api/score/*`, `/api/donations/*`, webhooks) non bloquées

---

### S5-04 — Routes internes Nuxt non bloquées
`[ ]` `P2`

```bash
curl "http://localhost:3000/api/_nuxt_icon/heroicons.json?icons=credit-card"
```
✅ `200` — le middleware exclut toutes les routes `/api/_*`  
✅ Les icônes Nuxt UI se chargent sans erreur 401

---

### S5-05 — Token JWT falsifié → 401
`[ ]` `P1`

```bash
curl http://localhost:3000/api/ongs/[ID]/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmYWtlIn0.invalide"
```
✅ `401 Token invalide` (le parsing du payload échoue)

---

## Matrice de couverture RLS

| Table | SELECT | INSERT | UPDATE | DELETE | Tests |
|---|---|---|---|---|---|
| `accounts` | Public | — | `uid() = id` | — | S3-01 |
| `ongs` | Actives + siennes | Agent + `uid()=account_id` | Owner/Co-admin | — | S2-01 à S2-05 |
| `agent_ong_managers` | Ses lignes + ses ONGs | Owner ONG | Owner ONG | Owner ONG | S4-01, S4-02 |
| `partner_profiles` | `showProfile=true` + soi | user_partner | Soi | — | — |
| `donations` | Ses dons + dons vers ses ONGs | `uid()=donor_account_id` | — | — | S1-01 à S1-03 |
