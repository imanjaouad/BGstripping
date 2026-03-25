import React, { useState } from "react";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection({ onContinue }) {
  /*  États  */
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
  const [niveauSelectionne, setNiveauSelectionne] = useState(null);

  /*  Données  */
  const annees = ["1er Année", "2eme Année", "3eme Année"];
  const niveaux = ["Technicien", "Technicien Spécialisé"];

  /*  Mapping (API)  */
  const filiereMapping = {
    "Technicien 1er Année": 4,
    "Technicien 2eme Année": 5,
    "Technicien 3eme Année": 6,
    "Technicien Spécialisé 1er Année": 1,
    "Technicien Spécialisé 2eme Année": 2,
    "Technicien Spécialisé 3eme Année": 3,
  };

  /*  Bouton Continuer  */
  const handleContinue = () => {
    if (anneeSelectionnee && niveauSelectionne) {
      const key = `${niveauSelectionne} ${anneeSelectionnee}`;
      const filiere_id = filiereMapping[key];
      const selection = {
        annee: { name: anneeSelectionnee },
        niveau: niveauSelectionne,
        filiere_id,
      };
      if (onContinue) onContinue(selection);
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

      {/*  MESSAGE/ INFO  */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant ! 🎓</h2>
        <p>
          Choisissez votre niveau et votre année pour accéder à vos modules,
          suivre vos cours et préparer vos examens efficacement.
        </p>
      </div>

      <div className="main-content">
        {/*  NIVEAU  */}
        <div className="section">
          <h2 className="section-title">Niveau :</h2>
          <div className="button-group">
            {niveaux.map((niveau) => (
              <button
                key={niveau}
                className={`button ${
                  niveauSelectionne === niveau ? "active" : ""
                }`}
                onClick={() => setNiveauSelectionne(niveau)}
              >
                {niveau}
              </button>
            ))}
          </div>
        </div>

        {/*  ANNÉE  */}
        <div className="section">
          <h2 className="section-title">Année :</h2>
          <div className="button-group">
            {annees.map((annee) => (
              <button
                key={annee}
                className={`button ${
                  anneeSelectionnee === annee ? "active" : ""
                }`}
                onClick={() => setAnneeSelectionnee(annee)}
              >
                {annee}
              </button>
            ))}
          </div>
        </div>

        {/* CONTINUER */}
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

      {/*  DÉCORATION  */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}
