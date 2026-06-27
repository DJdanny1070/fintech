import Hero              from "../components/home/Hero/Hero";
import TrustedBy         from "../components/home/TrustedBy/TrustedBy";
import Platform          from "../components/home/Platform/Platform";
import Solutions         from "../components/home/Solutions/Solutions";
import MarketplacePreview from "../components/home/MarketplacePreview/MarketplacePreview";
import BlockchainViz     from "../components/home/BlockchainViz/BlockchainViz";
import HowItWorks        from "../components/home/HowItWorks/HowItWorks";
import Testimonials      from "../components/home/Testimonials/Testimonials";
import FAQ               from "../components/home/FAQ/FAQ";
import Footer            from "../components/home/Footer/Footer";

function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Platform />
      <Solutions />
      <MarketplacePreview />
      <BlockchainViz />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;