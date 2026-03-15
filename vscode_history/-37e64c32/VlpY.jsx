import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [filiereSelectionnee, setFiliereSelectionnee] = useState(null);
  const [loading, setLoading] = useState(false);

  const annees = [
    { id: 1, name: "1er Année" },
    { id: 2, name: "2eme Année" },
    { id: 3, name: "3eme Année" },
  ];

  // Dès qu'une année est sélectionnée, on récupère les filières correspondantes
  useEffect(() => {
    if (!anneeSelectionnee) return;

    setLoading(true);
    setFilieres([]);
    setFiliereSelectionnee(null);

    fetch(`https://podo.b1.ma/api/public/years/${anneeSelectionnee.id}/filieres`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFilieres(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setFilieres([]);
        setLoading(false);
      });
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
      {/* HEADER */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* MESSAGE */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant 🎓</h2>
        <p>Choisissez votre année et votre filière pour continuer.</p>
      </div>

      <div className="main-content">
        {/* Année */}
        <div className="section">
          <h2 className="section-title">Année :</h2>
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

        {/* Filière */}
        {loading && <p>Chargement des filières...</p>}
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
