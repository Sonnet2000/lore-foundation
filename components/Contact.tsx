"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";
import { DEFAULT_CONTACT, type ContactInfo } from "@/lib/site-info";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

  useEffect(() => {
    fetch("/api/site-info")
      .then((r) => r.json())
      .then((data: ContactInfo) => setContact(data))
      .catch(() => {});
  }, []);

  const primaryWhatsappUrl =
    contact.socialLinks.find((l) => l.platform === "whatsapp")?.url ||
    `https://wa.me/${contact.whatsappNumber}`;

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
      service ? `Objet : ${service}` : "",
      message ? `Message : ${message}` : "",
      email ? `Email : ${email}` : "",
      phone ? `Téléphone : ${phone}` : "",
    ].filter(Boolean);

    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    setWhatsappUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const inputClasses =
    "focus-ring input-premium w-full rounded-xl border border-lore-dark/10 bg-white px-4 py-3.5 text-sm text-lore-ink placeholder:text-lore-ink/35 transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-lore-night-card dark:text-white dark:placeholder:text-white/30 dark:focus:border-lore-emerald-light";

  const labelClasses = "block text-xs font-bold uppercase tracking-[0.15em] text-lore-ink/70 dark:text-white/60 mb-1.5";

  return (
    <section
      id="contact"
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-lore-cream dark:bg-lore-night overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(15,152,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 0% 0%, rgba(212,175,55,0.04) 0%, transparent 40%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Contact & Engagement"
            title="Rejoignez le mouvement"
            description="Que vous souhaitiez faire du bénévolat, devenir partenaire ou soutenir nos projets, nous serions ravis d'échanger avec vous. Ensemble, nous pouvons faire davantage."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-8 sm:mt-18 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Info panel */}
          <AnimatedSection direction="left" className="flex flex-col gap-6">
            {/* Contact card */}
            <div
              className="rounded-3xl p-8 text-white sm:p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0A3D62 0%, #052238 100%)" }}
            >
              {/* Inner gold accent */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
              />

              <h3 className="font-display text-2xl font-bold">Informations de contact</h3>
              <p className="mt-2 text-sm text-white/55">
                Une question avant de commencer ? Contactez-nous directement.
              </p>

              <div className="mt-8 flex flex-col gap-5">
                {[
                  { icon: MapPin, label: "Adresse", value: contact.address },
                  { icon: Phone, label: "Téléphone", value: contact.phones.join(" · ") },
                  { icon: Mail, label: "Email", value: contact.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "rgba(212,175,55,0.12)" }}
                    >
                      <Icon className="h-5 w-5 text-lore-gold" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50">{label}</p>
                      <p className="text-sm text-white/80 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={primaryWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </div>

            {/* Hours card */}
            <div className="rounded-3xl border border-lore-dark/8 bg-white p-8 dark:border-white/8 dark:bg-lore-night-card">
              <h4 className="font-display text-base font-bold text-lore-ink dark:text-white">
                Horaires d&apos;ouverture
              </h4>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                {[
                  { day: "Lundi – Vendredi", hours: "8h00 – 18h00" },
                  { day: "Samedi", hours: "9h00 – 14h00" },
                  { day: "Dimanche", hours: "Fermé" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between items-center border-b border-lore-dark/5 pb-3 last:border-0 last:pb-0 dark:border-white/5">
                    <span className="text-lore-ink/55 dark:text-white/50">{day}</span>
                    <span className="font-semibold text-lore-ink dark:text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="right">
            <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10 dark:bg-lore-night-card dark:shadow-none dark:ring-1 dark:ring-white/6 relative overflow-hidden">
              {/* Gold top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, #d4af37, #f2d272, #d4af37)" }}
              />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[360px] flex-col items-center justify-center gap-5 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                    <MessageCircle className="h-8 w-8" />
                  </span>
                  <h3 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
                    Redirection vers WhatsApp…
                  </h3>
                  <p className="max-w-sm text-sm text-lore-ink/55 dark:text-white/55">
                    Votre message est prêt. Si WhatsApp ne s&apos;est pas ouvert
                    automatiquement, cliquez ci-dessous.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-lore-emerald px-6 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ouvrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="focus-ring mt-1 rounded-full border border-lore-dark/10 px-6 py-2.5 text-sm font-semibold text-lore-ink transition-colors hover:bg-lore-cream dark:border-white/10 dark:text-white dark:hover:bg-lore-night"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label htmlFor="name" className={labelClasses}>Nom complet</label>
                    <input id="name" name="name" type="text" required placeholder="Votre nom" className={inputClasses} />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input id="email" name="email" type="email" required placeholder="vous@exemple.com" className={inputClasses} />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="phone" className={labelClasses}>Téléphone</label>
                    <input id="phone" name="phone" type="tel" placeholder={contact.phones[0]} className={inputClasses} />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="service" className={labelClasses}>Je souhaite</label>
                    <select id="service" name="service" defaultValue="" required className={inputClasses}>
                      <option value="" disabled>Choisir une option</option>
                      <option value="Bénévolat / Volontariat">🤝 Bénévolat / Volontariat</option>
                      <option value="Devenir partenaire">🌐 Devenir partenaire</option>
                      <option value="Soutenir financièrement">💙 Soutenir financièrement</option>
                      {services.map((s) => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message" className={labelClasses}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Parlez-nous de votre projet…"
                      className={`resize-none ${inputClasses}`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="btn-gold focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.02]"
                    >
                      Envoyer via WhatsApp
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
