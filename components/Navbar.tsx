"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Megaphone } from "lucide-react";
import { navLinks, type Announcement } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";
import AccountNavLink from "@/components/account/AccountNavLink";

type NavbarProps = {
  announcement?: Announcement | null;
  showSeminaires?: boolean;
};

export default function Navbar({ announcement = null, showSeminaires = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    if (!announcement) return;
    const dismissedId = window.localStorage.getItem("lore_dismissed_announcement");
    setBannerDismissed(dismissedId === announcement.id);
  }, [announcement]);

  function dismissBanner() {
    if (!announcement) return;
    window.localStorage.setItem("lore_dismissed_announcement", announcement.id);
    setBannerDismissed(true);
  }

  const links = showSeminaires
    ? [...navLinks.slice(0, 3), { label: "Séminaires", href: "#seminaires" }, ...navLinks.slice(3)]
    : navLinks;

  const showBanner = announcement !== null && !bannerDismissed;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "shadow-soft backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={
        scrolled || open
          ? { background: "rgba(5, 34, 56, 0.85)" }
          : undefined
      }
    >
      {/* Announcement banner */}
      {showBanner && announcement && (
        <div
          className="flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold text-[#1a1206] sm:text-sm"
          style={{ background: "linear-gradient(90deg, #F2D272, #D4AF37, #B8860B)" }}
        >
          <Megaphone className="h-4 w-4 shrink-0" />
          <span className="truncate">{announcement.message}</span>
          {announcement.linkUrl && (
            <a href={announcement.linkUrl} className="shrink-0 underline underline-offset-2">
              {announcement.linkLabel || "En savoir plus"}
            </a>
          )}
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Fermer l'annonce"
            className="ml-1 shrink-0 rounded-full p-0.5 hover:bg-black/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Bottom gold line when scrolled */}
      {scrolled && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px origin-left"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
        />
      )}

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2.5 focus-ring rounded-lg group">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 transition-all group-hover:ring-lore-gold/40">
            <Image
              src="/logo.png"
              alt="Loré Foundation"
              fill
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
            Loré Foundation
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring reveal-line rounded text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <AccountNavLink />
          <a
            href="#contact"
            className="btn-gold focus-ring rounded-full px-6 py-2.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
          >
            Commencer
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="focus-ring relative z-10 rounded-lg p-2 text-white"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-0 h-[100dvh] lg:hidden"
            style={{ background: "#080f1a" }}
          >
            {/* Ambient decoration */}
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-lore-gold/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-lore-emerald/8 blur-3xl pointer-events-none" />

            <div className="flex h-full flex-col px-6 pb-10 pt-24">
              <div className="flex flex-1 flex-col justify-center gap-1">
                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
                    className="focus-ring group flex items-center justify-between border-b border-white/5 py-4 px-3 text-2xl font-bold text-white/85 transition-colors hover:text-lore-gold-light"
                  >
                    {link.label}
                    <ArrowRight className="h-5 w-5 text-white/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-lore-gold-light" />
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div onClick={() => setOpen(false)}>
                  <AccountNavLink variant="mobile" />
                </div>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-gold focus-ring rounded-full py-4 text-center text-base font-bold"
                >
                  Démarrer un projet
                </a>
                <p className="text-center text-xs text-white/35">
                  Loré Foundation — Votre partenaire en innovation numérique
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
