import Navbar from "@/components/Navbar";
import WelcomeScreen from "@/components/WelcomeScreen";
import Hero from "@/components/Hero";
import EcoleHighlight from "@/components/EcoleHighlight";
import AdsBanner from "@/components/AdsBanner";
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
      <EcoleHighlight />
      <Services />
      <WhyChooseUs />
      <BlogBanner />
      <Team />
      <Portfolio />
      <AdsBanner />
      <Seminars />

      <div className="relative">
        <CurveDivider
          colorClassName="text-lore-dark dark:text-[#051a2b]"
          className="relative z-10 -mb-px"
        />
        <Testimonials />
        <CurveDivider flip className="relative z-10 -mt-px" />
      </div>

      <Sponsors />
      <Contact />
      <Footer />
    </main>
  );
}
