"use client";

import { useLayoutEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2, Bell } from "lucide-react";
import Sparkle from "@/components/ui/Sparkle";

const STORAGE_KEY = "lore_welcome_seen";

export default function WelcomeScreen() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"gate" | "email" | "success">("gate");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useLayoutEffect (not useEffect) so this resolves before the browser
  // paints — returning visitors never see a flash of the welcome screen.
  useLayoutEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Échec de l'inscription.");
        setSubmitting(false);
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, "1");
      setStep("success");
      setTimeout(() => setVisible(false), 1700);
    } catch {
      setError("Erreur réseau. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] overflow-hidden bg-lore-gradient dark:bg-lore-gradient-dark"
        >
          <Sparkle className="absolute left-[10%] top-[14%] hidden sm:block" size={26} />
          <Sparkle className="absolute right-[14%] top-[22%] hidden sm:block" size={18} />
          <Sparkle className="absolute left-[18%] bottom-[18%] hidden sm:block" size={20} />

          <div className="relative flex h-full flex-col items-center justify-center px-6 py-12 sm:px-10">
            <div className="flex w-full max-w-md flex-col items-center text-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 sm:h-20 sm:w-20">
                <Image
                  src="/logo.png"
                  alt="Loré Foundation"
                  fill
                  className="object-contain p-3"
                  priority
                />
              </span>

              <AnimatePresence mode="wait">
                {step === "gate" && (
                  <motion.div
                    key="gate"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="flex w-full flex-col items-center"
                  >
                    <h1 className="mt-8 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                      Ne manquez aucune annonce ni séminaire
                    </h1>
                    <p className="mt-4 max-w-sm text-base text-white/70">
                      Créez un compte avec votre email pour être notifié dès qu&apos;un
                      nouveau séminaire ou une annonce importante est publiée — ou
                      continuez directement, sans compte.
                    </p>

                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="btn-gold focus-ring mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.02]"
                    >
                      Créer un compte
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="focus-ring mt-4 text-sm font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline"
                    >
                      Continuer sans compte
                    </button>
                  </motion.div>
                )}

                {step === "email" && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="flex w-full flex-col items-center"
                  >
                    <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-lore-gold/15 text-lore-gold-light">
                      <Bell className="h-6 w-6" />
                    </span>
                    <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                      Quel est votre email ?
                    </h1>
                    <p className="mt-2 text-sm text-white/60">
                      Nous l&apos;utiliserons uniquement pour vous prévenir des nouveautés.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-3">
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        className="focus-ring w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-center text-white placeholder:text-white/40"
                      />

                      {error && <p className="text-sm text-red-300">{error}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold focus-ring inline-flex items-center justify-center gap-2 rounded-full py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
                      >
                        {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                        Confirmer
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setStep("gate")}
                      className="focus-ring mt-4 text-sm font-semibold text-white/60 hover:text-white"
                    >
                      Retour
                    </button>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 flex flex-col items-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lore-emerald/15 text-lore-emerald-light">
                      <CheckCircle2 className="h-8 w-8" />
                    </span>
                    <h1 className="mt-5 font-display text-2xl font-bold text-white">
                      Compte créé !
                    </h1>
                    <p className="mt-2 text-sm text-white/60">
                      Vous serez notifié des prochaines nouveautés.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
