-- =============================================================================
-- Migration 11 : Policies RLS pour les donations Stripe
-- =============================================================================

-- Permet aux endpoints Nitro d'insérer des donations Stripe confirmées.
-- La vérification de paiement Stripe est faite côté serveur avant l'INSERT.
-- Contrainte : uniquement donation + stripe + completed — jamais depuis le client.
CREATE POLICY "ft_stripe_server_insert" ON financial_transactions
  FOR INSERT
  WITH CHECK (
    transaction_type = 'donation'
    AND provider = 'stripe'
    AND status = 'completed'
  );

-- Permet au rôle 'admin' de lire les transactions (en plus de 'back_office')
CREATE POLICY "ft_admin_select_all" ON financial_transactions
  FOR SELECT
  USING (get_user_role() = 'admin');
