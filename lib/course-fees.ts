/**
 * Itilitè pri/frè kou — SAN "server-only", pou l ka itilize tou de kote:
 * konpozan sèvè (lib/school.ts) AK konpozan kliyan (EcoleClient.tsx,
 * InscriptionClient.tsx).
 */

export type CourseFeeFields = {
  price: string;
  registration_fee: string;
  materials_fee: string;
};

/** Detèmine si yon pri/frè vle di "gratis". */
export function isFreeCoursePrice(price: string) {
  const p = (price || "").trim().toLowerCase();
  return !p || /gratis|gratuit|free|0 htg|0\$/.test(p);
}

/** Kou a totalman gratis SÈLMAN si okenn nan 3 frè yo pa defini. */
export function isCourseFullyFree(course: CourseFeeFields) {
  return (
    isFreeCoursePrice(course.registration_fee) &&
    isFreeCoursePrice(course.price) &&
    isFreeCoursePrice(course.materials_fee)
  );
}

/**
 * Rezime pri/frè yon kou pou afiche sou katalòg piblik la (/ecole) ak sou
 * paj enskripsyon an.
 *
 * AVAN: paj yo te afiche SÈLMAN `course.price` — si yon admin te ranpli
 * `registration_fee` oswa `materials_fee` men te kite `price` vid, kou a
 * te parèt SAN okenn pri, kòmsi li te gratis, menm lè gen vrè frè ki antre.
 *
 * KOUNYE A: si `price` vid, nou tonbe sou `registration_fee` epi
 * `materials_fee` anvan nou di kou a gratis pou tout bon.
 */
export function courseFeeSummary(course: CourseFeeFields): string | null {
  if (course.price && !isFreeCoursePrice(course.price)) return course.price;
  if (course.registration_fee && !isFreeCoursePrice(course.registration_fee)) {
    return `Frè enskripsyon: ${course.registration_fee}`;
  }
  if (course.materials_fee && !isFreeCoursePrice(course.materials_fee)) {
    return `Frè maliyo: ${course.materials_fee}`;
  }
  return null;
}
