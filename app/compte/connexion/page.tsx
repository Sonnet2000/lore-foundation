import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import AuthShell from "@/components/account/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Connexion"
      subtitle="Accédez à votre espace membre Loré Foundation"
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/compte/inscription" className="font-semibold text-lore-gold-light hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
