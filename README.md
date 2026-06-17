# Loré Foundation — Site Web

Site vitrine moderne pour **Loré Foundation**, *« Votre partenaire en innovation
numérique »*, construit avec Next.js (App Router), React, TypeScript, Tailwind
CSS et Framer Motion.

## 🛠️ Panneau d'administration (`/admin`)

Le site a maintenant un panneau d'administration protégé par mot de passe,
où vous pouvez gérer **Portfolio, Services, Équipe et Témoignages** sans
toucher au code : ajouter/modifier/supprimer, uploader des photos, et tout
apparaît **immédiatement sur le site en ligne, sans redéploiement**.

Ça fonctionne avec [Supabase](https://supabase.com) (gratuit) qui héberge
la base de données et les images uploadées.

### Mise en place (une seule fois)

1. **Créez un projet Supabase** sur [supabase.com](https://supabase.com) (compte gratuit).
2. Dans **SQL Editor** → *New query*, collez tout le contenu de
   `supabase/schema.sql` et cliquez **Run**. Cela crée les tables et les
   remplit avec le contenu actuel du site (les 6 projets, les 9 services,
   l'équipe et les 3 témoignages).
3. Dans **Storage**, créez un bucket nommé exactement `media` et cochez
   **Public bucket** — c'est ici que les photos uploadées depuis `/admin`
   seront stockées.
4. Dans **Project Settings → API**, copiez :
   - `Project URL` → variable `SUPABASE_URL`
   - `service_role` key (⚠️ pas la clé `anon`) → variable `SUPABASE_SERVICE_ROLE_KEY`
5. Copiez `.env.local.example` en `.env.local` et remplissez les 4 variables
   (voir aussi `ADMIN_PASSWORD` et `SESSION_SECRET` ci-dessous).

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète **service_role** (jamais exposée au navigateur) |
| `ADMIN_PASSWORD` | Mot de passe pour se connecter à `/admin` |
| `SESSION_SECRET` | Chaîne aléatoire pour signer la session — générez-en une avec `openssl rand -hex 32` |

### Déploiement sur Vercel

1. Poussez ce projet sur GitHub, puis importez-le sur [vercel.com](https://vercel.com).
2. Dans **Project Settings → Environment Variables**, ajoutez les 4 mêmes
   variables que dans `.env.local`.
3. Déployez. Votre panneau d'administration sera disponible sur
   `https://votre-site.vercel.app/admin`.

### Utilisation

Allez sur `/admin`, entrez le mot de passe (`ADMIN_PASSWORD`), puis :
- **Portfolio** : créez un projet, uploadez plusieurs photos (glissez-les
  une à une avec le bouton "Ajouter"), réordonnez-les avec les flèches.
  Chaque projet ouvre une galerie cliquable sur le site public.
- **Services** : choisissez une icône dans la liste, et associez
  optionnellement un projet du portfolio (le bouton "Voir un projet" du
  service y renverra).
- **Équipe** : nom, rôle, initiales du badge, photo, et un interrupteur
  pour afficher ou non les réseaux sociaux.
- **Témoignages** : nom, rôle, citation, initiales.

Tout changement est visible sur le site **en quelques secondes**, sans
rebuild ni redéploiement — les sections concernées (`components/Portfolio.tsx`,
`Services.tsx`, `Team.tsx`, `Testimonials.tsx`) relisent Supabase à chaque
visite (`export const dynamic = "force-dynamic"` dans `app/page.tsx`).

> ℹ️ **Si Supabase n'est pas encore configuré** (variables manquantes), le
> site public continue de fonctionner normalement grâce à un contenu de
> repli défini dans `lib/data.ts` — mais le panneau `/admin` ne pourra pas
> enregistrer de changement avant que `SUPABASE_URL` et
> `SUPABASE_SERVICE_ROLE_KEY` soient renseignées.

> ℹ️ La section **"Pourquoi nous choisir"** (`components/WhyChooseUs.tsx`,
> avec ses panneaux "En savoir plus") n'est pas encore branchée au panneau
> d'administration — elle reste éditable uniquement dans `lib/data.ts` pour
> le moment.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

```bash
npm run build   # build de production
npm run start   # lancer le build de production
```

## 🎨 Système de design

| Élément | Valeur |
| --- | --- |
| Bleu foncé | `#0A3D62` (`lore-dark`) |
| Bleu vif (logo) | `#0F98FF` (`lore-emerald`) |
| Bleu clair | `#5AC8FF` (`lore-emerald-light`) |
| Or (accent) | `#F4B400` (`lore-gold`) |
| Fond clair | `#F5F8FC` (`lore-cream`) |
| Texte (mode clair) | `#0B1F33` (`lore-ink`) |
| Fond sombre | `#0B1B2E` (`lore-night`) |
| Cartes en mode sombre | `#142C46` (`lore-night-surface`) |
| Police titres | Bricolage Grotesque (`font-display`) |
| Police texte | Plus Jakarta Sans (`font-body`) |

### Logo

Le logo officiel (`public/logo.png`) est utilisé dans la navigation, le pied
de page et comme favicon. C'est une icône de main bleue en 3D représentant
la collaboration et l'impact.

### Mode clair / sombre

Le site inclut un sélecteur clair/sombre (`components/ThemeToggle.tsx`,
basé sur `next-themes`). Le mode est appliqué via la classe `.dark` sur
`<html>` et persiste entre les visites (localStorage). Les sections
"héro" et "témoignages" gardent un dégradé bleu foncé dans les deux modes ;
les sections claires (services, équipe, portfolio, contact) basculent entre
`lore-cream`/`white` et `lore-night`/`lore-night-surface`.

### Élément signature

Les cartes, cadres d'images et certains boutons utilisent une forme de
**"tab" / coin coupé**, accentuée par un petit carré or dans le coin —
un clin d'œil aux onglets de projets/dossiers, cohérent avec une agence
digitale. Voir `components/ui/TabCard.tsx` et les classes utilitaires
`.tab-corner`, `.tab-corner-lg`, `.tab-corner-sm`, `.tab-corner-alt` dans
`app/globals.css`.

Les transitions courbes entre sections (inspirées de la référence fournie)
sont gérées par `components/ui/CurveDivider.tsx`.

## 🖼️ Images

- **Portfolio, Équipe** : se gèrent maintenant depuis `/admin` (upload direct,
  voir section ci-dessus) — plus besoin de modifier le code.
- **Hero** (`components/Hero.tsx`) : portrait principal, fichier statique
  `public/hero-portrait.jpg` (remplacez le fichier directement, ou éditez
  le chemin dans le composant).
- `components/ui/AvatarPlaceholder.tsx` reste disponible comme repli visuel
  (dégradé + icône) pour tout nouvel emplacement qui n'aurait pas encore de
  photo.

## 📞 Coordonnées (lib/data.ts → siteInfo)

- Slogan : « L'excellence au cœur de l'impact »
- Adresse : Cap-Haïtien, Nord, Haïti
- Téléphones : +509 41 55 9094 / +509 34 82 3501
- Email : contact@lorefoundation.com

Pour modifier ces informations, éditez l'objet `siteInfo` dans `lib/data.ts` —
elles sont utilisées automatiquement dans le Footer et la section Contact.

## 📁 Structure du projet

```
app/
  layout.tsx        # polices, métadonnées SEO
  page.tsx          # assemble toutes les sections (rendu dynamique)
  globals.css       # styles globaux + forme "tab corner"
  admin/
    page.tsx        # tableau de bord (protégé par middleware.ts)
    login/          # page de connexion
    _components/    # panneaux Portfolio/Services/Équipe/Témoignages
  api/admin/         # routes CRUD + upload (utilisées par /admin)
components/
  Navbar.tsx
  Hero.tsx
  WhyChooseUs.tsx
  Services.tsx        # server component → lit Supabase (avec repli statique)
  Team.tsx             # server component → lit Supabase (avec repli statique)
  Portfolio.tsx         # server component → lit Supabase, rend PortfolioClient
  PortfolioClient.tsx   # grille + galerie interactive (client)
  Testimonials.tsx       # server component → lit Supabase, rend TestimonialsClient
  TestimonialsClient.tsx # carrousel interactif (client)
  Contact.tsx
  Footer.tsx
  ui/
    AnimatedSection.tsx   # révélations au scroll (Framer Motion)
    SectionHeading.tsx
    TabCard.tsx           # carte signature "coin coupé"
    Modal.tsx             # boîte de dialogue réutilisable
    PortfolioGallery.tsx  # galerie photo d'un projet
    ServiceIllustration.tsx
    AvatarPlaceholder.tsx
    CurveDivider.tsx
    Sparkle.tsx
lib/
  data.ts            # contenu de repli (utilisé si Supabase n'est pas configuré)
  supabase.ts         # client Supabase côté serveur uniquement
  auth.ts              # signature de la session admin
  icon-map.ts           # noms d'icônes ↔ composants Lucide
middleware.ts          # protège /admin et /api/admin
supabase/schema.sql     # tables + contenu de départ pour Supabase
```

## ♿ Accessibilité & performance

- Focus visible personnalisé (`.focus-ring`) sur tous les éléments interactifs.
- `prefers-reduced-motion` respecté (animations désactivées si demandé).
- Polices chargées via `next/font` (auto-hébergées, pas de requête externe).
- Sections découpées en composants pour un rendu et une maintenance optimisés.
