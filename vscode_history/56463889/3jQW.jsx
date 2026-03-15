// src/components/EtudiaModules.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des données passées depuis EtudiaSelection
  const { year, filiere, modules: preloadedModules = [] } = location.state || {};

  // Si pas de données → retour à la sélection
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection", { replace: true });
    }
  }, [year, filiere, navigate]);

  const [modules, setModules] = useState(preloadedModules);
  const [loading, setLoading] = useState(preloadedModules.length === 0);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  // Charger les modules si pas déjà préchargés
  useEffect(() => {
    if (preloadedModules.length > 0) {
      setLoading(false);
      return;
    }

    if (!filiere?.id) return;

    setLoading(true);
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere.id}/modules`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les modules");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setModules(data.data || []);
        } else {
          setError("Aucun module trouvé pour cette filière");
        }
      })
      .catch(() => setError("Erreur de connexion"))
      .finally(() => setLoading(false));
  }, [filiere?.id, preloadedModules.length]);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const handleBack = () => {
    navigate("/selection");
  };

  if (!year || !filiere) {
    return null; // sera redirigé
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* Bienvenue */}
      <div className="welcome-box">
        <h2>Mes modules - {year.name}</h2>
        <p>
          Filière : <strong>{filiere.name}</strong>
        </p>
      </div>

      <div className="main-content">
        {/* Titre principal */}
        <div className="section">
          <h2 className="section-title">
            {modules.length} module{modules.length > 1 ? "s" : ""} disponible
            {modules.length > 1 ? "s" : ""}
          </h2>
          <div className="underline2"></div>
        </div>

        {/* Chargement / Erreur */}
        {loading && <p>Chargement des modules en cours...</p>}
        {error && <div className="info-box error">{error}</div>}

        {/* Liste des modules */}
        {!loading && modules.length === 0 && (
          <div className="info-box warning">Aucun module disponible pour le moment.</div>
        )}

        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-card ${selectedModule?.id === module.id ? "selected" : ""}`}
              onClick={() => handleModuleSelect(module)}
            >
              <div className="module-header">
                <h3>{module.name}</h3>
                {module.code && <span className="module-code">{module.code}</span>}
              </div>

              <div style={{ margin: "10px 0", fontSize: "14px", color: "#555" }}>
                {module.credits && <span>Crédits : {module.credits} </span>}
                {module.total_hours && <span>| Heures : {module.total_hours}h</span>}
              </div>

              {module.instructor && (
                <p style={{ fontStyle: "italic", color: "#007BFF" }}>
                  Professeur : {module.instructor}
                </p>
              )}

              {/* EFM disponibles */}
              {module.efms && module.efms.length > 0 && (
                <div className="efms-section">
                  <strong style={{ color: "#28A745" }}>EFM disponibles :</strong>
                  <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                    {module.efms.map((efm) => (
                      <li key={efm.id}>
                        <a
                          href={efm.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="efm-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {efm.title || "Télécharger EFM"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="select-module-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModuleSelect(module);
                }}
              >
                {selectedModule?.id === module.id ? "Sélectionné" : "Voir ce module"}
              </button>
            </div>
          ))}
        </div>

        {/* Résumé sélection */}
        {selectedModule && (
          <div className="info-box success">
            <p>
              <strong>Module sélectionné :</strong> {selectedModule.name}
              {selectedModule.code && ` (${selectedModule.code})`}
            </p>
            {selectedModule.efms?.length > 0 && (
              <p>Téléchargez vos EFM ci-dessus</p>
            )}
            <div style={{ marginTop: "15px" }}>
              <button className="continue-button" onClick={handleBack}>
                Changer de filière
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Décoration */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}