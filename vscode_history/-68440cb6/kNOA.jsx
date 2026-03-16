import React, { useState } from 'react';
import '../App.css';

export default function EtudiaSelection() {
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
  const [niveauSelectionne, setNiveauSelectionne] = useState(null);

  const annees = ['1er Année', '2eme Année', '3eme Année'];
  const niveaux = ['Technicien', 'Technicien Spécialisé'];

  const handleAnnee = (annee) => {
    setAnneeSelectionnee(annee);
  };

  const handleNiveau = (niveau) => {
    setNiveauSelectionne(niveau);
  };

  const handleContinue = () => {
    if (anneeSelectionnee && niveauSelectionne) {
      alert(`Année: ${anneeSelectionnee}\nNiveau: ${niveauSelectionne}`);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo-box">
          <span className="logo-icon">🎓</span>
        </div>
        <h1 className="logo-text">Etudia</h1>
        <p className="logo-subtitle">Learn more</p>
        <div className="wave"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Section Année */}
        <div className="section">
          <h2 className="section-title">Tu es dans :</h2>
          <div className="section-underline"></div>
          <div className="button-group">
            {annees.map((annee) => (
              <button
                key={annee}
                className={`button ${anneeSelectionnee === annee ? 'active' : ''}`}
                onClick={() => handleAnnee(annee)}
              >
                {annee}
              </button>
            ))}
          </div>
        </div>

        {/* Section Niveau */}
        <div className="section">
          <h2 className="section-title">Niveau :</h2>
          <div className="section-underline"></div>
          <div className="button-group">
            {niveaux.map((niveau) => (
              <button
                key={niveau}
                className={`button ${niveauSelectionne === niveau ? 'active' : ''}`}
                onClick={() => handleNiveau(niveau)}
              >
                {niveau}
              </button>
            ))}
          </div>
        </div>

        {/* Info et bouton continuer */}
        {anneeSelectionnee && niveauSelectionne && (
          <div className="info-box">
            <p>Année: {anneeSelectionnee}</p>
            <p>Niveau: {niveauSelectionne}</p>
            <button className="continue-button" onClick={handleContinue}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}