import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getActiveAnnouncement, hasPublishedSeminars } from "@/lib/site-content";

/**
 * Anvlòp comen pou paj ki BEZWEN menm Navbar/Footer ak paj Accueil la.
 * Sa evite chak paj rekopye menm lojik pou récupérer bandwol anons lan
 * ak si Séminaires dwe parèt nan meni an.
 *
 * Paj tankou /don, /soutenir, /paiement ak /compte/* GA POU rete san sa a
 * expressément — yo fèt pou yo san distraksyon pandan yon acha/koneksyon.
 */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [announcement, showSeminaires] = await Promise.all([
    getActiveAnnouncement(),
    hasPublishedSeminars(),
  ]);

  return (
    <>
      <Navbar announcement={announcement} showSeminaires={showSeminaires} />
      {/* Espas pou konpanse Navbar ki 'fixed' — evite kontni paj yo kache anba l */}
      <div className={announcement ? "h-28 sm:h-24" : "h-16"} aria-hidden="true" />
      {children}
      <Footer />
    </>
  );
}
