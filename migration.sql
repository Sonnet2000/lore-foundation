-- ============================================================
-- Migration: Hero media + Portfolio vidéo support
-- Kopi epi paste nan Supabase SQL Editor pou ekzekite
-- ============================================================

-- 1. Tablo site_settings pou stoke paramèt global yo (hero, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'
);

-- Aktive Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Pèmèt lekti piblik (hero photo a bezwen li san otantifikasyon)
CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Sèlman sèvis role (server-side) ka ekri
CREATE POLICY "Service role can write site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Valè default pou hero section
INSERT INTO site_settings (key, value)
VALUES ('hero', '{"media": []}')
ON CONFLICT (key) DO NOTHING;


-- 2. Ajoute kolòn media[] nan portfolio_items pou sipòte foto + vidéo
--    (images[] egziste deja — nou kenbe li pou retrocompat)
ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]';

-- Migrate done egzistant: konvèti images[] → media[]
UPDATE portfolio_items
SET media = (
  SELECT jsonb_agg(jsonb_build_object('url', img, 'type', 'image'))
  FROM jsonb_array_elements_text(images::jsonb) AS img
)
WHERE media = '[]'::jsonb
  AND images IS NOT NULL
  AND jsonb_array_length(images::jsonb) > 0;

-- ============================================================
-- DONE — Ou ka retounen nan admin panel la kounye a
-- ============================================================
