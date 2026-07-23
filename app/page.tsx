import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import WelcomeScreen from "@/components/WelcomeScreen";
import Hero from "@/components/Hero";
import EcoleHighlight from "@/components/EcoleHighlight";
import AppDownload from "@/components/AppDownload";
import AdsBanner from "@/components/AdsBanner";
import AdUnit from "@/components/AdUnit";
import PremiumServices from "@/components/PremiumServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogBanner from "@/components/BlogBanner";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Portfolio from "@/components/Portfolio";
import Seminars from "@/components/Seminars";
import Testimonials from "@/components/Testimonials";
import Sponsors from "@/components/Sponsors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurveDivider from "@/components/ui/CurveDivider";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { getActiveAnnouncement, hasPublishedSeminars } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [announcement, showSeminaires] = await Promise.all([
    getActiveAnnouncement(),
    hasPublishedSeminars(),
  ]);

  return (
    <main>
      <WelcomeScreen />
      <Navbar announcement={announcement} showSeminaires={showSeminaires} />
      <Hero />

      <Suspense fallback={<SectionSkeleton />}>
        <EcoleHighlight />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <AppDownload />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <PremiumServices />
      </Suspense>
      <WhyChooseUs />
      <AdUnit slot="6310810361" className="py-10" />
      <BlogBanner />
      <Suspense fallback={<SectionSkeleton />}>
        <Team />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Portfolio />
      </Suspense>
      <Suspense fallback={null}>
        <AdsBanner />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Seminars />
      </Suspense>

      <div className="relative">
        <CurveDivider
          colorClassName="text-lore-dark dark:text-[#051a2b]"
          className="relative z-10 -mb-px"
        />
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <CurveDivider flip className="relative z-10 -mt-px" />
      </div>

      <Suspense fallback={null}>
        <Sponsors />
      </Suspense>
      <Contact />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
