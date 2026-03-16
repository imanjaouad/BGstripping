import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les années au montage
  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API années");
        return res.json();
      })
      .then((data) => {
        setYears(data.data || data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Charger les filières quand une année est sélectionnée
  useEffect(() => {
    if (!selectedYear) return;

    setLoading(true);
    setSelectedFiliere(null);
    fetch(`https://podo.b1.ma/api/public/years/${selectedYear.id}/filieres`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API filières");
        return res.json();
      })
      .then((data) => {
        setFilieres(data.data || data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedYear]);

  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      navigate('/modules', { 
        state: {
          year: selectedYear,
          filiere: selectedFiliere,
          filiere_id: selectedFiliere.id
        }
      });
    }
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* MESSAGE/ INFO */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant ! 🎓</h2>
        <p>
          Choisissez votre année et votre filière pour accéder à vos modules,
          suivre vos cours et préparer vos examens efficacement.
        </p>
      </div>

      <div className="main-content">
        {loading && <p className="loading-text">Chargement...</p>}
        {error && <p className="error-message">Erreur: {error}</p>}

        {/* ANNÉES */}
        {!loading && years.length > 0 && (
          <div className="section">
            <h2 className="section-title">Année :</h2>
            <div className="button-group">
              {years.map((year) => (
                <button
                  key={year.id}
                  className={`button ${
                    selectedYear?.id === year.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedFiliere(null);
                  }}
                >
                  {year.name || year.year_name || `Année ${year.id}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FILIÈRES */}
        {selectedYear && !loading && (
          <div className="section">
            <h2 className="section-title">Filière :</h2>
            {filieres.length === 0 ? (
              <p>Aucune filière disponible pour cette année</p>
            ) : (
              <div className="filiere-grid">
                {filieres.map((filiere) => (
                  <button
                    key={filiere.id}
                    className={`filiere-button ${
                      selectedFiliere?.id === filiere.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedFiliere(filiere)}
                  >
                    <h3>{filiere.name || filiere.filiere_name}</h3>
                    {filiere.code && <p className="filiere-code">{filiere.code}</p>}
                    {filiere.description && <p className="filiere-desc">{filiere.description}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTINUER */}
        {selectedYear && selectedFiliere && (
          <div className="info-box">
            <p>Année : {selectedYear.name || selectedYear.year_name}</p>
            <p>Filière : {selectedFiliere.name || selectedFiliere.filiere_name}</p>
            <button className="continue-button" onClick={handleContinue}>
              Continuer
            </button>
          </div>
        )}
      </div>

      {/* DÉCORATION */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}