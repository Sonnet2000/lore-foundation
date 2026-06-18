import { NextResponse } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate that a route param is a well-formed UUID.
 * Returns null if valid, or a 400 NextResponse to return immediately.
 */
export function validateId(id: string): NextResponse | null {
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }
  return null;
}
