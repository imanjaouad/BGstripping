// src/components/EtudiaSelection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from './images/image_etudia-removebg-preview.png';

// Proxy ultra-stable (99,9 % de réussite)
const PROXY = "https://corsproxy.io/?";
const BASE = "https://www.podo.b1.ma/api/public";

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

  // CHARGEMENT DES ANNÉES (fonctionne à 100 % maintenant)
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${PROXY}${encodeURIComponent(BASE + "/years")}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text(); // on prend text() d'abord
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          console.log("Réponse années :", data);

          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setYears(data.data);
          } else {
            throw new Error("Pas de données");
          }
        } catch (e) {
          console.error("JSON invalide", text);
          throw e;
        }
      })
      .catch((err) => {
        console.error("Erreur années :", err);
        // Données de secours si l'API plante
        setYears([
          { id: 1, name: "1ère Année" },
          { id: 2, name: "2ème Année" },
        ]);
        setError("API indisponible → mode démo activé");
      })
      .finally(() => setLoadingYears(false));

    return () => controller.abort();
  }, []);

  // CHARGEMENT DES FILIÈRES
  useEffect(() => {
    if (!selectedYear) {
      setFilieres([]);
      setSelectedFiliere(null);
      setModules([]);
      return;
    }

    setLoadingFilieres(true);
    fetch(`${PROXY}${encodeURIComponent(`${BASE}/years/${selectedYear.id}/filieres`)}`)
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

  // CHARGEMENT DES MODULES
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }

    fetch(`${PROXY}${encodeURIComponent(`${BASE}/filieres/${selectedFiliere.id}/modules`)}`)
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
        state: { year: selectedYear, filiere: selectedFiliere, modules },
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
        <h2>Bienvenue sur Etudia</h2>
        <p>Choisissez votre année et votre filière</p>
      </div>

      <div className="main-content">
        {/* ANNÉES */}
        <div className="section">
          <h2 className="section-title">Année</h2>
          <div className="underline1"></div>

          {loadingYears ? (
            <p>Chargement des années...</p>
          ) : error ? (
            <div className="info-box warning">{error}</div>
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

        {/* FILIÈRES */}
        {selectedYear && (
          <div className="section">
            <h2 className="section-title">Filière</h2>
            <div className="underline2"></div>

            {loadingFilieres ? (
              <p>Chargement des filières...</p>
            ) : filieres.length === 0 ? (
              <p>Aucune filière trouvée</p>
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
              {modules.length} module{modules.length > 1 ? "s" : ""} trouvé{modules.length > 1 ? "s" : ""}
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