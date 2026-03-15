import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
  const [niveauSelectionne, setNiveauSelectionne] = useState(null);

  const annees = ["1er Année", "2eme Année", "3eme Année"];
  const niveaux = ["Technicien", "Technicien Spécialisé"];

  const filiereMapping = {
    "Technicien 1er Année": 4,
    "Technicien 2eme Année": 5,
    "Technicien 3eme Année": 6,
    "Technicien Spécialisé 1er Année": 1,
    "Technicien Spécialisé 2eme Année": 2,
    "Technicien Spécialisé 3eme Année": 3,
  };

  const handleContinue = () => {
    if (!anneeSelectionnee || !niveauSelectionne) return;

    const key = `${niveauSelectionne} ${anneeSelectionnee}`;
    const filiere_id = filiereMapping[key];

    // navigation vers le composant modules
    navigate("/modules", {
      state: {
        selection: {
          annee: { name: anneeSelectionnee },
          niveau: niveauSelectionne,
          filiere_id,
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
        <p>Choisissez votre niveau et votre année pour continuer.</p>
      </div>

      <div className="main-content">
        {/* Niveau */}
        <div className="section">
          <h2 className="section-title">Niveau :</h2>
          <div className="button-group">
            {niveaux.map((n) => (
              <button
                key={n}
                className={`button ${niveauSelectionne === n ? "active" : ""}`}
                onClick={() => setNiveauSelectionne(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Année */}
        <div className="section">
          <h2 className="section-title">Année :</h2>
          <div className="button-group">
            {annees.map((a) => (
              <button
                key={a}
                className={`button ${anneeSelectionnee === a ? "active" : ""}`}
                onClick={() => setAnneeSelectionnee(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton Continuer */}
        {anneeSelectionnee && niveauSelectionne && (
          <div className="info-box">
            <p>Niveau : {niveauSelectionne}</p>
            <p>Année : {anneeSelectionnee}</p>

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
