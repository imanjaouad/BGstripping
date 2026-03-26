import { Link } from "react-router-dom";
import "../../style/Home.css"

export default function CTASection() {
  return (
    <section className="py-5 cta-section text-white text-center">
<<<<<<< HEAD
      <div className="container">
        <h2 className="display-5 fw-bold mb-3">
          Rapports & Administration
        </h2>
        <p className="fs-5 mb-4">
          Accédez à vos outils, consultez vos rapports, et gérez vos opérations efficacement.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Default CTA Button */}
          <Link to="/reports" className="btn btn-light btn-lg text-success fw-bold">
            Consulter les Rapports
          </Link>
        </div>
      </div>
=======

>>>>>>> d0e94413d47d16dd121cff556781afa4292fd64f
    </section>
  );
}