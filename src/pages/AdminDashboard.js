import Hero from "../components/Hero";
import DefinitionSection from "../components/DefinitionSection";
import OperationsSection from "../components/OperationsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import "../style/Home.css";
import Header from "../components/Header";
import PoussageForm from "../components/PoussageForm";
import ReportsSection from "../components/ReportsSection";

export default function Home() {
  return (
    <div className="home-page">
      <Header/>
      <Hero />
      <PoussageForm />
      <DefinitionSection />
      <OperationsSection />
      <ReportsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
