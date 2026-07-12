-- Loré Foundation — Peman Binance (verifikasyon manyèl) + Kou anliy (leson videyo).
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Peman pou sèvis (demand peman ki pa gen rapò ak yon kou espesifik)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null default '',
  subject text not null,
  amount text not null default '',
  method text not null default 'binance',
  reference text not null default '',
  proof_url text,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists payment_requests_status_idx on payment_requests(status, created_at desc);

alter table payment_requests enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Peman pou enskripsyon nan yon kou (ajoute sou tab ki egziste deja a)
-- ─────────────────────────────────────────────────────────────────────────
alter table course_enrollments add column if not exists payment_method text;
alter table course_enrollments add column if not exists payment_reference text;
alter table course_enrollments add column if not exists payment_proof_url text;

-- ─────────────────────────────────────────────────────────────────────────
-- Fòma kou (an prezans / 100% anliy / iprid)
-- ─────────────────────────────────────────────────────────────────────────
alter table courses add column if not exists format text not null default 'in_person'
  check (format in ('online','in_person','hybrid'));

-- ─────────────────────────────────────────────────────────────────────────
-- Leson (videyo/kontni) pou chak kou — pou pati "kou anliy" la
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  video_url text,
  content text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists course_lessons_course_idx on course_lessons(course_id);

alter table course_lessons enable row level security;
