-- =============================================================================
-- Migration 06 : Zombie Recovery — détection des transactions bloquées
--
-- PLAN SUPABASE :
--   Pro+ → ce fichier active pg_cron directement.
--   Free → commenter le bloc pg_cron ci-dessous et utiliser à la place
--           supabase/functions/zombie-recovery/index.ts (Edge Function).
--
-- DÉCISION ARCHITECTURALE (Story 1.2) :
--   Le trigger immuable sur financial_transactions empêche le UPDATE de status.
--   → Le zombie-recovery se limite à créer des alertes ops_alerts.
--   → Le reset manuel du status est géré par le back-office via une API dédiée
--     avec audit trail (implémentée en Story 5.1, séquence canonique).
-- =============================================================================

-- Vérifier si pg_cron est disponible avant d'exécuter ce bloc.
-- Sur plan Free : commenter tout ce qui suit et déployer l'Edge Function.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron'
  ) THEN
    -- Activer pg_cron
    CREATE EXTENSION IF NOT EXISTS pg_cron;

    -- Job : détection des transactions zombies toutes les 5 minutes.
    -- Crée une alerte ops pour chaque transaction bloquée en 'processing' > 30 min.
    PERFORM cron.schedule(
      'zombie-recovery',
      '*/5 * * * *',
      $job$
        INSERT INTO ops_alerts (type, payload, severity)
        SELECT
          'zombie_transaction',
          jsonb_build_object(
            'transaction_id', id,
            'ong_id',         ong_id,
            'stuck_since',    created_at,
            'retry_count',    retry_count
          ),
          CASE WHEN retry_count >= 3 THEN 'critical' ELSE 'warning' END
        FROM financial_transactions
        WHERE status = 'processing'
          AND created_at < NOW() - INTERVAL '30 minutes'
          AND NOT EXISTS (
            -- Éviter les doublons d'alertes pour la même transaction
            SELECT 1 FROM ops_alerts
            WHERE type = 'zombie_transaction'
              AND (payload->>'transaction_id')::text = financial_transactions.id::text
              AND resolved_at IS NULL
              AND created_at > NOW() - INTERVAL '1 hour'
          );
      $job$
    );

    RAISE NOTICE 'pg_cron zombie-recovery job scheduled successfully';
  ELSE
    RAISE NOTICE 'pg_cron not available on this plan — use Edge Function zombie-recovery instead';
  END IF;
END;
$$;
