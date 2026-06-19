import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { navLinks, services, socialLinks, siteInfo } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden px-5 pt-16 text-white sm:px-8 lg:px-12"
      style={{ background: "linear-gradient(180deg, #030d18 0%, #052238 100%)" }}
    >
      {/* Top gold divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
      />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-lore-dark/60 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative">
        <div className="grid gap-10 border-b pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#accueil" className="flex items-center gap-2.5 focus-ring rounded-lg group">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10 transition-all group-hover:ring-lore-gold/30">
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

            {/* Slogan with gold gradient */}
            <p
              className="mt-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ background: "linear-gradient(90deg, #f2d272, #d4af37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {siteInfo.slogan}
            </p>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              {siteInfo.mission}
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} — Loré Foundation`}
                  className="focus-ring group flex h-10 w-10 items-center justify-center rounded-full text-white/60 ring-1 ring-white/10 transition-all hover:ring-lore-gold hover:text-lore-darker hover:bg-lore-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-lore-gold">
              Liens rapides
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="focus-ring rounded text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-lore-gold">
              Services
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a
                    href="#services"
                    className="focus-ring rounded text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-lore-gold">
              Contact
            </h4>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold/70" />
                {siteInfo.address}
              </li>
              {siteInfo.phones.map((phone) => (
                <li key={phone} className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold/70" />
                  {phone}
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lore-gold/70" />
                {siteInfo.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/30 sm:flex-row">
          <p>© {year} Loré Foundation. Tous droits réservés.</p>
          <p>Conçu avec soin en Haïti 🇭🇹</p>
        </div>
      </div>
    </footer>
  );
}
