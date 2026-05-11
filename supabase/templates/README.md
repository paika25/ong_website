# Templates d'e-mails Supabase

Ce dossier contient les templates HTML des e-mails transactionnels envoyés par Supabase.

## Fichiers

| Fichier | Objet de l'e-mail | Usage |
|---|---|---|
| `confirmation.html` | Confirmez votre compte Paika | Envoyé à l'inscription pour valider l'adresse e-mail |

## Appliquer les templates dans Supabase

### Via le dashboard (recommandé)

1. Allez sur [app.supabase.com](https://app.supabase.com) → votre projet
2. Menu **Authentication** → **Email Templates**
3. Sélectionnez **Confirm signup**
4. Renseignez :
   - **Subject** : `Confirmez votre compte Paika`
   - **Body** : copiez-collez le contenu de `confirmation.html`
5. Cliquez **Save**

### Variables disponibles dans les templates

| Variable | Description |
|---|---|
| `{{ .ConfirmationURL }}` | URL complète de confirmation (token inclus) |
| `{{ .Email }}` | Adresse e-mail de l'utilisateur |
| `{{ .SiteURL }}` | URL de base du site |
| `{{ .Token }}` | Token seul (sans URL) |

## Durée de validité du lien

Par défaut Supabase expire les liens de confirmation après **24 heures**.
Ce délai est configurable dans **Authentication → Settings → Email OTP Expiry**.
