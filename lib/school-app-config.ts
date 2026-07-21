// Konfigirasyon telechajman App Loré School — modifye SÈLMAN fichye sa a
// lè ou gen yon nouvo vèsyon APK, ou pa bezwen touche kòmpozan an.
//
// Kijan pou mete APK la an liy:
//   1. Mete fichye .apk ou a nan dosye  public/downloads/  (egzanp:
//      public/downloads/lore-school.apk)
//   2. Mete menm non fichye a nan APK_PATH anba a
//   3. Mete vèsyon ak gwosè fichye a (jis pou afichaj — pa obligatwa
//      pou l egzat 100%, men bon pou moun konnen sa y ap telechaje)

export const schoolAppConfig = {
  // Chemen relatif anndan /public — Next.js sèvi l dirèkteman kòm
  // /downloads/lore-school.apk san nou pa bezwen konfigire anyen lòt.
  apkPath: "/downloads/lore-school.apk",
  version: "1.0.0",
  approxSizeMb: 40,
  // Lyen Play Store — kite l vid (null) jiskaske app la apwouve.
  // Depi ou mete yon lyen isit la, badj "Play Store" a ap parèt otomatikman.
  playStoreUrl: null as string | null,
};
