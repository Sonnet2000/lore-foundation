-- Loré Foundation — ajoute pwojè "Centre de Formation en Informatique de Milot"
-- nan seksyon "Nos Projets" sit la (tab `projects`).
--
-- Kopye tout fichye sa a, kole l nan Supabase → SQL Editor → New query → Run.

insert into projects (
  title,
  slug,
  short_desc,
  description,
  category,
  goal_amount,
  raised_amount,
  currency,
  cover_url,
  media,
  location,
  beneficiaries,
  start_date,
  end_date,
  is_published,
  is_featured,
  status,
  sort_order
) values (
  'Centre de Formation en Informatique de Milot',
  'centre-formation-informatique-milot',
  'Un centre de formation moderne pour outiller la jeunesse de Milot aux métiers du numérique — programmation, IA, design, cybersécurité et entrepreneuriat.',
  '<p>Milot, commune au riche patrimoine historique du département du Nord, ne dispose aujourd''hui d''aucun centre moderne de formation en informatique. De nombreux jeunes doivent se déplacer jusqu''à Cap-Haïtien pour accéder à une formation technologique — un coût que beaucoup de familles ne peuvent pas assumer.</p>

<p>Loré Foundation lance donc le <strong>Centre de Formation en Informatique de Milot</strong>, un espace moderne et accessible dédié à l''apprentissage des compétences numériques les plus recherchées : informatique de base, bureautique, programmation, intelligence artificielle, design graphique, maintenance informatique, cybersécurité et entrepreneuriat numérique.</p>

<h2>Pourquoi ce centre ?</h2>
<p>L''absence d''une offre de formation locale entraîne un accès limité aux compétences numériques, un taux de chômage élevé chez les jeunes, et une migration des talents vers les grandes villes. Ce centre vient combler ce vide en rapprochant la formation de la communauté.</p>

<h2>Ce que le centre va offrir</h2>
<ul>
<li>Des formations pratiques en informatique, programmation, IA, design graphique et cybersécurité</li>
<li>Un accompagnement vers l''emploi, le travail à distance et l''entrepreneuriat numérique</li>
<li>Une certification remise à chaque participant ayant réussi sa formation</li>
<li>Un environnement propice à l''innovation et à des projets concrets</li>
</ul>

<h2>Objectifs chiffrés</h2>
<ul>
<li>100 à 150 apprenants formés chaque année</li>
<li>300 à 450 jeunes, enfants et adultes formés sur 3 ans</li>
<li>Lancement officiel prévu le 31 août 2026</li>
</ul>

<h2>Budget du projet</h2>
<p>Le budget prévisionnel sur 3 ans s''élève à <strong>20 000 USD</strong>, réparti entre équipements (5 400 $), aménagement (800 $), fonctionnement (5 400 $) et ressources humaines (8 400 $) — soit un coût moyen d''environ 44 à 67 USD par apprenant formé.</p>

<h2>Appel à partenariat</h2>
<p>Loré Foundation invite les institutions publiques, universités, entreprises privées, ONG et agences de coopération internationale à s''associer à ce projet, que ce soit par un financement, un don d''équipements, la mise à disposition de formateurs, un appui à la certification ou une mise en réseau avec d''autres partenaires.</p>

<blockquote>À moyen terme, ce centre a pour ambition de devenir un véritable Campus Numérique — une référence du Nord d''Haïti en formation technologique et en accompagnement des jeunes vers l''emploi et l''entrepreneuriat.</blockquote>',
  'numerique',
  20000,
  0,
  'USD',
  null,
  '[]'::jsonb,
  'Milot, Département du Nord, Haïti',
  450,
  '2026-08-31',
  null,
  true,
  true,
  'actif',
  -1
)
on conflict (slug) do update set
  title = excluded.title,
  short_desc = excluded.short_desc,
  description = excluded.description,
  category = excluded.category,
  goal_amount = excluded.goal_amount,
  currency = excluded.currency,
  location = excluded.location,
  beneficiaries = excluded.beneficiaries,
  start_date = excluded.start_date,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();
