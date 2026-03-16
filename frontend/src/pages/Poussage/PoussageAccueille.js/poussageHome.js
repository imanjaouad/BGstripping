import DefinitionSection from "./DefinitionSection";
import OperationsSection from "./OperationsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";


import "./Home.css";
export default function PoussageHome() {
  return (
    <div className="home-page">
      <OperationsSection />
    
      <DefinitionSection />
      
      <CTASection />
      <Footer />
    </div>
  );}