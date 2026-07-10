-- Loré Foundation — extension "École" (pòtal elèv : kou, enskripsyon, devwa).
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje (if not exists / if not exists).

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Kou (courses)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text,
  price text not null default '',
  duration text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Enskripsyon nan yon kou (dwe apwouve pa admin anvan elèv gen aksè)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  note text not null default '',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (course_id, user_id)
);

create index if not exists course_enrollments_course_idx on course_enrollments(course_id);
create index if not exists course_enrollments_user_idx on course_enrollments(user_id);
create index if not exists course_enrollments_status_idx on course_enrollments(status);

-- ─────────────────────────────────────────────────────────────────────────
-- Devwa (assignments) — pou chak kou
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  attachment_url text,
  due_at timestamptz,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists assignments_course_idx on assignments(course_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Soumisyon elèv pou yon devwa (tèks, lyen, ak/oswa fichye)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  text_response text not null default '',
  link_url text,
  file_url text,
  status text not null default 'submitted' check (status in ('submitted','graded')),
  grade text,
  feedback text,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  unique (assignment_id, user_id)
);

create index if not exists submissions_assignment_idx on assignment_submissions(assignment_id);
create index if not exists submissions_user_idx on assignment_submissions(user_id);

-- RLS aktive — tout aksè pase pa API routes yo (service_role), menm jan ak rès sit la.
alter table courses enable row level security;
alter table course_enrollments enable row level security;
alter table assignments enable row level security;
alter table assignment_submissions enable row level security;
