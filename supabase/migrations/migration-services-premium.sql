-- Loré Foundation — "Services Premium" : yon espas kote moun ka kòmande sèvis
-- espesifik tankou Carte Virtuelle, Booster Publication, elatriye, ak yon pri
-- klè ak yon bouton "Commander" ki mennen dirèkteman sou peman Binance.
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.

create extension if not exists pgcrypto;

create table if not exists premium_services (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null default '',
  price text not null default '',
  icon text not null default 'Sparkles',
  features jsonb not null default '[]',
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists premium_services_published_idx on premium_services(is_published, sort_order);

alter table premium_services enable row level security;

-- Kontni depa — ou ka modifye/ajoute/efase yo nan admin → Marketing → Services Premium
insert into premium_services (title, description, price, icon, features, is_featured, sort_order) values
(
  'Carte Virtuelle',
  'Une carte de paiement virtuelle sécurisée pour vos achats en ligne, abonnements et transactions internationales.',
  'À partir de 1 500 HTG',
  'CreditCard',
  '["Activation rapide", "Utilisable pour achats en ligne", "Support et assistance inclus", "Rechargeable"]'::jsonb,
  true,
  0
),
(
  'Booster Publication',
  'Boostez la visibilité de vos publications sur les réseaux sociaux pour toucher plus de clients et développer votre marque.',
  'À partir de 2 000 HTG',
  'TrendingUp',
  '["Ciblage par région ou intérêt", "Suivi des performances", "Recommandations personnalisées", "Résultats sous 48h"]'::jsonb,
  true,
  1
),
(
  'Pack Réseaux Sociaux',
  'Gestion complète de vos pages professionnelles : création de contenu, publications régulières et engagement communautaire.',
  'À partir de 5 000 HTG / mois',
  'Megaphone',
  '["Création de contenu visuel", "Publications hebdomadaires", "Rapport mensuel de performance", "Réponse aux messages"]'::jsonb,
  false,
  2
)
on conflict (title) do nothing;
