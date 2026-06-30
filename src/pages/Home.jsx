import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/home/Hero/Hero";
import TrustedBy from "../components/home/TrustedBy/TrustedBy";
import Services from "../components/home/Services/Services";
import RealWorldAssets from "../components/home/RealWorldAssets/RealWorldAssets";
import HowItWorks from "../components/home/HowItWorks/HowItWorks";
import MarketplacePreview from "../components/home/MarketplacePreview/MarketplacePreview";
import BlockchainViz from "../components/home/BlockchainViz/BlockchainViz";
import Platform from "../components/home/Platform/Platform";
import Leadership from "../components/home/Leadership/Leadership";
import Footer from "../components/home/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      <RealWorldAssets />
      <Services />
      <HowItWorks />
      <MarketplacePreview />
      <BlockchainViz />
      <Leadership />
      <Platform />
      <Footer />
    </>
  );
}

export default Home;
