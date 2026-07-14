-- Loré Foundation — Korije baz done "École" (kou, peman, leçons).
--
-- Kòd la (lib/school.ts, CoursesPanel, KouListView, admin API) te deja ekri pou
-- itilize: yon "format" pou chak kou, peman/prèv peman sou demand enskripsyon,
-- ak yon tab "course_lessons" pou videyo leçons yo — men migration-ecole.sql
-- orijinal la pa t janm kreye moso sa yo. Se sa k fè: chwa "Fòma" nan admin pa
-- t janm anrejistre, peman ak prèv peman lan te bay erè baz done lè yon elèv
-- eseye peye pou enskri, e paj "Leçons" nan admin pa t ka fonksyone ditou.
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.
-- Li ka egzekite plizyè fwa san danje (if not exists / if not exists).

-- ─────────────────────────────────────────────────────────────────────────
-- 1) Kou — ajoute fòma (an prezans / 100% anliy / ibrid)
-- ─────────────────────────────────────────────────────────────────────────
alter table courses
  add column if not exists format text not null default 'in_person';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'courses_format_check'
  ) then
    alter table courses
      add constraint courses_format_check check (format in ('online', 'in_person', 'hybrid'));
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 2) Enskripsyon — enfo peman (Binance Pay, referans, kapti ekran)
-- ─────────────────────────────────────────────────────────────────────────
alter table course_enrollments add column if not exists payment_method text;
alter table course_enrollments add column if not exists payment_reference text;
alter table course_enrollments add column if not exists payment_proof_url text;

-- ─────────────────────────────────────────────────────────────────────────
-- 3) Leçons (videyo + kontni) — pou elèv apwouve yo, pa kou
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
