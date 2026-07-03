"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  ImageOff,
  Play,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import TabCard from "@/components/ui/TabCard";
import Modal from "@/components/ui/Modal";
import SeminarGallery from "@/components/ui/SeminarGallery";
import { FieldLabel, TextInput } from "@/app/admin/_components/ui";
import type { Seminar } from "@/lib/data";

function formatDate(iso: string | null) {
  if (!iso) return "Date à confirmer";
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SeminarsClient({ items }: { items: Seminar[] }) {
  const [galleryFor, setGalleryFor] = useState<Seminar | null>(null);
  const [registering, setRegistering] = useState<Seminar | null>(null);

  return (
    <section
      id="seminaires"
      className="bg-lore-cream px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night"
    >
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Séminaires"
            title="Nos prochains séminaires"
            description="Participez à nos sessions de formation et de networking, en présentiel ou en ligne, et faites grandir vos compétences digitales."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((seminar, i) => {
            const cover = seminar.media[0];

            return (
              <AnimatedSection key={seminar.id} delay={(i % 3) * 0.08}>
                <TabCard className="h-full" noPadding>
                  <div className="flex h-full flex-col overflow-hidden">
                  <button
                    type="button"
                    onClick={() => seminar.media.length > 0 && setGalleryFor(seminar)}
                    className="focus-ring relative block aspect-[16/10] w-full bg-gradient-to-br from-lore-emerald/15 via-lore-cream to-lore-dark/10 dark:from-lore-emerald/10 dark:via-lore-night-surface dark:to-lore-dark/20"
                  >
                    {cover ? (
                      cover.type === "video" ? (
                        <>
                          <video
                            src={cover.url}
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lore-dark">
                              <Play className="h-5 w-5 fill-current" />
                            </span>
                          </div>
                        </>
                      ) : (
                        <Image src={cover.url} alt={seminar.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lore-dark/20 dark:text-white/20">
                        <ImageOff className="h-10 w-10" strokeWidth={1.5} />
                      </div>
                    )}
                  </button>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-lore-ink dark:text-white">
                      {seminar.title}
                    </h3>

                    <div className="mt-3 flex flex-col gap-1.5 text-sm text-lore-ink/60 dark:text-white/60">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                        {formatDate(seminar.startsAt)}
                      </span>
                      {seminar.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                          {seminar.location}
                        </span>
                      )}
                    </div>

                    {seminar.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-lore-ink/60 dark:text-white/60">
                        {seminar.description}
                      </p>
                    )}

                    <div className="mt-5">
                      {seminar.registrationOpen ? (
                        <button
                          type="button"
                          onClick={() => setRegistering(seminar)}
                          className="btn-gold focus-ring w-full rounded-full px-5 py-2.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.02]"
                        >
                          S&apos;inscrire
                        </button>
                      ) : (
                        <span className="inline-flex w-full items-center justify-center rounded-full bg-lore-dark/5 px-5 py-2.5 text-sm font-semibold text-lore-ink/40 dark:bg-white/5 dark:text-white/40">
                          Inscriptions fermées
                        </span>
                      )}
                    </div>
                  </div>
                  </div>
                </TabCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      <SeminarGallery
        title={galleryFor?.title ?? null}
        media={galleryFor?.media ?? []}
        onClose={() => setGalleryFor(null)}
      />

      <RegistrationModal seminar={registering} onClose={() => setRegistering(null)} />
    </section>
  );
}

function RegistrationModal({
  seminar,
  onClose,
}: {
  seminar: Seminar | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    onClose();
    // Wait for the close animation before clearing the form state.
    setTimeout(reset, 200);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!seminar) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/seminars/${seminar.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Échec de l'inscription.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={seminar !== null} onClose={handleClose}>
      {seminar && (
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-lore-ink dark:text-white">
                Inscription confirmée !
              </h3>
              <p className="mt-2 max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                Merci {name.split(" ")[0]}, votre place pour « {seminar.title} » est
                réservée. Nous vous contacterons avec les détails.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="focus-ring mt-6 rounded-full border border-lore-dark/10 px-6 py-2.5 text-sm font-semibold text-lore-ink transition-colors hover:bg-lore-cream dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-xl font-bold text-lore-ink sm:text-2xl dark:text-white">
                S&apos;inscrire
              </h3>
              <p className="mt-1 text-sm text-lore-ink/60 dark:text-white/60">
                {seminar.title}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <FieldLabel>Nom complet</FieldLabel>
                  <TextInput
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <TextInput
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                  />
                </div>
                <div>
                  <FieldLabel>Téléphone (optionnel)</FieldLabel>
                  <TextInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+509 ..."
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmer mon inscription
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
