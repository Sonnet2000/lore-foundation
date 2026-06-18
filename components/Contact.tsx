"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { services, siteInfo } from "@/lib/data";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(siteInfo.whatsapp);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const message = formData.get("message") as string;

    const lines = [
      `Bonjour Loré Foundation, je m'appelle ${name}.`,
      service ? `Service souhaité : ${service}` : "",
      message ? `Message : ${message}` : "",
      email ? `Email : ${email}` : "",
      phone ? `Téléphone : ${phone}` : "",
    ].filter(Boolean);

    const url = `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    setWhatsappUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const inputClasses =
    "focus-ring rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-3 text-sm text-lore-ink placeholder:text-lore-ink/40 focus:border-lore-emerald dark:border-white/10 dark:bg-lore-night dark:text-white dark:placeholder:text-white/30 dark:focus:border-lore-emerald-light";

  const labelClasses = "text-sm font-semibold text-lore-ink dark:text-white";

  return (
    <section id="contact" className="bg-lore-cream px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Contact"
            title="Discutons de votre prochain projet"
            description="Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Contact info */}
          <AnimatedSection direction="left" className="flex flex-col gap-6">
            <div className="rounded-4xl bg-lore-dark p-8 text-white shadow-soft sm:p-10">
              <h3 className="font-display text-2xl font-bold">
                Informations de contact
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Une question avant de commencer ? Contactez-nous directement.
              </p>

              <div className="mt-8 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lore-gold/15 text-lore-gold">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Adresse</p>
                    <p className="text-sm text-white/60">{siteInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lore-gold/15 text-lore-gold">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Téléphone</p>
                    {siteInfo.phones.map((phone) => (
                      <p key={phone} className="text-sm text-white/60">
                        {phone}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lore-gold/15 text-lore-gold">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Email</p>
                    <p className="text-sm text-white/60">{siteInfo.email}</p>
                  </div>
                </div>
              </div>

              <a
                href={siteInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </div>

            <div className="rounded-4xl border border-lore-dark/10 bg-white p-8 shadow-card sm:p-10 dark:border-white/10 dark:bg-lore-night-surface dark:shadow-none">
              <h4 className="font-display text-lg font-bold text-lore-ink dark:text-white">
                Horaires
              </h4>
              <div className="mt-4 flex flex-col gap-2 text-sm text-lore-ink/60 dark:text-white/60">
                <div className="flex justify-between">
                  <span>Lundi – Vendredi</span>
                  <span className="font-semibold text-lore-ink dark:text-white">8h00 – 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold text-lore-ink dark:text-white">9h00 – 14h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-semibold text-lore-ink dark:text-white">Fermé</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="right">
            <div className="relative rounded-4xl bg-white p-8 shadow-card sm:p-10 dark:bg-lore-night-surface dark:shadow-none dark:ring-1 dark:ring-white/5">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                    <MessageCircle className="h-8 w-8" />
                  </span>
                  <h3 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
                    Redirection vers WhatsApp...
                  </h3>
                  <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                    Votre message est prêt. Si WhatsApp ne s&apos;est pas ouvert
                    automatiquement, cliquez sur le bouton ci-dessous pour
                    l&apos;envoyer à Loré Foundation.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-lore-emerald px-6 py-3 text-sm font-bold text-white shadow-gold transition-transform duration-200 hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ouvrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="focus-ring mt-2 rounded-full border border-lore-dark/10 px-6 py-2.5 text-sm font-semibold text-lore-ink transition-colors hover:bg-lore-cream dark:border-white/10 dark:text-white dark:hover:bg-lore-night"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label htmlFor="name" className={labelClasses}>
                      Nom complet
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Votre nom"
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label htmlFor="email" className={labelClasses}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label htmlFor="phone" className={labelClasses}>
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={siteInfo.phones[0]}
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label htmlFor="service" className={labelClasses}>
                      Service souhaité
                    </label>
                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      required
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Choisir un service
                      </option>
                      {services.map((s) => (
                        <option key={s.title} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="message" className={labelClasses}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Parlez-nous de votre projet..."
                      className={`resize-none ${inputClasses}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full bg-lore-dark px-8 py-3.5 text-sm font-bold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02] sm:col-span-2 sm:w-fit dark:bg-lore-emerald"
                  >
                    Envoyer via WhatsApp
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
