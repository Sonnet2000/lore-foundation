import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurveDivider from "@/components/ui/CurveDivider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <Services />
      <Team />
      <Portfolio />

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
