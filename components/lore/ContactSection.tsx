import { Mail, MapPin, Phone } from "lucide-react";
import { getContactInfo } from "@/lib/site-info-server";
import { PLATFORM_META, socialLinkLabel } from "@/lib/site-info";
import SectionIntro from "./SectionIntro";

export default async function ContactSection() {
  const c = await getContactInfo();
  const item = "flex items-start gap-3 text-base text-navy/85";
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ivory px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionIntro
          id="contact-title"
          label="Contact"
          title="Parlons de votre projet d’études"
          description="Une question sur l’inscription ou les formations ? Écrivez-nous ou appelez-nous."
        />
        <div>
          <ul className="space-y-5">
            <li className={item}>
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
              {c.address}
            </li>
            {c.phones.map((p) => (
              <li key={p} className={item}>
                <Phone className="mt-1 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
                <a href={`tel:${p.replace(/\s/g, "")}`} className="focus-royal rounded underline-offset-4 hover:underline">{p}</a>
              </li>
            ))}
            <li className={item}>
              <Mail className="mt-1 h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
              <a href={`mailto:${c.email}`} className="focus-royal break-all rounded underline-offset-4 hover:underline">{c.email}</a>
            </li>
          </ul>
          {c.whatsappNumber && (
            <a
              href={`https://wa.me/${c.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal focus-royal mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
            >
              Écrire sur WhatsApp
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          )}
          <ul className="mt-8 flex flex-wrap gap-3">
            {c.socialLinks.map((l) => {
              const Icon = PLATFORM_META[l.platform].Icon;
              return (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${socialLinkLabel(l)} — Loré Fondation (s’ouvre dans un nouvel onglet)`}
                    className="focus-royal grid h-11 w-11 place-items-center rounded-full text-navy ring-1 ring-navy/20 transition-colors hover:bg-royal hover:text-white hover:ring-royal"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
