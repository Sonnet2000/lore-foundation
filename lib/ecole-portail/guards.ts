import { NextResponse } from "next/server";
import { getEcoleProfile, isTeacher } from "./server";

// Menm prensip ak app mobil la (gade schema_is_active_enforcement.sql):
// yon kont "dezaktive" pa dwe janm gen dwa Admin/Staff, menm si sesyon
// li a toujou valid (egzanp Admin dezaktive l pandan li DEJA konekte
// sou Web la). Nou verifye `is_active` isit la an plis de `role`, pou
// aksè Web la rete SENKWONIZE ak aksè Mobil la — pa sèlman nan login.
export async function requireAdmin() {
  const { user, profile } = await getEcoleProfile();
  if (!user || profile?.role !== "admin" || profile.is_active === false) {
    return { error: NextResponse.json({ error: "Aksè refize — sèl admin." }, { status: 403 }) };
  }
  return { user, profile, error: null };
}

export async function requireStaff() {
  const { user, profile } = await getEcoleProfile();
  if (!user || (profile?.role !== "staff" && profile?.role !== "admin") || profile.is_active === false) {
    return { error: NextResponse.json({ error: "Aksè refize — sèl anplwaye/admin." }, { status: 403 }) };
  }
  return { user, profile, error: null };
}

// "Pwofesè" = admin OSWA staff ak staff_role = 'pwofesè'.
export async function requireTeacher() {
  const { user, profile } = await getEcoleProfile();
  if (!user || !isTeacher(profile) || profile?.is_active === false) {
    return { error: NextResponse.json({ error: "Aksè refize — sèl pwofesè/admin." }, { status: 403 }) };
  }
  return { user, profile, error: null };
}
