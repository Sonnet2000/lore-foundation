import Link from "next/link";
import Image from "next/image";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lore-gradient-dark px-5 py-16">
      {/* Décor ambiant, cohérent avec le Hero du site */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-lore-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-lore-gold/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Image src="/logo.png" alt="Loré Foundation" fill className="object-contain p-1.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Loré Foundation
          </span>
        </Link>

        <div className="rounded-3xl bg-lore-night-surface p-8 shadow-soft ring-1 ring-white/10">
          <h1 className="text-center font-display text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-center text-sm text-white/50">{subtitle}</p>}

          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-white/50">{footer}</div>}
      </div>
    </main>
  );
}
