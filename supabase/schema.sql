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
