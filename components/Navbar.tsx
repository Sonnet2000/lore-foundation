"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Megaphone, ArrowUpRight } from "lucide-react";
import { navLinks, type Announcement } from "@/lib/data";
import { BRAND, REGISTER_URL } from "@/lib/brand";
import AccountNavLink from "@/components/account/AccountNavLink";

type NavbarProps = {
  announcement?: Announcement | null;
  /** Conservé pour compatibilité avec SiteChrome ; les séminaires sont désormais sous « Vie académique ». */
  showSeminaires?: boolean;
};

type NavItem = { label: string; href: string; external?: boolean };

function NavAnchor({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
}) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {item.label}
        <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export default function Navbar({ announcement = null }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const items = navLinks as NavItem[];

  useEffect(() => {
    if (!announcement) return;
    setBannerDismissed(window.localStorage.getItem("lore_dismissed_announcement") === announcement.id);
  }, [announcement]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  function dismissBanner() {
    if (!announcement) return;
    window.localStorage.setItem("lore_dismissed_announcement", announcement.id);
    setBannerDismissed(true);
  }

  const showBanner = announcement !== null && !bannerDismissed;
  const link =
    "focus-royal rounded px-1 py-1 text-[0.95rem] font-medium text-navy/80 transition-colors hover:text-royal";

  return (
    <>
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open
            ? "border-royal/10 bg-ivory/95 shadow-[0_8px_30px_-18px_rgba(11,31,75,0.35)] backdrop-blur"
            : "border-transparent bg-ivory/80 backdrop-blur-sm"
        }`}
      >
        {showBanner && announcement && (
          <div className="flex items-center justify-center gap-2 bg-navy px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
            <Megaphone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <span className="truncate">{announcement.message}</span>
            {announcement.linkUrl && (
              <a href={announcement.linkUrl} className="focus-royal shrink-0 underline underline-offset-2">
                {announcement.linkLabel || "En savoir plus"}
              </a>
            )}
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Fermer l’annonce"
              className="focus-royal ml-1 shrink-0 rounded-full p-1 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <nav aria-label="Navigation principale" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 xl:px-12">
          <Link href="/" className="focus-royal group flex items-center gap-2.5 rounded-lg" aria-label={`${BRAND.name} — accueil`}>
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-royal/15">
              <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain p-1.5" priority />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-navy">{BRAND.name}</span>
              <span className="mt-1 hidden text-[0.7rem] font-medium text-navy/60 sm:block">{BRAND.descriptor}</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-5 xl:flex">
            {items.map((item) => (
              <li key={item.href}>
                <NavAnchor item={item} className={link} />
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 xl:flex">
            <AccountNavLink />
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal focus-royal inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              S’inscrire
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="focus-royal -mr-2 rounded-lg p-2 text-navy xl:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </nav>

        <div
          id="menu-mobile"
          hidden={!open}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-royal/10 bg-ivory px-5 pb-8 pt-2 xl:hidden"
        >
          <ul className="divide-y divide-royal/10">
            {items.map((item) => (
              <li key={item.href}>
                <NavAnchor
                  item={item}
                  onClick={() => setOpen(false)}
                  className="focus-royal flex min-h-[3.25rem] items-center justify-between font-display text-xl font-semibold text-navy"
                />
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4">
            <div onClick={() => setOpen(false)}>
              <AccountNavLink variant="mobile" />
            </div>
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal focus-royal rounded-full py-3.5 text-center text-base font-semibold"
            >
              S’inscrire
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
            <p className="text-center text-sm text-navy/60">{BRAND.tagline}</p>
          </div>
        </div>
      </header>
    </>
  );
}
