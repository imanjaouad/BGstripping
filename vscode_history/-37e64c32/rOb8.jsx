// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";

export default function HomePage() {
  const navigate = useNavigate();

  const [years, setYears] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);

  // 1. Récupérer toutes les années
  useEffect(() => {
    fetch(`${API_BASE}/years`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setYears(res.data);
      })
      .catch(() => setYears([]))
      .finally(() => setLoadingYears(false));
  }, []);

  // 2. Récupérer les filières par année
  useEffect(() => {
    if (!selectedYear?.id) {
      setFilieres([]);
      setSelectedFiliere(null);
      return;
    }

    setLoadingFilieres(true);
    fetch(`${API_BASE}/years/${selectedYear.id}/filieres`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setFilieres(res.data);
      })
      .catch(() => setFilieres([]))
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  const goToModules = () => {
    if (selectedYear && selectedFiliere) {
      navigate("/modules", {
        state: { year: selectedYear, filiere: selectedFiliere }
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Étudia" />
        </div>
      </div>

      <div className="main-content" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 className="text-center mb-lg" style={{ fontSize: "2.8rem", color: "#6366f1" }}>
          Étudia Modules
        </h1>

        {/* Années */}
        <div className="card mb-lg animate-fadeIn">
          <h2 className="section-title">Choisis ton année</h2>
          {loadingYears ? (
            <div className="loader"></div>
          ) : (
            <div className="modules-grid">
              {years.map(year => (
                <div
                  key={year.id}
                  className={`module-card ${selectedYear?.id === year.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedFiliere(null);
                  }}
                >
                  <h3>{year.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filières */}
        {selectedYear && (
          <div className="card animate-fadeIn">
            <h2 className="section-title">Choisis ta filière</h2>
            {loadingFilieres ? (
              <div className="loader"></div>
            ) : filieres.length === 0 ? (
              <p className="text-center">Aucune filière pour cette année.</p>
            ) : (
              <div className="modules-grid">
                {filieres.map(fil => (
                  <div
                    key={fil.id}
                    className={`module-card ${selectedFiliere?.id === fil.id ? "selected" : ""}`}
                    onClick={() => setSelectedFiliere(fil)}
                  >
                    <h3>{fil.name}</h3>
                    {fil.abbr && <span className="badge">{fil.abbr}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-lg">
          <button
            onClick={goToModules}
            disabled={!selectedYear || !selectedFiliere}
            className="btn-primary"
            style={{ padding: "1rem 4rem", fontSize: "1.3rem" }}
          >
            Voir les modules →
          </button>
        </div>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}