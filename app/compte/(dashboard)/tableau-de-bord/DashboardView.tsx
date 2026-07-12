"use client";

import Link from "next/link";
import {
  Wallet, Calendar, Receipt, Clock3, CheckCircle2, XCircle,
  ExternalLink, HeartHandshake, GraduationCap,
} from "lucide-react";
import type { DonationRow, SeminarRegistrationRow, SponsorPaymentRow } from "@/lib/account";

type Overview = {
  donations: DonationRow[];
  seminarRegistrations: SeminarRegistrationRow[];
  payments: SponsorPaymentRow[];
  stats: {
    totalContributed: number;
    donationsCount: number;
    seminarsCount: number;
    pendingCount: number;
  };
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " " + currency;
}

function formatDate(iso: string | null) {
  if (!iso) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

function StatusBadge({ status }: { status: "pending" | "confirmed" | "rejected" }) {
  const map = {
    confirmed: { label: "Confirmé", icon: CheckCircle2, cls: "bg-green-500/10 text-green-400 ring-green-500/20" },
    pending: { label: "En attente", icon: Clock3, cls: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20" },
    rejected: { label: "Rejeté", icon: XCircle, cls: "bg-red-500/10 text-red-400 ring-red-500/20" },
  } as const;
  const { label, icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function DashboardView({
  displayName,
  email,
  memberSince,
  overview,
}: {
  displayName: string;
  email: string;
  memberSince: string;
  overview: Overview;
}) {
  const { donations, seminarRegistrations, payments, stats } = overview;

  type ActivityItem =
    | { kind: "donation"; date: string; data: DonationRow }
    | { kind: "payment"; date: string; data: SponsorPaymentRow }
    | { kind: "seminar"; date: string; data: SeminarRegistrationRow };

  const activity: ActivityItem[] = [
    ...donations.map((d) => ({ kind: "donation" as const, date: d.created_at, data: d })),
    ...payments.map((p) => ({ kind: "payment" as const, date: p.created_at, data: p })),
    ...seminarRegistrations.map((s) => ({ kind: "seminar" as const, date: s.created_at, data: s })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Bonjour, {displayName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {email} · Membre depuis {formatDate(memberSince)}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <Wallet className="h-5 w-5 text-lore-gold-light" />
          <p className="mt-3 font-display text-xl font-bold text-white">
            {formatAmount(stats.totalContributed, "HTG")}
          </p>
          <p className="mt-0.5 text-xs text-white/45">Total contribué (confirmé)</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <HeartHandshake className="h-5 w-5 text-lore-emerald-light" />
          <p className="mt-3 font-display text-xl font-bold text-white">{stats.donationsCount}</p>
          <p className="mt-0.5 text-xs text-white/45">Contributions</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <GraduationCap className="h-5 w-5 text-lore-emerald-light" />
          <p className="mt-3 font-display text-xl font-bold text-white">{stats.seminarsCount}</p>
          <p className="mt-0.5 text-xs text-white/45">Séminaires suivis</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <Clock3 className="h-5 w-5 text-yellow-400" />
          <p className="mt-3 font-display text-xl font-bold text-white">{stats.pendingCount}</p>
          <p className="mt-0.5 text-xs text-white/45">En attente de confirmation</p>
        </div>
      </div>

      {/* Activity / receipts */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
          <Receipt className="h-5 w-5 text-lore-gold-light" />
          Activité &amp; reçus
        </h2>

        {activity.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.03] p-8 text-center ring-1 ring-white/10">
            <p className="text-white/60">Aucune activité pour le moment.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/ecole" className="btn-gold rounded-full px-5 py-2.5 text-sm font-bold">
                Découvrir l&apos;École
              </Link>
              <Link
                href="/#seminaires"
                className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Voir les séminaires
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activity.map((item) => {
              if (item.kind === "donation") {
                const d = item.data;
                return (
                  <div
                    key={`donation-${d.id}`}
                    className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lore-emerald/15 text-lore-emerald-light">
                        <HeartHandshake className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Contribution {d.project ? `— ${d.project.title}` : ""}
                        </p>
                        <p className="text-xs text-white/45">
                          {formatDate(d.created_at)} · Réf. {d.reference || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-12 sm:pl-0">
                      <span className="font-display font-bold text-white">{formatAmount(d.amount, d.currency)}</span>
                      <StatusBadge status={d.status} />
                      {d.proof_url && (
                        <a
                          href={d.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white"
                          aria-label="Voir la preuve de paiement"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              if (item.kind === "payment") {
                const p = item.data;
                return (
                  <div
                    key={`payment-${p.id}`}
                    className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lore-gold/15 text-lore-gold-light">
                        <Wallet className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">Paiement — {p.purpose}</p>
                        <p className="text-xs text-white/45">
                          {formatDate(p.created_at)} · {p.method.toUpperCase()} · Réf. {p.reference || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-12 sm:pl-0">
                      <span className="font-display font-bold text-white">{formatAmount(p.amount, p.currency)}</span>
                      <StatusBadge status={p.status} />
                      {p.proof_url && (
                        <a
                          href={p.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/40 hover:text-white"
                          aria-label="Voir la preuve de paiement"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              const s = item.data;
              return (
                <div
                  key={`seminar-${s.id}`}
                  className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lore-emerald/15 text-lore-emerald-light">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.seminar?.title || "Séminaire"}</p>
                      <p className="text-xs text-white/45">
                        Inscrit le {formatDate(s.created_at)}
                        {s.seminar?.location ? ` · ${s.seminar.location}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="pl-12 text-xs font-semibold text-white/50 sm:pl-0">
                    {s.seminar?.starts_at ? formatDate(s.seminar.starts_at) : "Date à confirmer"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
