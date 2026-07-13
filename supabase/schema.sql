-- Loré Foundation — schéma de base de données + contenu de départ.
--
-- Marche à suivre :
--   1. Créez un projet sur https://supabase.com (gratuit).
--   2. Allez dans "SQL Editor" → "New query".
--   3. Collez tout ce fichier et cliquez "Run".
--   4. Allez dans "Storage" → créez un bucket nommé "media" et cochez "Public bucket".
--
-- Ce script peut être exécuté plusieurs fois sans erreur (IF NOT EXISTS partout),
-- mais les INSERT de départ ne s'exécutent que si les tables sont vides.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists portfolio_items (
  id text primary key,
  title text not null,
  category text not null default '',
  description text not null default '',
  images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'Sparkles',
  title text not null,
  description text not null default '',
  related_portfolio_id text references portfolio_items(id) on delete set null,
  sort_order int not null default 0
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  initials text not null default '',
  photo_url text,
  show_social boolean not null default false,
  sort_order int not null default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  initials text not null default '',
  sort_order int not null default 0
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_url text,
  link_label text,
  is_active boolean not null default true,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists seminars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz,
  location text not null default '',
  registration_open boolean not null default true,
  is_published boolean not null default true,
  media jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists seminar_registrations (
  id uuid primary key default gen_random_uuid(),
  seminar_id uuid not null references seminars(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Migrations pour les projets déjà existants : "create table if not exists"
-- ne modifie pas une table qui existe déjà, donc ces colonnes ajoutées dans
-- une version plus récente du site doivent être ajoutées explicitement ici.
-- Sans danger à rejouer plusieurs fois.
-- ─────────────────────────────────────────────────────────────────────────

alter table announcements add column if not exists notified_at timestamptz;
alter table seminars add column if not exists notified_at timestamptz;

-- ─────────────────────────────────────────────────────────────────────────
-- Sécurité : Row Level Security activée, mais sans aucune policy.
-- Cela bloque tout accès via la clé publique "anon" — seule la clé
-- "service_role" (utilisée uniquement côté serveur, jamais dans le
-- navigateur) peut lire/écrire. C'est ce que l'app utilise partout.
-- ─────────────────────────────────────────────────────────────────────────

alter table portfolio_items enable row level security;
alter table services enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table announcements enable row level security;
alter table seminars enable row level security;
alter table seminar_registrations enable row level security;
alter table subscribers enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Contenu de départ (reprend le contenu actuel du site)
-- ─────────────────────────────────────────────────────────────────────────

insert into portfolio_items (id, title, category, description, sort_order)
select * from (values
  ('lore-store-enligne', 'Loré Store Enligne', 'E-commerce',
   'Boutique en ligne complète avec catalogue de produits, panier et paiement, pensée pour offrir une expérience d''achat fluide et moderne aux clients en Haïti.', 0),
  ('miss-lore-salon', 'Miss Loré Salon', 'Application Mobile',
   'Application mobile de prise de rendez-vous pour salon de beauté : réservation en quelques clics, rappels automatiques et suivi client digitalisé.', 1),
  ('medicore-pro', 'MediCore Pro', 'Plateforme Santé',
   'Plateforme de gestion pour établissements de santé : dossiers patients, rendez-vous et outils intelligents pour fluidifier le suivi médical au quotidien.', 2),
  ('ewek-entreprise', 'EWEK Entreprise', 'Tableau de Bord',
   'Tableau de bord d''entreprise avec identité visuelle complète, conçu pour donner une vue claire et en temps réel des activités de l''organisation.', 3),
  ('recharge-express', 'Recharge Express', 'Application Web',
   'Application web de recharge et de services rapides, accompagnée de supports visuels et de contenus promotionnels pour renforcer la marque.', 4),
  ('ti-kane-epargne', 'Ti Kanè Épargne', 'Gestion Financière',
   'Solution de gestion financière et d''épargne communautaire, conçue pour aider les utilisateurs à suivre leurs cotisations et leur progression en toute simplicité.', 5)
) as v(id, title, category, description, sort_order)
where not exists (select 1 from portfolio_items);

insert into services (icon, title, description, related_portfolio_id, sort_order)
select * from (values
  ('Code2', 'Développement Web',
   'Sites vitrines, plateformes sur mesure et applications web rapides, sécurisées et évolutives.', 'lore-store-enligne', 0),
  ('Smartphone', 'Applications Mobiles',
   'Applications Android et iOS performantes, pensées pour une expérience fluide sur le terrain.', 'miss-lore-salon', 1),
  ('Palette', 'Design Graphique',
   'Identité visuelle, supports imprimés et créations graphiques qui reflètent votre image de marque.', 'ewek-entreprise', 2),
  ('Clapperboard', 'Montage Vidéo',
   'Vidéos promotionnelles, réseaux sociaux et contenus visuels qui captent l''attention.', 'recharge-express', 3),
  ('Megaphone', 'Publicité Digitale',
   'Stratégies publicitaires ciblées pour augmenter votre visibilité et générer des résultats concrets.', 'miss-lore-salon', 4),
  ('BrainCircuit', 'Intelligence Artificielle',
   'Automatisation, chatbots et outils intelligents pour optimiser vos processus métier.', 'medicore-pro', 5),
  ('Server', 'Hébergement Web',
   'Hébergement fiable et sécurisé avec maintenance continue pour garder votre site toujours en ligne.', 'ewek-entreprise', 6),
  ('Shirt', 'Sérigraphie',
   'Impression sur textiles et objets personnalisés pour vos événements et votre marque.', 'recharge-express', 7),
  ('Sparkles', 'Salon de Beauté',
   'Gestion moderne de salon : prise de rendez-vous, suivi client et expérience beauté digitalisée.', 'miss-lore-salon', 8)
) as v(icon, title, description, related_portfolio_id, sort_order)
where not exists (select 1 from services);

insert into team_members (name, role, initials, photo_url, show_social, sort_order)
select * from (values
  ('Lovedine Laguerre', 'CEO', 'LL', '/team/lovedine-laguerre.jpg', false, 0),
  ('Remy Sonnet', 'Co-fondateur', 'RS', '/team/remy-sonnet.jpg', true, 1)
) as v(name, role, initials, photo_url, show_social, sort_order)
where not exists (select 1 from team_members);

insert into testimonials (name, role, quote, initials, sort_order)
select * from (values
  ('Carline Mésidor', 'Fondatrice, Salon Belle Étoile',
   'Loré Foundation a transformé notre salon avec une application de réservation simple et élégante. Nos clientes adorent et notre organisation s''est nettement améliorée.', 'CM', 0),
  ('Frantz Désir', 'Directeur, EWEK Entreprise',
   'Une équipe à l''écoute, rapide et toujours disponible. Notre tableau de bord est désormais beaucoup plus clair et nous fait gagner un temps précieux chaque jour.', 'FD', 1),
  ('Naika Beauchard', 'Propriétaire, Loré Store Enligne',
   'Grâce à leur expertise, notre boutique en ligne tourne parfaitement et nos ventes ont augmenté. Un vrai partenaire de confiance pour notre croissance digitale.', 'NB', 2)
) as v(name, role, quote, initials, sort_order)
where not exists (select 1 from testimonials);

-- ─────────────────────────────────────────────────────────────────────────
-- Sponsors & Paiements
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null default '',
  email text not null,
  phone text not null default '',
  tier text not null default 'bronze' check (tier in ('bronze','silver','gold')),
  message text not null default '',
  logo_url text,
  website_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid references sponsors(id) on delete set null,
  purpose text not null default 'sponsor' check (purpose in ('sponsor','service','seminar','autre')),
  amount numeric(10,2) not null default 0,
  currency text not null default 'HTG',
  method text not null check (method in ('moncash','natcash','sogebank','autre')),
  sender_name text not null,
  sender_phone text not null default '',
  reference text not null default '',
  proof_url text,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table sponsors enable row level security;
alter table payments enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Méthodes de paiement configurables par l'admin
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('moncash','natcash','sogebank','autre')),
  label text not null,
  number text not null default '',
  details text not null default '',
  instructions text not null default '',
  icon text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table payment_methods enable row level security;

create unique index if not exists payment_methods_unique_entry
  on payment_methods (type, label, number);

-- Données initiales
insert into payment_methods (type, label, number, details, instructions, is_active, sort_order) values
  ('moncash',  'MonCash',  '+509 34 83 3501', 'Transfert rapide 24h/24', 'Ouvri MonCash → Transfert → Antre nimewo a → Konfime → Voye referans la', true, 1),
  ('natcash',  'NatCash',  '+509 41 55 9094', 'Transfert instantané sans frais', 'Ouvri NatCash → Transfert Lajan → Antre nimewo a → Valide → Kopye kòd la', true, 2),
  ('sogebank', 'Sogebank', 'Titulaire : LORÉ FOUNDATION' || chr(10) || 'Compte : 2470-0541-6317-0003' || chr(10) || 'Banque : Sogebank', 'Idéal pour les montants importants', 'Ale nan branch Sogebank → Fè vèsman → Non : LORÉ FOUNDATION → Kont : 2470-0541-6317-0003 → Konsève resi a', true, 3)
on conflict (type, label, number) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Blog & Articles
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  category text not null default 'actualites' check (
    category in ('technologie','education','ia','entrepreneuriat','activites','actualites','leadership')
  ),
  tags text[] not null default '{}',
  author_name text not null default 'Loré Foundation',
  author_photo text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  read_time_minutes integer not null default 5,
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Projets & Financement
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  short_desc text not null default '',
  category text not null default 'education' check (
    category in ('education','numerique','leadership','communaute','sante','autre')
  ),
  goal_amount numeric(12,2) not null default 0,
  raised_amount numeric(12,2) not null default 0,
  currency text not null default 'HTG',
  cover_url text,
  pdf_url text,
  media jsonb not null default '[]',
  location text not null default 'Cap-Haïtien, Haïti',
  beneficiaries integer not null default 0,
  start_date date,
  end_date date,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'actif' check (status in ('actif','complete','pause')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Projets à financer
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  short_desc text not null default '',
  category text not null default 'education' check (
    category in ('education','numerique','leadership','communaute','sante','autre')
  ),
  goal_amount numeric(12,2) not null default 0,
  raised_amount numeric(12,2) not null default 0,
  currency text not null default 'HTG',
  media jsonb not null default '[]',
  cover_url text,
  pdf_url text,
  location text not null default 'Cap-Haïtien, Haïti',
  beneficiaries integer not null default 0,
  start_date date,
  end_date date,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'actif' check (status in ('actif','termine','suspendu')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_donations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  donor_name text not null default 'Anonyme',
  donor_email text,
  amount numeric(10,2) not null default 0,
  currency text not null default 'HTG',
  method text not null default 'autre',
  message text not null default '',
  is_anonymous boolean not null default false,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  reference text not null default '',
  proof_url text,
  created_at timestamptz not null default now()
);

alter table projects enable row level security;
alter table project_donations enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Espace membre : comptes utilisateurs (Supabase Auth) + profils
-- ─────────────────────────────────────────────────────────────────────────
-- L'authentification elle-même (mot de passe, Google) est gérée par
-- Supabase Auth (schéma "auth", déjà fourni par Supabase — rien à créer
-- ici). Il faut seulement, dans le Dashboard Supabase :
--   1. Authentication → Providers → activer "Email".
--   2. Authentication → Providers → activer "Google" et renseigner le
--      Client ID / Client Secret Google (voir README pour les étapes).
--   3. Authentication → URL Configuration → ajouter l'URL de votre site
--      (ex: https://votre-site.vercel.app) dans "Redirect URLs".
--
-- La table `profiles` ci-dessous stocke les infos complémentaires (nom
-- complet, téléphone, photo) et se remplit automatiquement à l'inscription
-- grâce au trigger `on_auth_user_created`.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Crée automatiquement une ligne `profiles` dès qu'un compte est créé
-- (inscription email/mot de passe OU première connexion Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Relie les dons et inscriptions à un compte utilisateur quand la personne
-- est connectée au moment de l'action. Reste "null" pour les dons/paiements
-- faits sans compte (le tableau de bord rattrape aussi l'historique existant
-- en comparant l'adresse email).
alter table project_donations add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table payments add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table seminar_registrations add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists project_donations_user_id_idx on project_donations(user_id);
create index if not exists payments_user_id_idx on payments(user_id);
create index if not exists seminar_registrations_user_id_idx on seminar_registrations(user_id);
create index if not exists project_donations_donor_email_idx on project_donations(lower(donor_email));
create index if not exists seminar_registrations_email_idx on seminar_registrations(lower(email));
create index if not exists sponsors_email_idx on sponsors(lower(email));
