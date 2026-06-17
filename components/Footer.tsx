import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { navLinks, services, socialLinks, siteInfo } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lore-darker px-5 pt-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#accueil" className="flex items-center gap-2 focus-ring rounded-lg">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Image
                  src="/logo.png"
                  alt="Loré Foundation"
                  fill
                  className="object-contain p-1.5"
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Loré Foundation
              </span>
            </a>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-lore-gold">
              {siteInfo.slogan}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {siteInfo.tagline}. Nous concevons des solutions digitales sur
              mesure pour faire grandir votre activité en Haïti et au-delà.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} — Loré Foundation`}
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-lore-gold hover:text-lore-dark"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-lore-gold">
              Liens rapides
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="focus-ring rounded text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-lore-gold">
              Services
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a
                    href="#services"
                    className="focus-ring rounded text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-lore-gold">
              Contact
            </h4>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold" />
                {siteInfo.address}
              </li>
              {siteInfo.phones.map((phone) => (
                <li key={phone} className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold" />
                  {phone}
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold" />
                {siteInfo.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {year} Loré Foundation. Tous droits réservés.</p>
          <p>Conçu avec soin en Haïti 🇭🇹</p>
        </div>
      </div>
    </footer>
  );
}
