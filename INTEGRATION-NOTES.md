# Netwayaj + Entegrasyon Pòtal École — Nòt

## 1. Netwayaj fè (san danje, konfime anvan)

| Sa ki retire/deplase | Rezon |
|---|---|
| `.vs/` (rasin) | Metadata Visual Studio lokal, deja nan `.gitignore` men te prezan nan zip la |
| `build.log` (rasin) | Rezidi yon `npm run build` — pa dwe janm nan repo a. Ajoute nan `.gitignore` |
| `app.json` (rasin) | Fichye konfigirasyon **Expo** (app mobil), san rapò ak Next.js — pa gen okenn referans li nan pwojè a |
| `index.html` (rasin) | Konfime **idantik pyès pa pyès** ak `public/inscription-generale.html` — te yon doublon initil (100 Ko) |
| `lore-foundation-updates/` | Konfime **idantik** ak `components/AdsBanner.tsx` ak `components/AdUnit.tsx` ki deja nan `components/` — deja aplike, dosye a te rete la san rezon |
| `migration-*.sql`, `migration.sql`, `insert-projet-milot.sql` (12 fichye nan rasin) | Deplase nan `supabase/migrations/` — pa gen okenn kòd ki li yo pa chemen (verifye), se jis pou òganizasyon |

**Pa touche** : `README.md`, `INSTRUCTIONS.md`, tout fichye konfigirasyon (`.eslintrc`, `next.config.mjs`, `tailwind.config.ts`, elatriye), `supabase/schema.sql`.

## 2. ⚠️ Pwoblèm gwosè — `public/downloads/` (144 Mo, PA TOUCHE)

```
lore-school.apk   98 Mo
lore-school.zip   46 Mo
```

Sa a se **93% nan tout gwosè pwojè a**. `lib/school-app-config.ts` make
**DEPRIYE** — vrè lyen telechajman an jere depi **Admin → App mobile
(APK)**, estoke nan Supabase (`site_settings`, kle `app_download`).
Mwen **pa ka konnen ki fichye ki reyèlman lye kounye a** san gade
Admin la, e efase move a ta ka kase bouton telechajman an sou sit la
**anlè**.

### Aksyon rekòmande (ou fè l, mwen pa ka fè l san kase sit la)
1. Ale nan **Admin → App mobile (APK)**, gade ki URL ki konfigire kounye a
2. Telechaje SÈLMAN fichye ki reyèlman itilize a nan yon **bucket Supabase Storage** (pa `public/`)
3. Mete nouvo URL Storage la nan menm panèl Admin la
4. Yon fwa konfime sa mache, **efase tou de fichye yo nan `public/downloads/`** —
   sa ap retire 144 Mo nèt nan repo a san afekte itilizatè yo (yo telechaje
   soti Storage kounye a, pa Git/Vercel)

Zip mwen voye ba ou a **pa gen fichye sa yo ladan l ditou** (yo rete
tèl kwal nan pwojè ou a — mwen pa t' bezwen re-anvoye 144 Mo pou yon
bagay mwen pa t' chanje).

## 3. 🐛 Bug kritik korije — wout `/ecole` ki t ap kraze

Kòd pòtal École (LMS konekte ak app mobil la) mwen te bati anvan an
te itilize yon **route group** Next.js (`app/(ecole)/...`) — sentaks
sa a **PA ajoute `/ecole` nan URL la** (se yon règ Next.js: dosye ant
parantèz pa konte nan chemen an). Rezilta a: paj yo t ap rive sou
`/login`, `/dashboard`, `/courses`, elatriye — **san `/ecole` ditou**,
menm si m te toujou di w ale sou `/ecole/login`.

**Bon nouvèl** : pa gen okenn koyizyon ak paj ki te deja egziste sou
sit la (ou pa t janm rive teste l sou pwodiksyon), men se te yon bug
reyèl. Korije kounye a — gade Seksyon 4.

## 4. 🏛️ Twa sistèm "École" — konsolide nan YON sèl kote

Odit la revele **twa** sistèm diferan ki gen rapò ak "lekòl":

| Sistèm | Sa li fè | Kote li ye |
|---|---|---|
| `/ecole` (sit la, deja egziste) | **Katalòg piblik** + demann enskripsyon (`courses`/`course_enrollments`/`assignments` — Supabase SIT la) | `app/ecole/page.tsx`, `app/ecole/[id]/inscription/` |
| App mobil `lore-school-app` | **LMS konplè** pou moun ki deja enskri (kou, nòt, prezans, kiz, finans...) | Expo, pwòp pwojè Supabase l |
| **Pòtal École** (nouvo) | Vèsyon **Web** LMS la, konekte sou MENM Supabase ak app mobil la | `app/ecole/portail/*` ← **nouvo anplasman** |

**Desizyon m pran** (rezonab, revèsib si ou pa dakò) : `/ecole` rete
paj piblik la san touche; nouvo pòtal LMS la rive anba li, sou
`/ecole/portail/*` — konsa **tout bagay "École" rasanble anba menm
chemen `/ecole`**, jan ou te mande a, san kraze paj piblik ki deja
egziste a. Mwen ajoute yon lyen "Déjà inscrit ? Mon espace →" nan
header paj piblik `/ecole` a ki mennen dirèkteman nan
`/ecole/portail/login`.

## 5. Fichye Supabase separe pou EVITE yon dezyèm konfli

Sit la deja gen `lib/supabase.ts`, `lib/supabase-browser.ts`,
`lib/supabase/{client,server,middleware}.ts` pou **pwòp pwojè
Supabase li** (kont `/compte`, `/admin`). Pòtal École a itilize yon
**twazyèm** pwojè Supabase (app mobil la) — donk tout kòd li rete
nan yon dosye apa **`lib/ecole-portail/`** ak **`components/ecole-portail/`**,
ak varyab `NEXT_PUBLIC_ECOLE_SUPABASE_URL`/`ANON_KEY` (non diferan
espre pou pa antre an konfli ak `NEXT_PUBLIC_SUPABASE_URL` sit la
deja genyen an).

`middleware.ts` rasin lan mizajou ak yon nouvo branch pou pwoteje
`/ecole/portail/*` san touche lojik `/admin` ak `/compte` ki te deja
la.

## 6. Sa ki rete pou fè

1. Ajoute `NEXT_PUBLIC_ECOLE_SUPABASE_URL` ak `NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY`
   nan `.env.local` REYÈL ou a (modèl la nan `.env.local.example` mizajou)
   epi nan Vercel (menm valè ou te deja ba mwen yo).
2. Deplwaye + teste `/ecole/portail/login`.
3. Regle desizyon `public/downloads/` a (Seksyon 2) lè ou gen tan.
4. (Opsyonèl) `git rm -r --cached .vs` si dosye a te rive tracked nan Git malgre `.gitignore` la.
