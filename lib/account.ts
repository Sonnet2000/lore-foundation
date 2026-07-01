import "server-only";
import { getSupabase } from "@/lib/supabase";

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
};

export type DonationRow = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "confirmed" | "rejected";
  message: string;
  reference: string;
  proof_url: string | null;
  created_at: string;
  project: { title: string; slug: string; cover_url: string | null } | null;
};

export type SeminarRegistrationRow = {
  id: string;
  created_at: string;
  seminar: { title: string; starts_at: string | null; location: string } | null;
};

export type SponsorPaymentRow = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  purpose: string;
  status: "pending" | "confirmed" | "rejected";
  reference: string;
  proof_url: string | null;
  created_at: string;
};

/**
 * Récupère (ou crée si besoin) le profil complémentaire d'un utilisateur.
 */
export async function getOrCreateProfile(userId: string): Promise<Profile> {
  const supabase = getSupabase();

  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) return data as Profile;

  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: userId })
    .select("*")
    .single();

  return created as Profile;
}

/**
 * Rassemble tout l'historique d'une personne : dons faits pendant qu'elle
 * était connectée (user_id) ET dons faits avant la création du compte, en
 * rapprochant l'adresse email — pour que rien ne se perde en route.
 */
export async function getAccountOverview(userId: string, email: string) {
  const supabase = getSupabase();
  const emailLc = email.toLowerCase();

  const [donationsRes, seminarRes, sponsorsRes] = await Promise.all([
    supabase
      .from("project_donations")
      .select("id, amount, currency, method, status, message, reference, proof_url, created_at, projects(title, slug, cover_url)")
      .or(`user_id.eq.${userId},donor_email.ilike.${emailLc}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("seminar_registrations")
      .select("id, created_at, seminars(title, starts_at, location)")
      .or(`user_id.eq.${userId},email.ilike.${emailLc}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("sponsors")
      .select("id, tier, status, created_at, payments(id, amount, currency, method, purpose, status, reference, proof_url, created_at)")
      .ilike("email", emailLc),
  ]);

  const donations: DonationRow[] = (donationsRes.data ?? []).map((d: any) => ({
    id: d.id,
    amount: Number(d.amount),
    currency: d.currency,
    method: d.method,
    status: d.status,
    message: d.message,
    reference: d.reference,
    proof_url: d.proof_url,
    created_at: d.created_at,
    project: d.projects ? { title: d.projects.title, slug: d.projects.slug, cover_url: d.projects.cover_url } : null,
  }));

  const seminarRegistrations: SeminarRegistrationRow[] = (seminarRes.data ?? []).map((s: any) => ({
    id: s.id,
    created_at: s.created_at,
    seminar: s.seminars
      ? { title: s.seminars.title, starts_at: s.seminars.starts_at, location: s.seminars.location }
      : null,
  }));

  const payments: SponsorPaymentRow[] = (sponsorsRes.data ?? []).flatMap((s: any) =>
    (s.payments ?? []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      method: p.method,
      purpose: p.purpose,
      status: p.status,
      reference: p.reference,
      proof_url: p.proof_url,
      created_at: p.created_at,
    }))
  );

  const confirmedDonationsTotal = donations
    .filter((d) => d.status === "confirmed")
    .reduce((sum, d) => sum + d.amount, 0);
  const confirmedPaymentsTotal = payments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    donations,
    seminarRegistrations,
    payments,
    stats: {
      totalContributed: confirmedDonationsTotal + confirmedPaymentsTotal,
      donationsCount: donations.length,
      seminarsCount: seminarRegistrations.length,
      pendingCount:
        donations.filter((d) => d.status === "pending").length +
        payments.filter((p) => p.status === "pending").length,
    },
  };
}
