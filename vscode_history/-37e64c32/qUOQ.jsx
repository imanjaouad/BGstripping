// src/components/EtudiaSelection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [modules, setModules] = useState([]);

  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [error, setError] = useState("");

  // Charger les années
  useEffect(() => {
    fetch(`${API_BASE}/years`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data.success && data.data) setYears(data.data);
        else setError("Aucune année trouvée.");
      })
      .catch(() => setError("Impossible de charger les années."))
      .finally(() => setLoadingYears(false));
  }, []);

  // Charger les filières
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }
    setLoadingFilieres(true);
    fetch(`${API_BASE}/years/${selectedYear.id}/filieres`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setFilieres(data.data);
        else setFilieres([]);
      })
      .catch(() => setFilieres([]))
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // Pré-charger les modules (pour affichage du nombre)
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }
    fetch(`${API_BASE}/filieres/${selectedFiliere.id}/modules`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setModules(data.data);
        else setModules([]);
      })
      .catch(() => setModules([]));
  }, [selectedFiliere]);

  const handleContinue = () => {
    if (!selectedYear || !selectedFiliere) return;
    navigate("/modules", {
      state: {
        year: selectedYear,
        filiere: selectedFiliere,
        modules,
      },
    });
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* CONTENU */}
      <div className="main-content">
        <div className="selection-hero">
          {/* Colonne gauche : explication + résumé */}
          <div className="selection-info">
            <span className="tag">Étape 1</span>
            <h2 className="selection-title">
              Choisis ton année et ta filière pour personnaliser ton espace.
            </h2>
            <p className="selection-text">
              Etudia adapte l’affichage de tes modules, cours et examens en
              fonction de ton niveau. Commence par sélectionner ton{" "}
              <strong>année de formation</strong>, puis ta{" "}
              <strong>filière</strong>.
            </p>

            <div className="selection-summary-box">
              <h3>Ce que tu vas obtenir :</h3>
              <ul>
                <li>La liste de tes modules pour cette filière</li>
                <li>Les cours associés à chaque module</li>
                <li>Les contrôles continus (CC) et EFM</li>
                <li>Les EFF liés à ta filière</li>
              </ul>
            </div>
          </div>

          {/* Colonne droite : cartes + boutons */}
          <div className="selection-panels">
            {/* Années */}
            <div className="selection-panel-card">
              <h3 className="section-title">1. Sélectionne ton année</h3>
              {loadingYears ? (
                <div className="loader" />
              ) : error ? (
                <div className="info-box error">{error}</div>
              ) : (
                <div className="button-group">
                  {years.map((y) => (
                    <button
                      key={y.id}
                      className={`button ${
                        selectedYear?.id === y.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedYear(y)}
                    >
                      {y.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filières */}
            <div className="selection-panel-card">
              <h3 className="section-title">2. Choisis ta filière</h3>
              {selectedYear ? (
                loadingFilieres ? (
                  <div className="loader" />
                ) : filieres.length === 0 ? (
                  <div className="info-box warning">
                    Aucune filière trouvée pour cette année.
                  </div>
                ) : (
                  <div className="button-group">
                    {filieres.map((f) => (
                      <button
                        key={f.id}
                        className={`button ${
                          selectedFiliere?.id === f.id ? "active success" : ""
                        }`}
                        onClick={() => setSelectedFiliere(f)}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <p className="selection-hint">
                  Commence par choisir une année à gauche.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Résumé + Continuer */}
        {selectedYear && selectedFiliere && (
          <div className="info-box success">
            <p>
              <strong>Parcours sélectionné :</strong>{" "}
              {selectedYear.name} · {selectedFiliere.name}
              <br />
              <span style={{ fontSize: "0.9rem", color: "#047857" }}>
                {modules.length} module(s) détecté(s) pour cette filière.
              </span>
            </p>
            <button className="continue-button" onClick={handleContinue}>
              Accéder à mes modules
            </button>
          </div>
        )}
      </div>

      {/* Décor */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle" />
        ))}
      </div>
    </div>
  );
}