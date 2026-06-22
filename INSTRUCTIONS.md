# Chanjman pou Loré Foundation — Hero Media + Réalisations Vidéo

## Fichye ou bezwen ranplase / ajoute

### 1. Ranplase fichye egzistant yo
```
components/Hero.tsx                                   ← ranplase
app/admin/_components/Dashboard.tsx                   ← ranplase
app/admin/_components/PortfolioPanel.tsx              ← ranplase
app/api/admin/portfolio/route.ts                      ← ranplase
app/api/admin/portfolio/[id]/route.ts                 ← ranplase
```

### 2. Ajoute nouvo fichye yo
```
app/admin/_components/HeroPanel.tsx                   ← nouvo
app/api/admin/hero/route.ts                           ← nouvo
```

### 3. Ekzekite migration SQL la
Ale nan **Supabase Dashboard → SQL Editor** epi paste kontni `migration.sql` la epi ekzekite li.

---

## Sa ki chanje

### Section Accueil (Hero)
- Nouvo tab **"Accueil"** nan admin panel la (premye tab)
- Ou ka upload **1 foto oswa 1 vidéo kout** (MP4/WEBM, 80Mo max) pou kolòn dwat hero section an
- Si ou pa mete anyen, foto orijinal la (`/hero-portrait.jpg`) ap rete
- Vidéo a ap joue otomatikman (mute, loop)

### Réalisations (Portfolio)
- Panel la kounye a aksepte **foto AK vidéo** pou chak réalisation
- Ou ka mete plizye foto ak vidéo ansanm pou yon menm pwojè
- Thumbnail nan lis la montre yon ti ikonèt ▶ si premye média a se yon vidéo
- Retrocompat: done egzistant yo (images[]) ap konvèti otomatikman

---

## Etap nan Supabase (enpòtan!)
1. Asire bucket `lore-media` (oswa non bucket ou an) egziste epi li **public**
2. Ajoute règ CORS pou `video/*` si li pa deja la
3. Ekzekite `migration.sql` nan SQL Editor

