import { Link } from "react-router-dom";
import "../../style/Home.css"

export default function CTASection() {
  return (
    <section className="py-5 cta-section text-white text-center">
      <div className="container">
        <h2 className="display-5 fw-bold mb-3">
          Bienvenue sur votre espace de gestion
        </h2>
        <p className="fs-5 mb-4">
          Accédez à vos outils et commencez à gérer vos opérations efficacement depuis votre tableau de bord.
        </p>
        <Link to="/dashboard" className="btn btn-light btn-lg text-success fw-bold">
          Accéder au tableau de bord
        </Link>
      </div>
    </section>
  );
}