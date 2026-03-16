// src/components/EtudiaSelection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../images/image_etudia-removebg-preview.png";

const API_BASE = "https://www.podo.b1.ma/api/public";

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

  // CHARGER LES ANNÉES
  useEffect(() => {
    fetch(`${API_BASE}/years`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setYears(data.data);
        } else {
          setError("Aucune année trouvée");
        }
      })
      .catch(() => {
        setError("Impossible de charger les années (en local : normal)");
      })
      .finally(() => setLoadingYears(false));
  }, []);

  // CHARGER LES FILIÈRES
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }

    setLoadingFilieres(true);
    fetch(`${API_BASE}/years/${selectedYear.id}/filieres`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setFilieres(data.data);
        }
      })
      .catch(() => setFilieres([]))
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // CHARGER LES MODULES
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    fetch(`${API_BASE}/filieres/${selectedFiliere.id}/modules`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setModules(data.data);
        }
      })
      .catch(() => setModules([]));
  }, [selectedFiliere]);

  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      navigate("/modules", {
        state: { year: selectedYear, filiere: selectedFiliere, modules }
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
        <h2>Bienvenue sur Etudia</h2>
        <p>Sélectionnez votre année et filière</p>
      </div>

      <div className="main-content">
        <div className="section">
          <h2 className="section-title">Année</h2>
          <div className="underline1"></div>

          {loadingYears ? (
            <p>Chargement des années...</p>
          ) : error ? (
            <div className="info-box warning">
              {error}
              {error.includes("local") && (
                <p><small>En local, l’API bloque (normal). Déploie sur Vercel/Netlify → ça marchera !</small></p>
              )}
            </div>
          ) : (
            <div className="button-group">
              {years.map(y => (
                <button
                  key={y.id}
                  className={`button ${selectedYear?.id === y.id ? "active" : ""}`}
                  onClick={() => setSelectedYear(y)}
                >
                  {y.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedYear && (
          <div className="section">
            <h2 className="section-title">Filière</h2>
            <div className="underline2"></div>
            {loadingFilieres ? <p>Chargement...</p> :
             filieres.length === 0 ? <p>Aucune filière</p> :
             <div className="button-group">
               {filieres.map(f => (
                 <button
                   key={f.id}
                   className={`button ${selectedFiliere?.id === f.id ? "active success" : ""}`}
                   onClick={() => setSelectedFiliere(f)}
                 >
                   {f.name}
                 </button>
               ))}
             </div>
            }
          </div>
        )}

        {selectedYear && selectedFiliere && (
          <div className="info-box success">
            <p>
              <strong>{selectedYear.name}</strong> → <strong>{selectedFiliere.name}</strong>
              <br />
              {modules.length} modules disponibles
            </p>
            <button className="continue-button" onClick={handleContinue}>
              Accéder aux modules
            </button>
          </div>
        )}
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}