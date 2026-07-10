"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Clock3, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import type { CourseRow, EnrollmentRow } from "@/lib/school";

type Item = { course: CourseRow; enrollment: EnrollmentRow | null };

function StatusBadge({ status }: { status: EnrollmentRow["status"] }) {
  const map = {
    approved: { label: "Apwouve", icon: CheckCircle2, cls: "bg-green-500/10 text-green-400 ring-green-500/20" },
    pending: { label: "An atant", icon: Clock3, cls: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20" },
    rejected: { label: "Rejte", icon: XCircle, cls: "bg-red-500/10 text-red-400 ring-red-500/20" },
  } as const;
  const { label, icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function KouListView({ items }: { items: Item[] }) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Map<string, EnrollmentRow | null>>(
    new Map(items.map((i) => [i.course.id, i.enrollment]))
  );

  async function enroll(courseId: string) {
    setPendingIds((prev) => new Set(prev).add(courseId));
    try {
      const res = await fetch(`/api/account/courses/${courseId}/enroll`, { method: "POST", credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatuses((prev) => new Map(prev).set(courseId, data.enrollment));
      }
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/50">
        Pa gen kou disponib kounye a. Tounen pita.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ course }) => {
        const enrollment = statuses.get(course.id) ?? null;
        const isPending = pendingIds.has(course.id);

        return (
          <div key={course.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="relative h-32 w-full bg-white/5">
              {course.cover_url ? (
                <Image src={course.cover_url} alt={course.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/20">
                  <GraduationCap className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">{course.title}</h3>
                <p className="mt-1 text-xs text-white/50">
                  {course.duration || "Dire pa presize"}{course.price ? ` · ${course.price}` : ""}
                </p>
              </div>
              {course.description && (
                <p className="line-clamp-3 text-sm text-white/60">{course.description}</p>
              )}

              <div className="mt-auto flex items-center justify-between pt-2">
                {enrollment ? (
                  <StatusBadge status={enrollment.status} />
                ) : (
                  <button
                    type="button"
                    onClick={() => enroll(course.id)}
                    disabled={isPending}
                    className="focus-ring rounded-full bg-lore-gold px-4 py-2 text-xs font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isPending ? "..." : "Mande enskripsyon"}
                  </button>
                )}

                {enrollment?.status === "approved" && (
                  <Link
                    href={`/compte/kou/${course.id}`}
                    className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-lore-gold-light hover:text-white"
                  >
                    Antre <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
