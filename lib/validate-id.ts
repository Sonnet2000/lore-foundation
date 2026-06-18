import { NextResponse } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9][a-z0-9\-]{0,98}[a-z0-9]$|^[a-z0-9]$/i;

/**
 * Validate that a route param is either a well-formed UUID or a text slug.
 * Returns null if valid, or a 400 NextResponse to return immediately.
 */
export function validateId(id: string): NextResponse | null {
  if (UUID_RE.test(id) || SLUG_RE.test(id)) return null;
  return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
}

/** Validate UUID only (for tables with uuid primary keys) */
export function validateUUID(id: string): NextResponse | null {
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }
  return null;
}
