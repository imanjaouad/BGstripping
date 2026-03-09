import { Link } from "react-router-dom";
import "../../style/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div>
            <h5>BGstripping</h5>
            <p>
              Plateforme de gestion intégrée pour les opérations
              de décapage de phosphate.
            </p>
          </div>

          <div>
            <h5>Navigation</h5>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/operations">Opérations</Link></li>
              <li><Link to="/reports">Rapports</Link></li>
            </ul>
          </div>

          <div>
            <h5>Opérations</h5>
            <ul>
              <li><Link to="/operations/poussage">Poussage</Link></li>
              <li><Link to="/operations/cumenage">Cumenage</Link></li>
              <li><Link to="/operations/transport">Transport</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-divider"></div>

        <p className="footer-copy">
          © 2026 Phosphate Management System. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}