import Image from "next/image";
import Link from "next/link";
import { BRAND, PLATFORMS } from "@/lib/brand";
import { navLinks } from "@/lib/data";
import { getContactInfo } from "@/lib/site-info-server";

export default async function Footer() {
  const year = new Date().getFullYear();
  const contact = await getContactInfo();
  const heading = "font-display text-lg font-semibold text-gold-300";
  const link = "focus-royal rounded text-[0.95rem] text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline";

  return (
    <footer className="border-t-4 border-gold bg-navy-900 px-5 pt-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="focus-royal inline-flex items-center gap-3 rounded-lg" aria-label={`${BRAND.name} — accueil`}>
              <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white">
                <Image src="/logo.png" alt="" fill sizes="44px" className="object-contain p-1.5" />
              </span>
              <span className="font-display text-2xl font-bold">{BRAND.name}</span>
            </Link>
            <p className="mt-4 text-sm font-semibold text-gold-300">{BRAND.descriptor}</p>
            <p className="mt-2 font-display text-lg italic text-white/85">{BRAND.tagline}</p>
            <p className="mt-2 text-sm text-white/65">{BRAND.mottos[0]} · {BRAND.mottos[1]}</p>
          </div>

          <nav aria-label="Pied de page">
            <h2 className={heading}>Navigation</h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={link} {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={heading}>Plateformes</h2>
            <ul className="mt-4 space-y-3">
              {PLATFORMS.map((p) => (
                <li key={p.id}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {p.title}
                    <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={heading}>Contact</h2>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-white/75">
              <li>{contact.address}</li>
              {contact.phones.map((p) => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className={link}>{p}</a></li>
              ))}
              <li><a href={`mailto:${contact.email}`} className={`${link} break-all`}>{contact.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 py-6 text-sm text-white/60 sm:flex-row sm:items-center">
          <p>© {year} {BRAND.name}. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/politique-de-confidentialite" className="focus-royal rounded hover:text-white">Politique de confidentialité</Link></li>
            <li><Link href="/conditions-utilisation" className="focus-royal rounded hover:text-white">Conditions d’utilisation</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
