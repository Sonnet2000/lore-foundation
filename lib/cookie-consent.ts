"use client";

export type ConsentStatus = "accepted" | "rejected";

const STORAGE_KEY = "lore_cookie_consent";
const EVENT_NAME = "lore-cookie-consent-changed";

export function getStoredConsent(): ConsentStatus | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(status: ConsentStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // localStorage endisponib — pa gen anyen nou ka fè, sesyon an ap tou senpleman
    // mande konsantman ankò pwochen fwa.
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: status }));
}

/** Retire chwa itilizatè a te fè a, pou bandwòl la parèt ankò (egz. bouton "Gérer les cookies"). */
export function resetConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // pa gen anyen pou fè
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
}

/** Abòne yon fonksyon k ap resevwa chak fwa konsantman an chanje (menm nan menm onglet la). */
export function onConsentChange(callback: (status: ConsentStatus | null) => void): () => void {
  const handler = (e: Event) => callback((e as CustomEvent).detail ?? null);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
