import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from './images/image_etudia-removebg-preview.png';
const PROXY = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://www.podo.b1.ma/api/public";

export default function EtudiaSelection() {
  const navigate = useNavigate();

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
    fetch(`${PROXY}${BASE_URL}/years`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setYears(data.data);
        } else {
          setError("Données années invalides");
        }
      })
      .catch(() => setError("Connexion impossible"))
      .finally(() => setLoadingYears(false));
  }, []);

  // 2. Charger les filières
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }

    setLoadingFilieres(true);
    fetch(`${PROXY}${BASE_URL}/years/${selectedYear.id}/filieres`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setFilieres(data.data);
        } else {
          setFilieres([]);
        }
      })
      .catch(() => setFilieres([]))
      .finally(() => setLoadingFilieres(false));
  }, [selectedYear]);

  // 3. Charger les modules
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    setLoadingModules(true);
    fetch(`${PROXY}${BASE_URL}/filieres/${selectedFiliere.id}/modules`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setModules(data.data);
        }
      })
      .catch(() => setModules([]))
      .finally(() => setLoadingModules(false));
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
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>Bienvenue !</h2>
        <p>Choisissez votre année et filière</p>
      </div>

      <div className="main-content">
        {/* Années */}
        <div className="section">
          <h2 className="section-title">Année</h2>
          <div className="underline1"></div>

          {loadingYears ? <p>Chargement des années...</p> :
           error ? <div className="info-box error">{error}</div> :
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
          }
        </div>

        {/* Filières */}
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

        {/* Bouton Continuer */}
        {selectedYear && selectedFiliere && (
          <div className="info-box success">
            <p><strong>{selectedYear.name}</strong> → <strong>{selectedFiliere.name}</strong></p>
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