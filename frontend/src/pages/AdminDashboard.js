import Navbar from "../components/navBare";
import Hero from "../components/Hero";
import DefinitionSection from "../components/DefinitionSection";
import OperationsSection from "../components/OperationsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import "../style/Home.css";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="home-page">
      <Header/>
      <Hero />
      <DefinitionSection />
      <OperationsSection />
      <CTASection />
      <Footer />
    </div>
  );
}