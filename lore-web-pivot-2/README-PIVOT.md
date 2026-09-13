# Pivote sou Supabase app mobil la (Estrateji B) — Etap 1

## Sa ki chanje

Apre odit Fàz 9 la (kòd sous `lore-school-app` ou te voye a), nou
dekouvri app mobil la deja gen yon schema Supabase **trè konplè**
(`profiles`, `courses`, `enrollments`, `assignments`, `grades`,
`course_modules`, `course_documents`, kiz, prezans, sètifika,
finans, mesajri, elatriye).

Ou chwazi **Estrateji B** : platfòm Web la kounye a li/ekri sou **LI
MENM pwojè Supabase** ak app mobil la, olye gen yon dezyèm schema
(`ecole_*`) apa ki ta bezwen senkronize.

## ⚠️ Konsekans enpòtan

- **Retire/pa kouri** okenn nan migrasyon `0001`–`0008` ki te livre
  nan zip Fàz 1-9 anvan yo (`ecole_*` tab yo). Yo pa nesesè ankò —
  nou itilize schema ki deja egziste a (`profiles`, `courses`,
  elatriye) san chanje l.
- Kòd Fàz 1-9 ki te ekri kont schema `ecole_*` a (paj admin
  kreyasyon kont, kiz, prezans, sètifika, backup, elatriye) **pa
  konpatib** ak nouvo direksyon sa a — yo dwe **reekri** kont vrè
  schema a, etap pa etap (gade "Pwochen etap" anba a).
- Sa a se yon **rekòmansman**, pa yon "ajoute sou" ansyen zip yo.

## Sa ki nan pake sa a (Etap 1)

```
lib/supabase/client.ts / server.ts     → menm pwojè Supabase ke app mobil la
lib/supabase/guards.ts                  → requireAdmin/requireStaff/requireTeacher (staff_role='pwofesè')
lib/supabase/ecole-middleware-snippet.ts
app/(ecole)/login/page.tsx              → menm kont ke app mobil la (verifye is_active)
app/(ecole)/dashboard/page.tsx          → li vrè "profiles" (role, staff_role, matricule)
app/(ecole)/courses/page.tsx            → katalòg (RLS filtre otomatikman pa wòl)
app/(ecole)/courses/[courseId]/page.tsx → modil pa mwa, dokiman (bucket piblik), devwa + nòt
app/api/ecole/courses/...               → wout ki li/ekri dirèkteman sou tab REYÈL yo
```

## Varyab anviwonman

Pran **menm valè** ki nan `EXPO_PUBLIC_SUPABASE_URL` /
`EXPO_PUBLIC_SUPABASE_ANON_KEY` app mobil la (menm pwojè a), mete yo
anba non Next.js:

```
NEXT_PUBLIC_ECOLE_SUPABASE_URL=<menm URL ak app mobil la>
NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY=<menm anon key ak app mobil la>
```

⚠️ **Non varyab yo espre DIFERAN** de `NEXT_PUBLIC_SUPABASE_URL` klasik —
sit lorefondation.com deja itilize non sa a pou yon LÒT pwojè Supabase
(sa ki jere Sponsors, elatriye). Si nou te sèvi ak menm non an, platfòm
`/ecole` a ta ka konekte san erè sou MOVE baz done a.

Pa gen `SUPABASE_SERVICE_ROLE_KEY` obligatwa pou Etap 1 la — tout
aksè pase pa RLS ki deja byen konfigire nan app mobil la (nou
konfime sa nan `schema_courses_role_lockdown.sql` : pwofesè jere
nòt SÈLMAN pou kou li menm, admin sèl ki modifye enfo kou a).

## Sa Etap 1 la fè ak sa l pa fè

**Fè** : login, dashboard, katalòg kou, detay kou (modil/dokiman),
devwa + nòt pwòp etidyan an, upload dokiman pa staff.

**Pa fè ankò** (pwochen etap, dapre priyorite w) :
- Antre nòt pa pwofesè (UI a montre nòt men fòm antre a poko la —
  mande wonm etidyan enskri yo)
- Kiz/Egzamen (`quiz_exams`/`quiz_questions`/`quiz_attempts`)
- Prezans (`attendance`/`attendance_sessions`)
- Sètifika (`certificate_issuances`)
- Notifikasyon (`notifications`/`push_tokens`)
- Kreyasyon kont (sa ta dwe pase pa Edge Function `admin-actions`
  ki deja egziste — `create_student`/`create_staff` — pa yon nouvo
  wout API apa, pou pa double lojik ki deja la)

