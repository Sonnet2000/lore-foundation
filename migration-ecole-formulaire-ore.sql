-- Loré Foundation — Vrè fòmilè enskripsyon + orè kou (École).
--
-- 1) Ajoute yon "orè" (horaire) pou chak kou, pou l afiche sou sit la.
-- 2) Ajoute vrè enfo elèv sou chak demand enskripsyon (non, telefòn, adrès,
--    dat nesans, dokiman idantite) — kaptire dirèkteman nan fòmilè École a,
--    pa depann de pwofil kont jeneral itilizatè a (ki ka vid oswa demode).
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje (if not exists).

alter table courses add column if not exists schedule text not null default '';

alter table course_enrollments add column if not exists full_name text not null default '';
alter table course_enrollments add column if not exists phone text not null default '';
alter table course_enrollments add column if not exists address text not null default '';
alter table course_enrollments add column if not exists birth_date date;
alter table course_enrollments add column if not exists id_document_url text;

-- 3) Frè separe: enskripsyon, patisipasyon (`price` ki te la deja), ak
--    maliyo+badj/lòt materyèl — chak youn ka soumèt/verifye poukont li,
--    pa gen obligasyon peye tout yo yon sèl kou.
alter table courses add column if not exists registration_fee text not null default '';
alter table courses add column if not exists materials_fee text not null default '';
alter table course_enrollments add column if not exists fees jsonb not null default '{}'::jsonb;

