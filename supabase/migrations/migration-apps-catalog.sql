-- Loré Foundation — "Nos Applications" : yon galri kote ou ka ajoute plizyè
-- app (École Loré, ak nenpòt lòt app ou kreye pita), chak ak yon imaj, yon
-- fichye .exe pou Windows ak yon fichye .apk pou Android. Sit la detekte
-- otomatikman si vizitè a sou telefòn oswa sou òdinatè pou l ofri l bon
-- fichye a.
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje (if not exists).

create extension if not exists pgcrypto;

create table if not exists apps_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default '',
  icon_url text,

  -- Windows
  exe_url text,
  exe_version text not null default '1.0.0',
  exe_size_mb numeric not null default 0,

  -- Android
  apk_url text,
  apk_version text not null default '1.0.0',
  apk_size_mb numeric not null default 0,
  playstore_url text,

  website_url text,

  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists apps_catalog_published_idx on apps_catalog(is_published, sort_order);

alter table apps_catalog enable row level security;
