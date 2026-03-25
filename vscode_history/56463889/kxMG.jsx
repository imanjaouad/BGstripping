import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from ".image_etudia-removebg-preview.png";

const PROXY = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://www.podo.b1.ma/api/public";

export default function EtudiaModules() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { year, filiere, modules = [] } = state || {};

  useEffect(() => {
    if (!year || !filiere) navigate("/selection", { replace: true });
  }, [year, filiere, navigate]);

  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>{year.name} - {filiere.name}</h2>
        <p>{modules.length} module{modules.length > 1 ? "s" : ""}</p>
      </div>

      <div className="main-content">
        <h2 className="section-title">Vos modules</h2>
        <div className="underline2"></div>

        <div className="modules-grid">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <h3>{m.name}</h3>
              {m.code && <span className="module-code">{m.code}</span>}
              {m.credits && <p>Crédits : {m.credits}</p>}
              {m.instructor && <p>Prof : {m.instructor}</p>}

              {m.efms && m.efms.length > 0 && (
                <div className="efms-section">
                  <strong>EFM :</strong>
                  <ul>
                    {m.efms.map(efm => (
                      <li key={efm.id}>
                        <a href={efm.file_path} target="_blank" rel="noopener noreferrer" className="efm-link">
                          {efm.title || "Télécharger"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="continue-button" onClick={() => navigate("/selection")}>
          Changer de filière
        </button>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}