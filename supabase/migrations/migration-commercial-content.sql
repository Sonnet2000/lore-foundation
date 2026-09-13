-- Loré Foundation — ranplase kontni "Sèvis" ak "Reyalizasyon" ki nan Supabase
-- pou yo matche ak nouvo pozisyònman komèsyal/lekòl la (pa gen plis kontni
-- ki pale de don/bénévolat/bourse ladan yo ankò).
--
-- ATANSYON : sa a EFASE tout ran ki egziste nan `services` ak `portfolio_items`
-- pou ranplase yo ak nouvo yo. Si ou te fè chanjman manyèl nan panèl admin
-- pou seksyon sa yo, sove yo anvan ou kouri script sa a.
--
-- Kopye tout fichye sa a → Supabase → SQL Editor → New query → Run.

delete from services;
delete from portfolio_items;

-- ─────────────────────────────────────────────────────────────────────────
-- Reyalizasyon (portfolio_items) — dwe ale anvan sèvis yo (FK)
-- ─────────────────────────────────────────────────────────────────────────
insert into portfolio_items (id, title, category, description, images, sort_order) values
('developpement-web', 'Sites Web & Plateformes Sur Mesure', 'Développement Web',
 'Conception et développement de sites web et plateformes de gestion pour des entreprises et organisations à Cap-Haïtien, incluant sites vitrines, plateformes de gestion et applications métier.',
 '{}', 0),
('ecole-formations', 'Formations École Loré', 'Formation Professionnelle',
 'Plus de 500 étudiants formés en développement web, design graphique et compétences numériques à travers nos cours pratiques avec suivi de devoirs en ligne.',
 '{}', 1),
('design-graphique', 'Identités Visuelles & Design', 'Design Graphique',
 'Création de logos, chartes graphiques et supports visuels pour des dizaines d''entreprises et organisations locales souhaitant une image de marque professionnelle.',
 '{}', 2),
('serigraphie', 'Impression & Sérigraphie', 'Impression',
 'Production de t-shirts, casquettes et supports personnalisés pour entreprises, écoles et événements à travers le Nord d''Haïti.',
 '{}', 3),
('depannage-informatique', 'Service de Dépannage', 'Support Technique',
 'Réparation et assistance technique pour des centaines de particuliers et d''entreprises : ordinateurs, téléphones et logiciels.',
 '{}', 4),
('gestion-projets', 'Accompagnement de Projets Digitaux', 'Gestion de Projets',
 'Accompagnement de bout en bout d''organisations locales dans la digitalisation de leurs opérations, de la planification à la mise en œuvre.',
 '{}', 5)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- ─────────────────────────────────────────────────────────────────────────
-- Sèvis (services)
-- ─────────────────────────────────────────────────────────────────────────
insert into services (icon, title, description, related_portfolio_id, sort_order) values
('Code2', 'Développement web & logiciel',
 'Sites web, applications et logiciels de gestion sur mesure, conçus pour les besoins réels des entreprises haïtiennes.',
 'developpement-web', 0),
('Rocket', 'École — Formations professionnelles',
 'Cours pratiques en développement web, design graphique et compétences numériques, avec devoirs et suivi en ligne.',
 'ecole-formations', 1),
('Palette', 'Design graphique',
 'Logos, identités visuelles, supports imprimés et digitaux qui donnent à votre marque une image professionnelle.',
 'design-graphique', 2),
('Shirt', 'Sérigraphie & impression',
 'Impression de t-shirts, casquettes et supports personnalisés pour entreprises, écoles et événements.',
 'serigraphie', 3),
('Wrench', 'Dépannage informatique',
 'Réparation d''ordinateurs et de téléphones, installation de logiciels et assistance technique rapide.',
 'depannage-informatique', 4),
('Smartphone', 'Recharge & services mobiles',
 'Recharge de crédit, transferts et services mobiles pratiques pour particuliers et petits commerces.',
 null, 5),
('Shield', 'Cybersécurité & audit',
 'Sensibilisation, audits de base et bonnes pratiques pour protéger les données de votre entreprise.',
 null, 6),
('Server', 'Gestion de projets digitaux',
 'Accompagnement de bout en bout pour vos projets numériques : planification, exécution et suivi.',
 'gestion-projets', 7),
('Users', 'Consultation & accompagnement',
 'Conseils personnalisés pour digitaliser votre commerce ou organisation, adaptés au contexte local.',
 null, 8);
