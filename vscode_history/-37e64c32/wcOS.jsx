import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection({ onContinue }) {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [modules, setModules] = useState([]);

  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [error, setError] = useState("");

  // Charger les années au montage
  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setYears(data.data || []);
        } else {
          setError("Impossible de charger les années");
        }
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoadingYears(false));
  }, []);

  // Charger les filières quand une année est sélectionnée
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
        // Format attendu : { success: true, year_id: 1, data: [...] }
        if (data.success) {
          setFilieres(data.data || []);
        } else {
          setError("Aucune filière trouvée pour cette année");
          setFilieres([]);
        }
      })
      .catch(() => {
        setError("Erreur lors du chargement des filières");
        setFilieres([]);
      })
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // Charger les modules quand une filière est sélectionnée
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    setLoadingModules(true);

    fetch(`https://podo.b1.ma/api/public/filieres/${selectedFiliere.id}/modules`)
      .then((res) => res.json())
      .then((data) => {
        setModules(data.data || []);
      })
      .catch(() => setError("Erreur lors du chargement des modules"))
      .finally(() => setLoadingModules(false));
  }, [selectedFiliere]);

  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      onContinue({
        year: selectedYear,
        filiere: selectedFiliere,
        modules: modules,
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant !</h2>
        <p>Sélectionnez votre année, puis votre filière pour continuer.</p>
      </div>

      <div className="main-content">
        {/* Sélection Année */}
        <div className="section">
          <h2 className="section-title">Choisir l'année :</h2>
          {loadingYears ? (
            <p>Chargement des années...</p>
          ) : error && !selectedYear ? (
            <p className="info-box error">{error}</p>
          ) : (
            <div className="button-group">
              {years.map((year) => (
                <button
                  key={year.id}
                  className={`button ${selectedYear?.id === year.id ? "active" : ""}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year.name || `Année ${year.id}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sélection Filière */}
        {selectedYear && (
          <div className="section">
            <h2 className="section-title">Choisir la filière :</h2>
            {loadingFilieres ? (
              <p>Chargement des filières...</p>
            ) : filieres.length === 0 ? (
              <p className="info-box warning">Aucune filière disponible pour cette année.</p>
            ) : (
              <div className="button-group">
                {filieres.map((filiere) => (
                  <button
                    key={filiere.id}
                    className={`button ${selectedFiliere?.id === filiere.id ? "active success" : ""}`}
                    onClick={() => setSelectedFiliere(filiere)}
                  >
                    {filiere.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Affichage Modules (optionnel) */}
        {selectedFiliere && modules.length > 0 && (
          <div className="section">
            <h2 className="section-title">Modules ({modules.length}) :</h2>
            <div className="modules-grid">
              {modules.map((mod) => (
                <div key={mod.id} className="module-card">
                  <strong>{mod.name}</strong>
                  {mod.code && <p className="module-code">{mod.code}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton Continuer */}
        {selectedYear && selectedFiliere && (
          <div className="info-box success">
            <p>
              <strong>Année :</strong> {selectedYear.name}<br/>
              <strong>Filière :</strong> {selectedFiliere.name}
            </p>
            <button className="continue-button" onClick={handleContinue}>
              Continuer vers mes cours
            </button>
          </div>
        )}
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}