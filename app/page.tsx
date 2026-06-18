import Navbar from "@/components/Navbar";
import WelcomeScreen from "@/components/WelcomeScreen";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Portfolio from "@/components/Portfolio";
import Seminars from "@/components/Seminars";
import Testimonials from "@/components/Testimonials";
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
      <WhyChooseUs />
      <Services />
      <Team />
      <Portfolio />
      <Seminars />

      <div className="relative">
        <CurveDivider
          colorClassName="text-lore-dark dark:text-[#051a2b]"
          className="relative z-10 -mb-px"
        />
        <Testimonials />
        <CurveDivider flip className="relative z-10 -mt-px" />
      </div>

      <Contact />
      <Footer />
    </main>
  );
}
