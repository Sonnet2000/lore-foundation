-- ============================================================
-- Migration: Estatistik vizit (page_views) pou nouvo pati
-- "Itilizatè & Estatistik" nan admin la.
-- Kopi epi paste nan Supabase SQL Editor pou ekzekite.
-- ============================================================

-- Chak liy = yon paj yon moun gade sou sit la piblik la.
CREATE TABLE IF NOT EXISTS page_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path        TEXT NOT NULL,
  visitor_id  TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer    TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Pa gen aksè piblik an lekti — sèlman API admin (service role) ka li done sa yo.
-- Ekriti a fèt tou via service role nan /api/track (pa gen policy "public insert"
-- expre pou anpeche moun voye done fo dirèkteman soti nan navigatè a).
CREATE POLICY "Service role can manage page_views"
  ON page_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_path_idx        ON page_views (path);
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx   ON page_views (visitor_id);

-- ============================================================
-- DONE — Ou ka retounen nan admin panel la kounye a
-- ============================================================
