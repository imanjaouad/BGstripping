import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules({ selection }) {
  const { filiere_id, annee, niveau } = selection || {};
  const [modules, setModules] = useState([]);
  const [filiere, setFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleSelectionne, setModuleSelectionne] = useState(null);

  useEffect(() => {
    if (!filiere_id) return;

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API modules");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setModules(json.data || []);
          setFiliere(json.filiere || null);
        } else {
          setError("Modules introuvables");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filiere_id]);

  const handleModuleClick = (module) => {
    setModuleSelectionne(module);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* WELCOME BOX */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace modules ! 📚</h2>
        <p>
          Ici, vous pouvez consulter tous vos modules, choisir celui que vous
          voulez suivre et accéder aux EFM.
        </p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="section-title">
          Modules pour {niveau} - {annee?.name}
        </h2>
        {filiere && <p className="filiere-info">Filière: {filiere.name}</p>}

        {loading && <p>Chargement des modules...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && modules.length === 0 && <p>Aucun module trouvé.</p>}

        {/* Bouton pour sélectionner le premier module */}
        {!loading && modules.length > 0 && (
          <button
            className="select-first-module-btn"
            onClick={() => handleModuleClick(modules[0])}
          >
            Sélectionner le premier module
          </button>
        )}

        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`module-card ${
                moduleSelectionne?.id === m.id ? "selected" : ""
              }`}
            >
              <div className="module-header">
                <h3>{m.name}</h3>
                <span className="module-code">{m.code}</span>
              </div>
              <p>
                Crédits: {m.credits} | Heures: {m.total_hours}
              </p>
              <p>Professeur: {m.instructor}</p>

              {m.efms && m.efms.length > 0 && (
                <div className="efms-section">
                  <strong>EFM :</strong>
                  <ul>
                    {m.efms.map((e) => (
                      <li key={e.id}>
                        <a
                          href={e.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="efm-link"
                        >
                          {e.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="select-module-btn"
                onClick={() => handleModuleClick(m)}
              >
                {moduleSelectionne?.id === m.id
                  ? "Sélectionné"
                  : "Choisir ce module"}
              </button>
            </div>
          ))}
        </div>

        {moduleSelectionne && (
          <div className="info-box">
            <p>Module sélectionné: {moduleSelectionne.name}</p>
            <button
              className="continue-button"
              onClick={() =>
                alert(`Vous avez choisi: ${moduleSelectionne.name}`)
              }
            >
              Continuer
            </button>
          </div>
        )}
      </div>

      {/* Triangles en bas */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}