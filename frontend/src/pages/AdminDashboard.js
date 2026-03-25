import Hero from "./Home/Hero";
import DefinitionSection from "./Home/DefinitionSection";
import OperationsSection from "./Home/OperationsSection";
import CTASection from "./Home/CTASection";
import Footer from "./Home/Footer";
import "../style/Home.css";
import Header from "../components/Header";
import ReportsSection from "../components/ReportsSection";

export default function Home() {
  return (
    <div className="home-page">
      <Header/>
      <Hero />
      <DefinitionSection />
      <OperationsSection />
      <ReportsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
