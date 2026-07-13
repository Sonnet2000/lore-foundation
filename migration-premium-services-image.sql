-- Loré Foundation — Ajoute yon foto pou chak "Service Premium".
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje.

alter table premium_services add column if not exists image_url text;
