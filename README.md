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
   `supabase/schema.sql` et cliquez **Run**. Cela crée les tables (y compris
   `announcements` et `seminars`, voir plus bas) et les remplit avec le
   contenu actuel du site. Le script est rejouable sans danger
   (`create table if not exists`) — si vous avez déjà un projet Supabase
   existant, relancez-le simplement pour ajouter les nouvelles tables sans
   toucher à vos données actuelles.
3. Dans **Storage**, créez un bucket nommé exactement `media` et cochez
   **Public bucket** — c'est ici que les photos et vidéos uploadées depuis
   `/admin` seront stockées. Vérifiez aussi la **limite de taille de
   fichier** du bucket (Storage → `media` → *Edit bucket*) et augmentez-la
   à au moins **80 Mo** pour permettre l'envoi de courtes vidéos.
4. Dans **Project Settings → API**, copiez :
   - `Project URL` → variables `SUPABASE_URL` **et** `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (⚠️ jamais exposée au navigateur) → `SUPABASE_SERVICE_ROLE_KEY`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (cette clé est
     *faite* pour être publique : aucune table n'y est accessible, elle ne
     sert qu'à l'envoi direct des fichiers vers Storage)
5. Copiez `.env.local.example` en `.env.local` et remplissez les variables
   (voir aussi `ADMIN_PASSWORD` et `SESSION_SECRET` ci-dessous).

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL de votre projet Supabase (côté serveur) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète **service_role** (jamais exposée au navigateur) |
| `NEXT_PUBLIC_SUPABASE_URL` | Même URL, exposée au navigateur pour l'envoi de fichiers |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé **anon public**, exposée au navigateur (sans danger, voir plus haut) |
| `ADMIN_PASSWORD` | Mot de passe pour se connecter à `/admin` |
| `SESSION_SECRET` | Chaîne aléatoire pour signer la session — générez-en une avec `openssl rand -hex 32` |

> 🔑 **Problème de connexion à `/admin` malgré un mot de passe correct ?**
> Sur Vercel, ajouter ou modifier une variable d'environnement ne suffit pas :
> il faut **redéployer** (Deployments → ⋯ → *Redeploy*) pour qu'elle prenne
> effet. Vérifiez aussi qu'il n'y a pas d'espace ou de retour à la ligne
> collé par erreur à la fin de `ADMIN_PASSWORD` ou `SESSION_SECRET` (le code
> ignore désormais ces espaces automatiquement, mais une vieille valeur mal
> copiée peut quand même bloquer la connexion tant qu'elle n'est pas
> corrigée et redéployée), et que la variable est bien activée pour
> l'environnement **Production**.

### Déploiement sur Vercel

1. Poussez ce projet sur GitHub, puis importez-le sur [vercel.com](https://vercel.com).
2. Dans **Project Settings → Environment Variables**, ajoutez les mêmes
   variables que dans `.env.local` (6 au total désormais).
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
- **Annonces** : un court message (avec lien optionnel) affiché dans une
  bannière en haut du site, juste au-dessus du menu. Une seule annonce
  active s'affiche à la fois (la plus récente) ; chaque visiteur peut la
  fermer (ce choix est mémorisé dans son navigateur jusqu'à la prochaine
  annonce).
- **Séminaires** : titre, date/heure, lieu, description, et une galerie de
  photos **et courtes vidéos**. La section « Séminaires » du site public
  n'apparaît que si au moins un séminaire est *publié*. Désactivez
  « Inscriptions ouvertes » (sans dépublier) une fois les places comblées —
  le bouton « S'inscrire » devient alors « Inscriptions fermées ». Les
  personnes inscrites apparaissent dans « Voir les inscriptions » sous
  chaque séminaire (nom, email, téléphone).

Tout changement est visible sur le site **en quelques secondes**, sans
rebuild ni redéploiement — les sections concernées relisent Supabase à
chaque visite (`export const dynamic = "force-dynamic"` dans `app/page.tsx`).

> ℹ️ **Si Supabase n'est pas encore configuré** (variables manquantes), le
> site public continue de fonctionner normalement grâce à un contenu de
> repli défini dans `lib/data.ts` — mais le panneau `/admin` ne pourra pas
> enregistrer de changement avant que `SUPABASE_URL` et
> `SUPABASE_SERVICE_ROLE_KEY` soient renseignées. Pour les Annonces et
> Séminaires, le repli est simplement « rien ne s'affiche » tant qu'aucun
> contenu n'a été créé.

> ℹ️ La section **"Pourquoi nous choisir"** (`components/WhyChooseUs.tsx`,
> avec ses panneaux "En savoir plus") n'est pas encore branchée au panneau
> d'administration — elle reste éditable uniquement dans `lib/data.ts` pour
> le moment.

### 👋 Écran d'accueil (welcome screen)

À sa première visite, chaque personne voit un écran plein écran (logo +
message) lui proposant soit de **créer un compte avec son email** (pour être
notifiée des prochaines annonces/séminaires), soit de **continuer sans
compte**. Ce choix est mémorisé dans son navigateur — l'écran ne réapparaît
plus ensuite. Les emails collectés apparaissent dans l'onglet **Abonnés** du
panneau admin, avec un bouton pour tout copier.

Pour notifier réellement ces abonnés par email, configurez
[Resend](https://resend.com) (palier gratuit disponible) :

1. Créez un compte sur resend.com.
2. **Settings → API Keys** → créez une clé → copiez-la dans `RESEND_API_KEY`.
3. **Domains** → ajoutez et vérifiez votre propre domaine (ex: `lorefondation.com`),
   sinon Resend ne vous laissera envoyer qu'à votre propre adresse (utile
   seulement pour tester).
4. Renseignez `RESEND_FROM_EMAIL` (ex: `Loré Foundation <notifications@lorefondation.com>`)
   et `SITE_URL` (l'URL de votre site, utilisée pour le bouton dans l'email).

Une fois configuré, chaque Annonce active et chaque Séminaire publié affiche
un bouton **"Notifier les abonnés"** (icône ✈️) dans le panneau admin — il
envoie un email à tous les abonnés et garde une trace de la date d'envoi.
Sans ces variables, le bouton reste utilisable mais affiche une erreur claire
au lieu d'envoyer un email — rien ne casse, ça reste juste désactivé.

### 📤 Comment fonctionnent les envois de photos/vidéos

Les fichiers envoyés depuis `/admin` (photos de projets, photos d'équipe,
médias de séminaire) vont **directement du navigateur vers Supabase
Storage**, et non via notre serveur Vercel. C'est nécessaire car les
fonctions serverless de Vercel refusent toute requête de plus de **4,5 Mo**
— une limite trop basse pour des vidéos, et même pour certaines photos de
téléphone. Notre serveur se contente de générer un lien d'envoi signé et
temporaire (`/api/admin/upload-url`), puis le navigateur envoie le fichier
lui-même directement à Supabase. C'est pourquoi `NEXT_PUBLIC_SUPABASE_URL`
et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont nécessaires (voir plus haut).

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
| Or (accent) | `#D4AF37` (`lore-gold`), avec `lore-gold-light` `#F2D272` et `lore-gold-dark` `#9C7A1F` |
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
  globals.css       # styles globaux + forme "tab corner" + bouton or premium
  admin/
    page.tsx        # tableau de bord (protégé par middleware.ts)
    login/          # page de connexion
    _components/    # panneaux Portfolio/Services/Équipe/Témoignages/Annonces/Séminaires
  api/
    admin/           # routes CRUD + upload-url (utilisées par /admin)
    seminars/[id]/register/  # inscription publique à un séminaire (sans auth)
components/
  Navbar.tsx           # bannière d'annonce + menu mobile plein écran
  Hero.tsx
  WhyChooseUs.tsx
  Services.tsx        # server component → lit Supabase (avec repli statique)
  Team.tsx             # server component → lit Supabase (avec repli statique)
  Portfolio.tsx         # server component → lit Supabase, rend PortfolioClient
  PortfolioClient.tsx   # grille + galerie interactive (client)
  Seminars.tsx           # server component → lit Supabase (rien si aucun séminaire publié)
  SeminarsClient.tsx     # cartes + formulaire d'inscription (client)
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
    SeminarGallery.tsx     # galerie photo/vidéo d'un séminaire
    ServiceIllustration.tsx
    AvatarPlaceholder.tsx
    CurveDivider.tsx
    Sparkle.tsx
lib/
  data.ts            # contenu de repli (utilisé si Supabase n'est pas configuré)
  supabase.ts         # client Supabase côté serveur uniquement
  supabase-bucket.ts    # nom du bucket de stockage (utilisable client + serveur)
  supabase-browser.ts    # client Supabase côté navigateur (envoi direct vers Storage)
  site-content.ts          # annonce active + présence de séminaires (pour la Navbar)
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
