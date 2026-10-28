import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/lore/Hero";
import Programs from "@/components/lore/Programs";
import StudentLife from "@/components/lore/StudentLife";
import DigitalHub from "@/components/lore/DigitalHub";
import Identity from "@/components/lore/Identity";
import Anthem from "@/components/lore/Anthem";
import MissionValues from "@/components/lore/MissionValues";
import Faq from "@/components/lore/Faq";
import ContactSection from "@/components/lore/ContactSection";
import KnowledgeSearch from "@/components/lore/KnowledgeSearch";
import KnowledgeHub from "@/components/lore/KnowledgeHub";
import Seminars from "@/components/Seminars";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { getActiveAnnouncement } from "@/lib/site-content";
import { getKnowledge } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Loré Fondation",
  description: "Centre de formation en informatique. L’excellence au cœur de l’impact.",
  url: "https://lorefondation.com",
  logo: "https://lorefondation.com/logo.png",
  slogan: "L’excellence au cœur de l’impact",
  address: { "@type": "PostalAddress", addressLocality: "Cap-Haïtien", addressCountry: "HT" },
};

export default async function Home() {
  const [announcement, knowledge] = await Promise.all([getActiveAnnouncement(), getKnowledge()]);
  const categories = new Set(knowledge.articles.map((a) => a.category)).size;
  // Compteurs issus de la base ; un compteur à zéro n'est pas affiché.
  const stats = [
    { value: knowledge.courseCount, label: knowledge.courseCount > 1 ? "formations" : "formation" },
    { value: knowledge.articles.length, label: knowledge.articles.length > 1 ? "articles publiés" : "article publié" },
    { value: categories, label: categories > 1 ? "thèmes" : "thème" },
  ].filter((s) => s.value > 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <Navbar announcement={announcement} />
      <main id="contenu">
        <Hero />
        <KnowledgeSearch items={knowledge.items} stats={stats} />
        <Suspense fallback={<SectionSkeleton />}>
          <Programs />
        </Suspense>
        <KnowledgeHub articles={knowledge.articles} />
        <StudentLife />
        {/* Annonces / séminaires publiés : la section n'apparaît que s'il y en a. */}
        <Suspense fallback={null}>
          <Seminars />
        </Suspense>
        <DigitalHub />
        <Identity />
        <Anthem />
        <MissionValues />
        <Faq />
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
