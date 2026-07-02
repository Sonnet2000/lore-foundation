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
DROP POLICY IF EXISTS "Service role can manage page_views" ON page_views;
CREATE POLICY "Service role can manage page_views"
  ON page_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_path_idx        ON page_views (path);
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx   ON page_views (visitor_id);

-- ============================================================
-- Kowòdone kontak & rezo sosyal (telefòn, imèl, adrès, lyen
-- Facebook/Instagram/TikTok/YouTube/Telegram/WhatsApp/elt.)
-- egzekitab depi pati "Contenu → Coordonnées" nan admin la.
-- Sèvi ak menm tab "site_settings" ki deja egziste pou "hero".
-- ============================================================
INSERT INTO site_settings (key, value)
VALUES (
  'contact',
  '{
    "phones": ["+509 41 55 9094", "+509 34 82 3501"],
    "email": "contact@lorefoundation.com",
    "address": "Cap-Haïtien, Nord, Haïti",
    "whatsappNumber": "50941559094",
    "socialLinks": [
      {"id":"default-facebook","platform":"facebook","label":"Facebook","url":"https://m.facebook.com/story.php?story_fbid=pfbid02r7f2egh23aUwKjVPp6z1J1Rjo97Q3KHHCt5Qc99xkex1VFRgVbc4aTbeUcmED6xTl&id=61589651334475"},
      {"id":"default-instagram","platform":"instagram","label":"Instagram","url":"https://www.instagram.com/lore_foundation?igsh=aWgwbWhlcmF4eTVl"},
      {"id":"default-whatsapp","platform":"whatsapp","label":"WhatsApp","url":"https://wa.me/message/QSQVE7F4WDBGF1"}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- DONE — Ou ka retounen nan admin panel la kounye a
-- ============================================================
