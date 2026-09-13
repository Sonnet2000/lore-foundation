-- Loré Foundation — extension "Publicité" (espas piblisitè ak foto, deskripsyon, lyen).
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje.

create extension if not exists pgcrypto;

create table if not exists advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null,
  link_url text,
  cta_label text not null default 'En savoir plus',
  is_published boolean not null default true,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists advertisements_published_idx on advertisements(is_published, sort_order);

alter table advertisements enable row level security;
