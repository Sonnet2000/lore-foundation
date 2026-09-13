"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  is_published: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ecole/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Kou</h1>

      {loading && <p className="text-sm text-slate-400">Chajman...</p>}
      {!loading && courses.length === 0 && <p className="text-sm text-slate-400">Pa gen kou disponib.</p>}

      <div className="space-y-3">
        {courses.map((c) => (
          <Link key={c.id} href={`/ecole/portail/courses/${c.id}`} className="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#0B1F3B]">{c.name} {c.code ? `(${c.code})` : ""}</p>
              {!c.is_published && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Bouyon</span>}
            </div>
            {c.description && <p className="mt-1 text-sm text-slate-500">{c.description}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
