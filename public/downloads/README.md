# Kote pou mete APK Loré School la

Fichye a kounye a mete sou sit la an **`.zip`** (~48 Mo olye ~98 Mo) pou
telechajman pi rapid pou itilizatè yo. Zip la konpresyon anplis sou
bibliyotèk natif ki te deja depoze san konpresyon nan APK a.

Chak fwa ou gen yon nouvo vèsyon:
1. Fè EAS Build la soti nouvo `.apk` la
2. Zip li: `zip -9 lore-school.zip lore-school.apk`
3. Ranplase fichye `public/downloads/lore-school.zip` la ak nouvo a
   (menm non an)
4. Louvri `lib/school-app-config.ts` si ou itilize l, epi mete ajou
   `version` (ak `approxSizeMb` si l chanje anpil) — men si w jere
   telechajman an nan Admin → App mobile (APK), fè chanjman an la a
   pito, epi asire w lyen an pwente sou `/downloads/lore-school.zip`
   epi enstriksyon yo mansyone itilizatè a dwe dekonprese l anvan l
   enstale APK a.
5. Deplwaye sit la ankò
