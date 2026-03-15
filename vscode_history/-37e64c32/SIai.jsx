import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
// Assure-toi que le chemin de l'image est correct selon ton dossier
import logo from './images/image_etudia-removebg-preview.png';

const API_BASE = "https://podo.b1.ma/api/public";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  // États
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [modules, setModules] = useState([]);

  // États de chargement et erreur
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [error, setError] = useState("");

  <div className="bird" />

  // 1. CHARGER LES ANNÉES
  useEffect(() => {
    console.log("Tentative de connexion à:", `${API_BASE}/years`);
    
    fetch(`${API_BASE}/years`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Années reçues:", data);
        if (data.success && Array.isArray(data.data)) {
          setYears(data.data);
        } else {
          setError("Format de données invalide");
        }
      })
      .catch((err) => {
        console.error("Erreur Fetch Années:", err);
        setError("Impossible de charger les années (Vérifiez votre connexion)");
      })
      .finally(() => setLoadingYears(false));
  }, []);

  // 2. CHARGER LES FILIÈRES (Quand une année est choisie)
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }

    setLoadingFilieres(true);
    // Note: l'API demande {year_id}
    fetch(`${API_BASE}/years/${selectedYear.id}/filieres`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFilieres(data.data);
        } else {
          setFilieres([]);
        }
      })
      .catch((err) => {
        console.error("Erreur Filieres:", err);
        setFilieres([]);
      })
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // 3. CHARGER LES MODULES (Quand une filière est choisie)
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    setLoadingModules(true);
    // Note: l'API demande {filiere_id}
    fetch(`${API_BASE}/filieres/${selectedFiliere.id}/modules`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setModules(data.data);
        } else {
          setModules([]);
        }
      })
      .catch((err) => console.error("Erreur Modules:", err))
      .finally(() => setLoadingModules(false));
  }, [selectedFiliere]);

  // Navigation vers la page suivante
  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      navigate("/modules", {
        state: { 
          year: selectedYear, 
          filiere: selectedFiliere, 
          modules: modules 
        }
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
        {/* SECTION ANNÉES */}
        <div className="section">
          <h2 className="section-title">Année</h2>
          <div className="underline1"></div>

          {loadingYears ? (
            <p>Chargement des années...</p>
          ) : error ? (
            <div className="info-box error">{error}</div>
          ) : (
            <div className="button-group">
              {years.map((y) => (
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

        {/* SECTION FILIÈRES */}
        {selectedYear && (
          <div className="section">
            <h2 className="section-title">Filière</h2>
            <div className="underline2"></div>
            
            {loadingFilieres ? (
              <p>Chargement des filières...</p>
            ) : filieres.length === 0 ? (
              <p className="info-box warning">Aucune filière trouvée pour cette année.</p>
            ) : (
              <div className="button-group">
                {filieres.map((f) => (
                  <button
                    key={f.id}
                    className={`button ${selectedFiliere?.id === f.id ? "active success" : ""}`}
                    onClick={() => setSelectedFiliere(f)}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOUTON CONTINUER */}
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
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}