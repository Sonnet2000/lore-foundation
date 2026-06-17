"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-lore-dark/80 shadow-soft backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href="#accueil" className="flex items-center gap-2 focus-ring rounded-lg">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
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

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded text-sm font-medium text-white/80 transition-colors hover:text-lore-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href="#contact"
            className="focus-ring rounded-full bg-lore-gold px-6 py-2.5 text-sm font-bold text-lore-dark shadow-gold transition-transform duration-200 hover:scale-105"
          >
            Commencer
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="focus-ring rounded-lg p-2 text-white"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-lore-dark/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2 sm:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-lg px-2 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-lore-gold"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="focus-ring mt-2 rounded-full bg-lore-gold px-6 py-3 text-center text-sm font-bold text-lore-dark shadow-gold"
              >
                Commencer
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
