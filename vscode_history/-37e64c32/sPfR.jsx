import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  const [annees, setAnnees] = useState([]);
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

  const [filieres, setFilieres] = useState([]);
  const [filiereSelectionnee, setFiliereSelectionnee] = useState(null);

  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);

  // 1️⃣ Récupérer toutes les années
  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnees(data.data || []);
        setLoadingAnnees(false);
      })
      .catch(() => setLoadingAnnees(false));
  }, []);

  // 2️⃣ Récupérer les filières dès qu'une année est sélectionnée
  useEffect(() => {
    if (!anneeSelectionnee) return;

    setLoadingFilieres(true);
    setFilieres([]);
    setFiliereSelectionnee(null);

    fetch(
      `https://podo.b1.ma/api/public/years/${anneeSelectionnee.id}/filieres`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFilieres(data.data || []);
        setLoadingFilieres(false);
      })
      .catch(() => setLoadingFilieres(false));
  }, [anneeSelectionnee]);

  const handleContinue = () => {
    if (!anneeSelectionnee || !filiereSelectionnee) return;

    navigate("/modules", {
      state: {
        selection: {
          annee: anneeSelectionnee,
          filiere: filiereSelectionnee,
        },
      },
    });
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

      {/* Message */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant 🎓</h2>
        <p>Choisissez votre année et votre filière pour continuer.</p>
      </div>

      <div className="main-content">
        {/* Sélection Année */}
        <div className="section">
          <h2 className="section-title">Année :</h2>
          {loadingAnnees && <p>Chargement des années...</p>}
          <div className="button-group">
            {annees.map((a) => (
              <button
                key={a.id}
                className={`button ${
                  anneeSelectionnee?.id === a.id ? "active" : ""
                }`}
                onClick={() => setAnneeSelectionnee(a)}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sélection Filière */}
        {loadingFilieres && <p>Chargement des filières...</p>}
        {filieres.length > 0 && (
          <div className="section">
            <h2 className="section-title">Filière :</h2>
            <div className="button-group">
              {filieres.map((f) => (
                <button
                  key={f.id}
                  className={`button ${
                    filiereSelectionnee?.id === f.id ? "active" : ""
                  }`}
                  onClick={() => setFiliereSelectionnee(f)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bouton Continuer */}
        {anneeSelectionnee && filiereSelectionnee && (
          <div className="info-box">
            <p>Année : {anneeSelectionnee.name}</p>
            <p>Filière : {filiereSelectionnee.name}</p>

            <button className="continue-button" onClick={handleContinue}>
              Continuer
            </button>
          </div>
        )}
      </div>

      {/* Décor triangles */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}
