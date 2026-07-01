import type { Metadata } from "next";
import AuthShell from "@/components/account/AuthShell";
import NewPasswordForm from "./NewPasswordForm";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthShell title="Nouveau mot de passe" subtitle="Choisissez un mot de passe pour votre compte">
      <NewPasswordForm />
    </AuthShell>
  );
}
