import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/account/AuthShell";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Rejoignez l'espace membre Loré Foundation"
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/compte/connexion" className="font-semibold text-lore-gold-light hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
