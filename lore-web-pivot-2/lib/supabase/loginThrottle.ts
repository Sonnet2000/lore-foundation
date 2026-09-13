// Ralanti tantativ koneksyon ki echwe SOU MENM NAVIGATÈ a — pa ranplase
// pwoteksyon sèvè Supabase Auth deja genyen (ki verifye pou tout moun,
// kèlkeswa aparèy), se yon dezyèm kouch DEFANS: menm prensip
// EGZAKTEMAN ak `lib/loginThrottle.ts` nan app mobil la, pou de
// platfòm yo rete konsistan.
const KEY_PREFIX = "lore_login_attempts_v1:";
const MAX_FREE_ATTEMPTS = 5;
const BASE_COOLDOWN_MS = 15_000;
const MAX_COOLDOWN_MS = 5 * 60_000;

function keyFor(email: string): string {
  return KEY_PREFIX + email.trim().toLowerCase();
}

type AttemptState = { count: number; lastAttempt: number };

function readState(email: string): AttemptState {
  if (typeof window === "undefined") return { count: 0, lastAttempt: 0 };
  try {
    const raw = window.localStorage.getItem(keyFor(email));
    if (!raw) return { count: 0, lastAttempt: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lastAttempt: 0 };
  }
}

// Konbyen segond ki rete anvan moun nan ka eseye ankò — 0 si li ka
// eseye kounye a. Rele AVAN soumèt fòm koneksyon an.
export function getLoginCooldownSeconds(email: string): number {
  if (!email) return 0;
  const state = readState(email);
  if (state.count < MAX_FREE_ATTEMPTS) return 0;
  const extraFails = state.count - MAX_FREE_ATTEMPTS;
  const cooldown = Math.min(BASE_COOLDOWN_MS * Math.pow(2, extraFails), MAX_COOLDOWN_MS);
  const remaining = cooldown - (Date.now() - state.lastAttempt);
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

export function recordFailedLogin(email: string): void {
  if (!email || typeof window === "undefined") return;
  const state = readState(email);
  try {
    window.localStorage.setItem(keyFor(email), JSON.stringify({ count: state.count + 1, lastAttempt: Date.now() }));
  } catch {
    // San konsekans — sèvè a toujou pwoteje kèlkeswa sa.
  }
}

export function clearLoginAttempts(email: string): void {
  if (!email || typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyFor(email));
  } catch {
    // rien
  }
}
