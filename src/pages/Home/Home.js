import Navbar from "./navBare";
import Hero from "./Hero";
import DefinitionSection from "./DefinitionSection";
import OperationsSection from "./OperationsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

import Header from "./Header";
import "../../style/Home.css";
export default function Home() {
  return (
    <div className="home-page">
      <Header>
        <Navbar/>
      </Header>
      <Hero />
      <DefinitionSection />
      <OperationsSection />
      <CTASection />
      <Footer />
    </div>
  );
}