import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
<<<<<<< HEAD
import "../../style/Home.css"
import IMGHero from "../../images/hero-phosphate-kweqZRh2w4LhFWCPyyzPjt.png"
export default function Hero() {
  return (
    <section className="hero-section position-relative overflow-hidden">
      <img
        src={IMGHero}
        alt="Phosphate mining"
        className="hero-image"
      />
=======
>>>>>>> clean-IMANE
import "../../style/Home.css";
import IMGHero from "../../images/photoBackground.png";

export default function Hero() {
  return (
    <section
      className="hero-section position-relative overflow-hidden"
      style={{ backgroundImage: `url(${IMGHero})` }}
    >
<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> clean-IMANE
      <div className="hero-overlay"></div>
      <div className="container position-relative h-100 d-flex align-items-center">
        <div className="hero-content text-white">
          <h1 className="display-4 fw-bold mb-4">
            Gestion Intelligente du Décapage de Phosphate
          </h1>
          <p className="lead mb-4">
            Optimisez vos opérations d'extraction, de stockage et de transport avec notre plateforme de gestion intégrée.
          </p>
<<<<<<< HEAD
=======
<<<<<<< HEAD
          
=======
>>>>>>> main
>>>>>>> clean-IMANE
        </div>
      </div>
    </section>
  );
}