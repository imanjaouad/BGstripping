// src/components/EtudiaSelection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  // États
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [modules, setModules] = useState([]);

  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [error, setError] = useState("");

  // 1. Charger les années
  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setYears(data.data);
        } else {
          setError("Impossible de charger les années");
        }
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoadingYears(false));
  }, []);

  // 2. Charger les filières quand on choisit une année
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }

    setLoadingFilieres(true);
    setError("");

    fetch(`https://podo.b1.ma/api/public/years/${selectedYear.id}/filieres`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setFilieres(data.data);
        } else {
          setError("Aucune filière trouvée");
          setFilieres([]);
        }
      })
      .catch(() => {
        setError("Erreur de chargement des filières");
        setFilieres([]);
      })
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // 3. Charger les modules dès qu'une filière est sélectionnée (prévisualisation)
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    setLoadingModules(true);

    fetch(`https://podo.b1.ma/api/public/filieres/${selectedFiliere.id}/modules`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setModules(data.data);
        } else {
          setModules([]);
        }
      })
      .catch(() => setModules([]))
      .finally(() => setLoadingModules(false));
  }, [selectedFiliere]);

  // Navigation finale
  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      navigate("/modules", {
        state: {
          year: selectedYear,
          filiere: selectedFiliere,
          modules: modules,
        },
      });
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* Message de bienvenue */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant !</h2>
        <p>Sélectionnez votre année et votre filière pour accéder à vos cours.</p>
      </div>

      <div className="main-content">
        {/* === Choix de l'année === */}
        <div className="section">
          <h2 className="section-title">1. Choisissez votre année</h2>
          <div className="underline1"></div>

          {loadingYears ? (
            <p>Chargement des années...</p>
          ) : error && years.length === 0 ? (
            <div className="info-box error">{error}</div>
          ) : (
            <div className="button-group">
              {years.map((year) => (
                <button
                  key={year.id}
                  className={`button ${selectedYear?.id === year.id ? "active" : ""}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === Choix de la filière === */}
        {selectedYear && (
          <div className="section">
            <h2 className="section-title">2. Choisissez votre filière</h2>
            <div className="underline2"></div>

            {loadingFilieres ? (
              <p>Chargement des filières...</p>
            ) : filieres.length === 0 ? (
              <div className="info-box warning">
                Aucune filière disponible pour cette année.
              </div>
            ) : (
              <div className="button-group">
                {filieres.map((filiere) => (
                  <button
                    key={filiere.id}
                    className={`button ${
                      selectedFiliere?.id === filiere.id ? "active success" : ""
                    }`}
                    onClick={() => setSelectedFiliere(filiere)}
                  >
                    {filiere.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === Aperçu des modules === */}
        {selectedFiliere && (
          <div className="section">
            <h2 className="section-title">
              Modules trouvés ({modules.length})
            </h2>
            {loadingModules ? (
              <p>Chargement des modules...</p>
            ) : modules.length > 0 ? (
              <div className="modules-grid">
                {modules.slice(0, 6).map((m) => (
                  <div key={m.id} className="module-card">
                    <strong>{m.name}</strong>
                    {m.code && <small className="module-code">{m.code}</small>}
                  </div>
                ))}
                {modules.length > 6 && (
                  <div className="module-card">
                    <em>… et {modules.length - 6} autres modules</em>
                  </div>
                )}
              </div>
            ) : (
              <p>Aucun module pour cette filière.</p>
            )}
          </div>
        )}

        {/* === Bouton Continuer === */}
        {selectedYear && selectedFiliere && (
          <div className="info-box success">
            <p>
              <strong>Année :</strong> {selectedYear.name}
              <br />
              <strong>Filière :</strong> {selectedFiliere.name}
              <br />
              <strong>Modules :</strong> {modules.length} disponibles
            </p>
            <button className="continue-button" onClick={handleContinue}>
              Accéder à mes cours
            </button>
          </div>
        )}
      </div>

      {/* Décoration bas de page */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}