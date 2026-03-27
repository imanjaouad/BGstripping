import DefinitionSection from "./DefinitionSection";
import OperationsSection from "./OperationsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import Accueill from "./Hero";


import "./Home.css";
export default function PoussageHome() {
  return (
    <div className="home-page">
      
    <Accueill/>
      <DefinitionSection />
      <OperationsSection />
      <CTASection />
      <Footer />
    </div>
  );}