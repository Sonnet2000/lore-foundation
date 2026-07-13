-- Loré Foundation — Korije doublon nan "Méthodes de paiement", ajoute yon icon
-- pou chak metòd, epi ajoute yon PDF pou chak pwojè.
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje.

-- ─────────────────────────────────────────────────────────────────────────
-- 1) Pwojè — yon PDF opsyonèl (bidjè, pwopozisyon, elatriye)
-- ─────────────────────────────────────────────────────────────────────────
alter table projects add column if not exists pdf_url text;

-- ─────────────────────────────────────────────────────────────────────────
-- 2) Méthodes de paiement — icon pèsonalizab pou chak metòd
-- ─────────────────────────────────────────────────────────────────────────
alter table payment_methods add column if not exists icon text;

-- ─────────────────────────────────────────────────────────────────────────
-- 3) Efase doublon ki te kreye lè schema.sql te egzekite plizyè fwa
--    (nou kenbe sèlman pi ansyen antre pou chak konbinezon type+label+number)
-- ─────────────────────────────────────────────────────────────────────────
delete from payment_methods a
using payment_methods b
where a.type = b.type
  and a.label = b.label
  and a.number = b.number
  and a.created_at > b.created_at;

-- Anpeche menm doublon sa yo rekreye si schema.sql egzekite ankò
create unique index if not exists payment_methods_unique_entry
  on payment_methods (type, label, number);
