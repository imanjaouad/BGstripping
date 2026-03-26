import { Link } from "react-router-dom";
import "../../style/Home.css";
import IMGHero from "../../images/photoBackground.png";

export default function Hero() {
  return (
    <section
      className="hero-section position-relative overflow-hidden"
      style={{ backgroundImage: `url(${IMGHero})` }}
    >
      <div className="hero-overlay"></div>
      <div className="container position-relative h-100 d-flex align-items-center">
        <div className="hero-content text-white">
          <h1 className="display-4 fw-bold mb-4">
            Gestion Intelligente du Décapage de Phosphate
          </h1>
          <p className="lead mb-4">
            Optimisez vos opérations d'extraction, de stockage et de transport avec notre plateforme de gestion intégrée.
          </p>
        </div>
      </div>
    </section>
  );
}