## Pwochen etap

Di m ki pyès ou vle m bati apre — mwen rekòmande **Kiz** oswa
**Prezans** paske yo pi itilize souvan, men se ou ki chwazi lòd la.

---

## Etap 2-6 — Rès fonksyonalite yo (nòt, kiz, prezans, sètifika, notifikasyon, kont)

### Nouvo fichye
```
app/api/ecole/courses/[courseId]/roster/route.ts        → wonm kou a (pou nòt + prezans)
app/api/ecole/courses/[courseId]/quizzes/route.ts        → lis/kreye kiz (admin kreye)
app/api/ecole/quizzes/[quizId]/route.ts                  → detay kiz + pibliye (admin)
app/api/ecole/quizzes/[quizId]/questions/route.ts        → ajoute kesyon (admin)
app/api/ecole/courses/[courseId]/attendance/route.ts     → wonm + anrejistre prezans (staff)
app/(ecole)/quizzes/[quizId]/page.tsx                     → pran kiz (etidyan) + jesyon (admin)
app/(ecole)/attendance/page.tsx                            → pran prezans (staff) / istorik (etidyan)
app/(ecole)/certificates/page.tsx                          → anrejistre/wè sètifika
app/(ecole)/notifications/page.tsx                         → lis + voye notifikasyon
app/(ecole)/admin/create-account/page.tsx                  → kreyasyon kont (rele admin-actions)
```

Paj `courses/[courseId]/page.tsx` mizajou ak: wonm pou antre nòt pa
elèv pou chak devwa, ak yon seksyon Kiz.

### Desizyon enpòtan pou chak pyès

**Nòt** — Antre nòt la respekte `schema_courses_role_lockdown.sql` :
si RLS refize (paske ou pa pwofesè kou sa a espesyifikman), API a ap
retounen yon erè — sa se konpòtman VOULU, pa yon bug.

**Kiz** — Mwen swiv **egzakteman** menm apwòch ak app mobil la
(`lib/quizData.ts`) : kesyon yo (ak `correct_index`) chaje nan
navigatè a, korije a fèt **kote kliyan an**, menm konpwomi sekirite
ki deja dokimante ak aksepte nan `schema_quiz_exam.sql`. Sèlman
**admin** ka kreye/pibliye kiz (RLS `quiz_exams_admin_all` — pa gen
"pwofesè kreye kiz" nan schema aktyèl la).

**Prezans** — Modèl Web la SENPLIFYE parapò ak mobil la : pa gen
eskanè QR (sa se yon fonksyonalite mobil), staff mete estati a
manyèlman pou chak elèv. `cutoff_time` konsève nan `attendance_sessions`
men **pa aplike otomatikman** kòm "Absan pa defo" nan wout API la —
staff dwe chwazi estati a li menm pou chak moun.

**Sètifika** — Rete fidèl a apwòch mobil la : yon senp **istwa/jounal**
(`certificate_issuances`), PA jenerasyon PDF ni QR (sa se yon
desizyon Admin te fè deja pou kenbe l senp, dapre kòmantè nan
`schema_certificate_issuances.sql`). Jenerasyon PDF/QR rete yon
amelyorasyon posib pita si ou vle l.

**Notifikasyon** — Staff/Admin ka voye dirèkteman (RLS
`notifications_staff_insert` pèmèt sa — pa gen bezwen service-role
ditou, kontrèman ak sa m te bati nan ansyen schema `ecole_*` la).

**Kreyasyon kont** — Rele **Edge Function `admin-actions`** ki deja
egziste a (`supabase.functions.invoke`), pa yon nouvo API. `create_student`
aksesib pou staff+admin, `create_staff` admin sèlman — menm règ ki
deja nan fonksyon an.

### Sa ki rete pou fè (si ou vle ale pi lwen)
- Pwogram (`programs`/`student_programs`) — pa entegre nan Web la
  ankò, elèv ka enskri nan kou dirèkteman sèlman pou kounye a.
- Finans (`payments`/`tuition_*`) — pa touche ditou.
- Mesajri/Anons (`messages`/`conversations`/`announcements`) — pa
  touche ditou.
- Verifikasyon sètifika pa QR — non-egzistan nan ni mobil ni Web
  kounye a (ta yon nouvo fonksyonalite, pa yon pati).
